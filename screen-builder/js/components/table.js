// Component registry module — see docs/component-module-migration.md
// table: data table with sortable columns, cell types (text/checkbox/link/action),
// add/remove rows & columns, and per-column configuration.
//
// setup(content) both builds a fresh table and *hydrates* an existing one (restored from
// a save, history, or live sync): every header cell, row and cell is (re)wired from the
// DOM alone, so no other module needs to re-implement the table's behaviour. It is
// idempotent per <table> element — repeated calls return the same controller.
window.Components = window.Components || {};

(function () {
    const ColumnTypes = {
        CHECKBOX: 'checkbox',
        TEXT: 'text',
        LINK: 'link',
        ACTION: 'action (icon)'
    };

    // Placeholder text per type. A cell still showing a placeholder gets the new type's
    // placeholder on a type change; anything the user typed is carried across.
    const DEFAULT_TEXT = {
        [ColumnTypes.TEXT]: 'Cell Text',
        [ColumnTypes.LINK]: 'Link Text',
        [ColumnTypes.ACTION]: 'Action'
    };
    const DEFAULT_ICON = 'fas fa-bolt';
    const MAX_ROWS = 20;
    const isPlaceholder = (text) => Object.values(DEFAULT_TEXT).includes(text);

    // One resize / one open column menu at a time across every table, so the document
    // listeners are registered once for the page instead of once per setup() call.
    const shared = { resize: null, activeControls: null };
    if (!window.__dtTableDocListeners) {
        window.__dtTableDocListeners = true;

        document.addEventListener('mousemove', (e) => {
            const r = shared.resize;
            if (!r) return;
            const delta = e.pageX - r.startX;
            r.th.style.width = `${Math.max(60, r.startWidth + delta)}px`;
            r.line.style.transform = `translateX(${delta}px)`;
        });

        document.addEventListener('mouseup', () => {
            const r = shared.resize;
            if (!r) return;
            r.overlay.remove();
            r.line.remove();
            shared.resize = null;
        });

        document.addEventListener('click', (e) => {
            const c = shared.activeControls;
            if (c && !c.contains(e.target)) {
                c.style.display = 'none';
                shared.activeControls = null;
            }
        });
    }

    // ---- cell content ---------------------------------------------------------------

    // What a cell holds, independent of its type. Values stashed in data-dt-* survive a
    // detour through a type that can't show them (e.g. text -> checkbox -> text).
    const readCell = (td) => {
        const saved = {
            text: td.dataset.dtText,
            icon: td.dataset.dtIcon,
            checked: td.dataset.dtChecked === 'true'
        };
        const checkbox = td.querySelector('.fa-square');
        if (checkbox) {
            const check = checkbox.querySelector('.fa-square-check');
            saved.checked = !!check && check.style.display !== 'none';
            return saved;
        }
        const span = td.querySelector('span');
        if (span) {
            saved.text = span.textContent;
            const icon = td.querySelector(':scope > i');
            if (icon) saved.icon = icon.className;
            return saved;
        }
        saved.text = td.textContent;
        return saved;
    };

    const textFor = (type, saved) =>
        (saved && saved.text != null && saved.text.trim() !== '' && !isPlaceholder(saved.text))
            ? saved.text
            : DEFAULT_TEXT[type];

    const bindCheckbox = (checkboxDiv) => {
        if (checkboxDiv._dtBound) return;
        checkboxDiv._dtBound = true;
        checkboxDiv.addEventListener('click', () => {
            const check = checkboxDiv.querySelector('.fa-square-check');
            if (check) check.style.display = check.style.display === 'none' ? 'block' : 'none';
        });
    };

    const bindActionIcon = (icon) => {
        if (icon._dtBound) return;
        icon._dtBound = true;
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            showIconPicker(icon);
        });
    };

    // Build a cell of `type`, filled from `saved` (a readCell() result) when given.
    const createCell = (type = ColumnTypes.TEXT, saved = null) => {
        const td = document.createElement('td');
        td.className = 'dt-cell-td';

        switch (type) {
            case ColumnTypes.CHECKBOX: {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'fa-regular fa-square';
                checkboxDiv.style.cssText = `
                    margin: -2px 10px 0 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    position: relative;
                    font-size: 18px;
                    color: #a0a0a0;
                `;
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fa-solid fa-square-check';
                checkIcon.style.cssText = `
                    font-size: 18px;
                    color: var(--primary-color);
                    display: ${saved && saved.checked ? 'block' : 'none'};
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    border: none;
                `;
                checkboxDiv.appendChild(checkIcon);
                bindCheckbox(checkboxDiv);
                td.appendChild(checkboxDiv);
                // Keep the text/icon so switching back restores them
                if (saved && saved.text != null) td.dataset.dtText = saved.text;
                if (saved && saved.icon) td.dataset.dtIcon = saved.icon;
                break;
            }

            case ColumnTypes.LINK: {
                const link = document.createElement('span');
                link.textContent = textFor(type, saved);
                link.style.cssText = `
                    color: #0d87d8;
                    cursor: pointer;
                `;
                link.setAttribute('contenteditable', 'true');
                td.appendChild(link);
                if (saved && saved.icon) td.dataset.dtIcon = saved.icon;
                break;
            }

            case ColumnTypes.ACTION: {
                const actionIcon = document.createElement('i');
                actionIcon.className = (saved && saved.icon) || DEFAULT_ICON;
                bindActionIcon(actionIcon);
                const actionText = document.createElement('span');
                actionText.setAttribute('contenteditable', 'true');
                actionText.style.cssText = `
                    margin-left: 8px;
                `;
                actionText.textContent = textFor(type, saved);
                td.classList.add('icon-container');
                td.appendChild(actionIcon);
                td.appendChild(actionText);
                break;
            }

            default:
                td.setAttribute('contenteditable', 'true');
                td.textContent = textFor(ColumnTypes.TEXT, saved);
                if (saved && saved.icon) td.dataset.dtIcon = saved.icon;
        }

        if (saved && saved.checked && type !== ColumnTypes.CHECKBOX) td.dataset.dtChecked = 'true';
        return td;
    };

    // Re-wire a cell restored from saved HTML
    const hydrateCell = (td) => {
        // Saves from before the drag fix carry an inline background-color on every cell
        // (and the contrast colour TextContrastAdjuster then stamped on it). Drop both so
        // cells follow the theme vars from the stylesheet again.
        if (td.style.backgroundColor) {
            td.style.removeProperty('background-color');
            td.style.removeProperty('color');
            if (!td.getAttribute('style').trim()) td.removeAttribute('style');
        }
        td.querySelectorAll('.fa-square').forEach(bindCheckbox);
        if (td.classList.contains('icon-container')) {
            const icon = td.querySelector(':scope > i');
            if (icon) bindActionIcon(icon);
        }
    };

    // Column type of a header cell. Older saves may lack data-column-type, so fall back to
    // the select's serialized `selected` option, then to what the first body cell looks like.
    const inferColumnType = (th, table) => {
        const attr = th.getAttribute('data-column-type');
        if (attr && Object.values(ColumnTypes).includes(attr)) return attr;
        const selected = th.querySelector('.dt-col-type-selector option[selected]');
        if (selected) return selected.value;
        const colIndex = Array.from(th.parentElement.children).indexOf(th);
        const cell = table.querySelector('tbody tr')?.children[colIndex];
        if (cell) {
            if (cell.querySelector('.fa-square')) return ColumnTypes.CHECKBOX;
            if (cell.classList.contains('icon-container')) return ColumnTypes.ACTION;
            if (cell.querySelector('span')) return ColumnTypes.LINK;
        }
        return ColumnTypes.TEXT;
    };

    // Reflect the value in the `selected` attribute too: a select's .value isn't part of
    // its outerHTML, so without this the saved table reopens showing the first option.
    const setSelectValue = (select, value) => {
        select.value = value;
        Array.from(select.options).forEach(o => o.toggleAttribute('selected', o.value === value));
    };

    // ---- prototype player ---------------------------------------------------------------
    // The player (js/prototype.js) plays a cloneNode of the screen, which carries none of
    // the editor's listeners, so everything here binds on the clone's own elements.

    const SORT_ICONS = ['fa-sort', 'fa-sort-up', 'fa-sort-down'];
    const isChecked = (td) => {
        const check = td.querySelector('.fa-square .fa-square-check');
        return !!check && check.style.display !== 'none';
    };
    const setChecked = (td, on) => {
        const check = td.querySelector('.fa-square .fa-square-check');
        if (check) check.style.display = on ? 'block' : 'none';
    };
    // A cell's value for sorting: checked state for checkboxes, otherwise its text
    const sortValue = (td) => td && td.querySelector('.fa-square') ? (isChecked(td) ? 0 : 1)
        : (td ? td.textContent.trim() : '');
    const compare = (a, b) => (typeof a === 'number' && typeof b === 'number')
        ? a - b
        : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });

    const playTable = (table) => {
        if (table._dtPlayBound) return;
        table._dtPlayBound = true;
        const headerRow = table.querySelector('thead tr');
        const tbody = table.querySelector('tbody');
        if (!headerRow || !tbody) return;
        const rows = () => Array.from(tbody.querySelectorAll(':scope > tr'));
        const original = rows();   // "unsorted" order, the third click of a sort cycle
        const headers = () => Array.from(headerRow.children);
        // Linked elements belong to the player (navigate / overlay), not to the table
        const linked = (e) => !!e.target.closest('[data-proto-action]');

        // Rows with a checked box get a highlight
        const refresh = () => rows().forEach(tr => tr.classList.toggle('dt-play-checked',
            Array.from(tr.children).some(td => td.querySelector('.fa-square') && isChecked(td))));

        // Tick a box
        tbody.querySelectorAll('.fa-square').forEach(box => {
            box.addEventListener('click', (e) => {
                if (linked(e)) return;
                const td = box.closest('td');
                setChecked(td, !isChecked(td));
                refresh();
            });
        });

        let sorted = { index: -1, dir: 0 };   // dir: 1 asc, -1 desc, 0 unsorted
        const setSortIcon = (th, dir) => {
            const icon = th.querySelector('.td-header-icon i');
            // Leave an icon the user picked for something else alone
            if (!icon || !SORT_ICONS.some(c => icon.classList.contains(c))) return;
            icon.classList.remove(...SORT_ICONS);
            icon.classList.add(dir === 1 ? 'fa-sort-up' : dir === -1 ? 'fa-sort-down' : 'fa-sort');
        };

        headers().forEach((th, index) => {
            th.addEventListener('click', (e) => {
                if (linked(e)) return;
                const isCheckColumn = rows().some(tr => tr.children[index]?.querySelector('.fa-square'));

                // Checkbox column: the header ticks / clears every row
                if (isCheckColumn && !e.target.closest('.td-header-icon')) {
                    const cells = rows().map(tr => tr.children[index]).filter(Boolean);
                    const all = cells.every(isChecked);
                    cells.forEach(td => setChecked(td, !all));
                    refresh();
                    return;
                }

                // Any other column (or a checkbox column's sort icon): asc -> desc -> original
                const dir = sorted.index === index ? (sorted.dir === 1 ? -1 : sorted.dir === -1 ? 0 : 1) : 1;
                headers().forEach(h => setSortIcon(h, 0));
                sorted = { index, dir };
                setSortIcon(th, dir);
                th.classList.toggle('dt-play-sorted', dir !== 0);
                headers().forEach(h => { if (h !== th) h.classList.remove('dt-play-sorted'); });
                const order = dir === 0 ? original.filter(tr => tr.isConnected)
                    : rows().sort((a, b) => dir * compare(sortValue(a.children[index]), sortValue(b.children[index])));
                order.forEach(tr => tbody.appendChild(tr));
            });
        });

        refresh();
    };

    window.Components.table = {
        ColumnTypes,

        // Prototype player: tick checkboxes (header = select all), click a header to sort
        play(root) {
            root.querySelectorAll('.data-table-main').forEach(playTable);
        },

        setup(content) {
            if (!content) {
                console.error('No content provided to setupTable');
                return null;
            }

            const tableWrapper = content.querySelector('.data-table-scroll-wrapper');
            if (!tableWrapper) {
                console.error('No table wrapper found in content');
                return null;
            }

            const table = tableWrapper.querySelector('.data-table-main');
            if (!table) {
                console.error('No table found in wrapper');
                return null;
            }

            // Already wired (load/rehydrate paths can reach here more than once)
            if (table._dtController) return table._dtController;

            // Find or create button container
            let buttonContainer = content.querySelector('.data-table-button-container');
            if (!buttonContainer) {
                buttonContainer = document.createElement('div');
                buttonContainer.className = 'data-table-button-container';

                const addColumnBtn = document.createElement('button');
                addColumnBtn.className = 'data-table-add-column-btn';
                addColumnBtn.innerHTML = '<i class="fas fa-plus"></i><span>Column</span>';

                const addRowBtn = document.createElement('button');
                addRowBtn.className = 'data-table-add-row-btn';
                addRowBtn.innerHTML = '<i class="fas fa-plus"></i><span>Row</span>';

                buttonContainer.appendChild(addRowBtn);
                buttonContainer.appendChild(addColumnBtn);
                content.appendChild(buttonContainer);
            }

            // Find or create thead/tbody
            if (!table.querySelector('thead')) table.appendChild(document.createElement('thead'));
            let headerRow = table.querySelector('thead tr');
            if (!headerRow) {
                headerRow = document.createElement('tr');
                table.querySelector('thead').appendChild(headerRow);
            }
            if (!table.querySelector('tbody')) table.appendChild(document.createElement('tbody'));
            const tbody = table.querySelector('tbody');

            const columnIndexOf = (th) => Array.from(th.parentElement.children).indexOf(th);

            // ---- columns ----------------------------------------------------------------

            const updateColumnType = (headerCell, newType) => {
                const colIndex = columnIndexOf(headerCell);
                table.querySelectorAll('tbody tr').forEach(row => {
                    const cell = row.children[colIndex];
                    if (!cell || !cell.classList.contains('dt-cell-td')) return;
                    row.replaceChild(createCell(newType, readCell(cell)), cell);
                });
                headerCell.setAttribute('data-column-type', newType);
                const select = headerCell.querySelector('.dt-col-type-selector');
                if (select) setSelectValue(select, newType);
            };

            const deleteColumn = (colIndex) => {
                // Keep at least one column, otherwise there's nothing left to add rows to
                if (headerRow.children.length <= 1) return;
                table.querySelectorAll('tr').forEach(row => {
                    if (row.children.length > colIndex) row.deleteCell(colIndex);
                });
            };

            const updateAddButtonVisibility = () => {
                const addRowBtn = buttonContainer.querySelector('.data-table-add-row-btn');
                if (addRowBtn) addRowBtn.style.display = tbody.children.length >= MAX_ROWS ? 'none' : 'flex';
            };

            // Wire a header cell's controls (works for freshly built and restored cells)
            const bindHeaderCell = (th) => {
                if (th._dtBound) return;
                th._dtBound = true;

                const controls = th.querySelector('.data-table-column-controls');
                const typeSelector = th.querySelector('.dt-col-type-selector');
                const deleteBtn = th.querySelector('.delete-dt-col-btn');
                const resizer = th.querySelector('.td-column-resizer');
                const sortIcon = th.querySelector('.td-header-icon i');

                const type = inferColumnType(th, table);
                th.setAttribute('data-column-type', type);
                if (typeSelector) setSelectValue(typeSelector, type);

                if (sortIcon) bindActionIcon(sortIcon);

                // grab cursor: CSS (#mockZone .data-table-header-cell), not an inline style that was
                // saved / live-synced with every hover
                th.addEventListener('mouseenter', () => {
                    if (controls && !shared.activeControls && !shared.resize) controls.style.display = 'flex';
                });
                th.addEventListener('mouseleave', (e) => {
                    if (controls && !controls.contains(e.relatedTarget) && shared.activeControls !== controls) {
                        controls.style.display = 'none';
                    }
                });

                if (typeSelector && controls) {
                    typeSelector.addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                        controls.style.display = 'flex';
                        shared.activeControls = controls;
                    });
                    typeSelector.addEventListener('change', (e) => {
                        e.stopPropagation();
                        updateColumnType(th, typeSelector.value);
                        setTimeout(() => {
                            if (shared.activeControls === controls) {
                                controls.style.display = 'none';
                                shared.activeControls = null;
                            }
                        }, 200);
                    });
                }

                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => deleteColumn(columnIndexOf(th)));
                }

                if (resizer) {
                    resizer.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const thRect = th.getBoundingClientRect();

                        const overlay = document.createElement('div');
                        overlay.id = 'resize-overlay';
                        document.body.appendChild(overlay);

                        const line = document.createElement('div');
                        line.className = 'td-column-resizer-line';
                        line.id = 'resize-line';
                        line.style.left = `${thRect.right}px`;
                        document.body.appendChild(line);

                        if (controls) controls.style.display = 'none';
                        shared.resize = { th, startX: e.pageX, startWidth: th.offsetWidth, overlay, line };
                    });
                }
            };

            const createHeaderCell = (text = 'New Column', type = ColumnTypes.TEXT) => {
                const th = document.createElement('th');
                th.className = 'data-table-header-cell';
                th.setAttribute('data-column-type', type);

                const headerContent = document.createElement('div');
                headerContent.className = 'data-table-header-content';

                const headerText = document.createElement('span');
                headerText.textContent = text;
                headerText.setAttribute('contenteditable', 'true');
                headerContent.appendChild(headerText);

                const headerIconContainer = document.createElement('div');
                headerIconContainer.className = 'td-header-icon icon-container';
                const sortIcon = document.createElement('i');
                sortIcon.className = 'fas fa-sort';
                headerIconContainer.appendChild(sortIcon);
                headerContent.appendChild(headerIconContainer);

                const resizer = document.createElement('div');
                resizer.className = 'td-column-resizer';

                const controls = document.createElement('div');
                controls.className = 'data-table-column-controls';

                const typeSelector = document.createElement('select');
                typeSelector.className = 'dt-col-type-selector';
                Object.values(ColumnTypes).forEach(t => {
                    const option = document.createElement('option');
                    option.value = t;
                    option.textContent = t.charAt(0).toUpperCase() + t.slice(1);
                    typeSelector.appendChild(option);
                });
                controls.appendChild(typeSelector);

                const deleteDTCol = document.createElement('i');
                deleteDTCol.className = 'fas fa-trash delete-dt-col-btn';
                deleteDTCol.setAttribute('title', 'delete column');
                controls.appendChild(deleteDTCol);

                th.appendChild(headerContent);
                th.appendChild(controls);
                th.appendChild(resizer);

                bindHeaderCell(th);
                return th;
            };

            // ---- rows -------------------------------------------------------------------

            const bindRow = (tr) => {
                if (tr._dtBound) return;
                tr._dtBound = true;

                let deleteBtn = tr.querySelector(':scope > .row-controls');
                if (!deleteBtn) {
                    deleteBtn = document.createElement('i');
                    deleteBtn.className = 'fas fa-trash row-controls';
                    deleteBtn.setAttribute('title', 'delete row');
                    tr.appendChild(deleteBtn);
                }
                deleteBtn.style.display = 'none';

                deleteBtn.addEventListener('click', () => {
                    tr.remove();
                    updateAddButtonVisibility();
                });
                // Row is position: relative while hovered via CSS (#mockZone .data-table-row:hover)
                tr.addEventListener('mouseenter', () => {
                    deleteBtn.style.display = 'flex';
                });
                tr.addEventListener('mouseleave', () => {
                    deleteBtn.style.display = 'none';
                });

                tr.querySelectorAll(':scope > td.dt-cell-td').forEach(hydrateCell);
            };

            const createRow = () => {
                const tr = document.createElement('tr');
                tr.className = 'data-table-row';
                Array.from(headerRow.children).forEach(th => {
                    tr.appendChild(createCell(th.getAttribute('data-column-type') || ColumnTypes.TEXT));
                });
                bindRow(tr);
                return tr;
            };

            // ---- column drag-reorder ----------------------------------------------------

            try {
                Sortable.get?.(headerRow)?.destroy();
                new Sortable(headerRow, {
                    animation: 150,
                    handle: '.data-table-header-cell',
                    // Don't start a column drag from the resize handle or the type/delete menu
                    filter: '.td-column-resizer, .data-table-column-controls',
                    preventOnFilter: false,
                    ghostClass: 'sortable-ghost',
                    onStart(evt) {
                        evt.item.style.cursor = 'grabbing';
                        table.querySelectorAll(`tbody td:nth-child(${evt.oldIndex + 1})`).forEach(cell => {
                            cell.style.backgroundColor = 'rgba(37, 137, 203, 0.9)';
                        });
                    },
                    onEnd(evt) {
                        evt.item.style.cursor = '';
                        table.querySelectorAll('tbody td').forEach(cell => {
                            cell.style.backgroundColor = '';
                        });

                        const { oldIndex, newIndex } = evt;
                        if (oldIndex === newIndex) return;

                        table.querySelectorAll('tbody tr').forEach(row => {
                            const cells = Array.from(row.children);
                            const [movedCell] = cells.splice(oldIndex, 1);
                            row.insertBefore(movedCell, cells[newIndex] || null);
                        });
                    },
                    onMove(evt) {
                        return !evt.related.classList.contains('navbar-spacer');
                    }
                });
            } catch (error) {
                console.error('Error setting up Sortable for table header:', error);
            }

            // ---- add buttons ------------------------------------------------------------

            // Clone to drop any listeners from an earlier setup of a since-replaced table
            const rebindButton = (selector, handler) => {
                const btn = buttonContainer.querySelector(selector);
                if (!btn) return;
                const fresh = btn.cloneNode(true);
                btn.replaceWith(fresh);
                fresh.addEventListener('click', handler);
            };

            rebindButton('.data-table-add-column-btn', () => {
                headerRow.appendChild(createHeaderCell('New Column', ColumnTypes.TEXT));
                table.querySelectorAll('tbody tr').forEach(row => {
                    const controls = row.querySelector(':scope > .row-controls');
                    row.insertBefore(createCell(ColumnTypes.TEXT), controls);
                });
            });

            rebindButton('.data-table-add-row-btn', () => {
                if (tbody.children.length >= MAX_ROWS) return;
                tbody.appendChild(createRow());
                updateAddButtonVisibility();
            });

            // ---- inline editing ---------------------------------------------------------

            // Cells and header labels are single-line: block Enter and paste as plain text,
            // like the app's other inline-editable text. Delegated, so it covers cells added
            // or rebuilt later (type changes, new rows/columns).
            const editableTarget = (e) => {
                const el = e.target.closest?.('[contenteditable="true"]');
                return el && table.contains(el) ? el : null;
            };
            table.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.isComposing && editableTarget(e)) e.preventDefault();
            });
            table.addEventListener('paste', (e) => {
                if (!editableTarget(e)) return;
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text/plain');
                document.execCommand('insertText', false, text.replace(/\s*[\r\n]+\s*/g, ' '));
            });

            // Show the add buttons while hovering the table or the buttons themselves
            const handleMouseEnter = () => { buttonContainer.style.display = 'flex'; };
            const handleMouseLeave = (e) => {
                const to = e.relatedTarget;
                if (!tableWrapper.contains(to) && !buttonContainer.contains(to)) {
                    buttonContainer.style.display = 'none';
                }
            };
            tableWrapper.addEventListener('mouseenter', handleMouseEnter);
            tableWrapper.addEventListener('mouseleave', handleMouseLeave);
            buttonContainer.addEventListener('mouseenter', handleMouseEnter);
            buttonContainer.addEventListener('mouseleave', handleMouseLeave);

            // ---- build or hydrate -------------------------------------------------------

            if (headerRow.children.length === 0) {
                [
                    { text: 'Check', type: ColumnTypes.CHECKBOX },
                    { text: 'ID', type: ColumnTypes.LINK },
                    { text: 'Name', type: ColumnTypes.TEXT },
                    { text: 'Action', type: ColumnTypes.ACTION }
                ].forEach(({ text, type }) => headerRow.appendChild(createHeaderCell(text, type)));

                for (let i = 0; i < 3; i++) tbody.appendChild(createRow());
            } else {
                Array.from(headerRow.children).forEach(bindHeaderCell);
                Array.from(tbody.children).forEach(bindRow);
            }
            updateAddButtonVisibility();

            table._dtController = {
                createRow,
                createHeaderCell,
                updateColumnType,
                deleteColumn,
                updateAddButtonVisibility
            };
            return table._dtController;
        }
    };
})();
