// Component registry module — see docs/component-module-migration.md
// table: data table with sortable columns, cell types (text / number / link / status /
// person / checkbox / toggle / action), add/remove rows & columns, select-all on checkbox
// columns, and table styles (Classic / Striped / Compact / Cards).
//
// setup(content) both builds a fresh table and *hydrates* an existing one (restored from
// a save, history, or live sync): every header cell, row and cell is (re)wired from the
// DOM alone, so no other module needs to re-implement the table's behaviour. It is
// idempotent per <table> element — repeated calls return the same controller.
//
// Everything the design needs lives in the saved html: column type (data-column-type),
// widths (th style), checks (the check icon's display), toggles (data-on), status colors
// (data-dt-tone), the style (data-table-style on .data-table-scroll-wrapper). Editor-only
// UI (column menus, resize grips, row ×, Row / Column buttons, style arrows) is chrome,
// rebuilt here (js/editor-chrome.js).
window.Components = window.Components || {};

(function () {
    // Values are also the column menu's labels (capitalized) and data-column-type
    const ColumnTypes = {
        TEXT: 'text',
        NUMBER: 'number',
        LINK: 'link',
        STATUS: 'status',
        PERSON: 'person',
        CHECKBOX: 'checkbox',
        TOGGLE: 'toggle',
        ACTION: 'action (icon)'
    };

    // Default text per type, picked by row (so a new table / column doesn't repeat one value).
    // A cell still showing a default gets the new type's default on a type change; anything
    // the user typed is carried across.
    const DEFAULTS = {
        [ColumnTypes.TEXT]: ['Cell Text'],
        [ColumnTypes.NUMBER]: ['$1,250', '$860', '$2,430', '$415', '$1,075'],
        [ColumnTypes.LINK]: ['Link Text'],
        [ColumnTypes.STATUS]: ['Active', 'Pending', 'Inactive'],
        [ColumnTypes.PERSON]: ['Ava Chen', 'Leo Park', 'Mia Ross', 'Noah Kim', 'Zoe Diaz'],
        [ColumnTypes.ACTION]: ['Action']
    };
    const ALL_DEFAULTS = new Set(Object.values(DEFAULTS).flat());
    const isPlaceholder = (text) => ALL_DEFAULTS.has(text);
    const defaultText = (type, i = 0) => {
        const list = DEFAULTS[type] || DEFAULTS[ColumnTypes.TEXT];
        return list[i % list.length];
    };

    // Status pill colors (data-dt-tone; css .dt-status). Clicking the dot steps through them.
    const TONES = ['success', 'warning', 'neutral', 'danger', 'primary'];
    const DEFAULT_TONE = { Active: 'success', Pending: 'warning', Inactive: 'neutral' };

    // Table styles, as data-table-style on .data-table-scroll-wrapper (none = Classic).
    // A style is css only, so switching keeps every column, row and edit.
    const TABLE_STYLES = [
        { id: 'classic', label: 'Classic' },
        { id: 'striped', label: 'Striped' },
        { id: 'compact', label: 'Compact' },
        { id: 'cards', label: 'Cards' }
    ];

    const DEFAULT_ICON = 'fas fa-bolt';
    const MAX_ROWS = 20;
    const MIN_COL_WIDTH = 48;
    // Session-only: a column being dragged (cells highlighted), stripped on save / sync / undo
    // (EDITOR_CHROME.SESSION_CLASSES)
    const DRAG_CLASS = 'dt-col-dragging';

    // One resize / one open column menu at a time across every table, so the document
    // listener is registered once for the page instead of once per setup() call.
    const shared = { resizing: false, activeControls: null };
    if (!window.__dtTableDocListeners) {
        window.__dtTableDocListeners = true;

        document.addEventListener('click', (e) => {
            const c = shared.activeControls;
            if (c && !c.contains(e.target)) {
                c.style.display = 'none';
                shared.activeControls = null;
            }
        });
    }

    const markDirty = (el, why) => {
        const canvasId = el.closest?.('.canvas-wrapper')?.getAttribute('data-canvas-id');
        if (canvasId) window.projectManager?.addCanvasToChanged(canvasId, why);
    };

    // ---- cell content ---------------------------------------------------------------

    const editableOf = (td) => td.matches('[contenteditable="true"]') ? td : td.querySelector('[contenteditable="true"]');
    const isChecked = (td) => {
        const check = td.querySelector('.fa-square .fa-square-check');
        return !!check && check.style.display !== 'none';
    };
    const setChecked = (td, on) => {
        const check = td.querySelector('.fa-square .fa-square-check');
        if (check) check.style.display = on ? 'block' : 'none';
    };
    const isCheckCell = (td) => !!td?.querySelector(':scope > .fa-square');

    // What a cell holds, independent of its type. Values stashed in data-dt-* survive a
    // detour through a type that can't show them (e.g. text -> checkbox -> text).
    const readCell = (td) => {
        const saved = {
            text: td.dataset.dtText,
            icon: td.dataset.dtIcon,
            // Only known when the cell was a checkbox / toggle (now or earlier); otherwise a
            // toggle column falls back to its per-row default
            checked: td.dataset.dtChecked === 'true' ? true : undefined,
            tone: td.dataset.dtTone,
            usa: td.dataset.dtUsa === 'true'
        };
        if (isCheckCell(td)) {
            saved.checked = isChecked(td);
            return saved;
        }
        const toggle = td.querySelector(':scope > .dt-toggle');
        if (toggle) {
            saved.checked = toggle.getAttribute('data-on') === 'true';
            return saved;
        }
        const editable = editableOf(td);
        saved.text = editable ? editable.textContent : td.textContent;
        saved.usa = !!editable && editable.classList.contains('usa');
        const icon = td.classList.contains('icon-container') && td.querySelector(':scope > i');
        if (icon) saved.icon = icon.className;
        const status = td.querySelector(':scope > .dt-status');
        if (status?.dataset.dtTone) saved.tone = status.dataset.dtTone;
        return saved;
    };

    const textFor = (type, saved, i) =>
        (saved && saved.text != null && saved.text.trim() !== '' && !isPlaceholder(saved.text))
            ? saved.text
            : defaultText(type, i);

    // Editable text that's still a default (or carried over unedited) gets .usa, so Review
    // Text counts it (js/text-review.js); real typing strips it.
    const markUnedited = (el, type, saved, i) => {
        if (!saved || saved.usa || (DEFAULTS[type] || []).includes(textFor(type, saved, i))) el.classList.add('usa');
    };

    const editableSpan = (className, text) => {
        const span = document.createElement('span');
        if (className) span.className = className;
        span.setAttribute('contenteditable', 'true');
        span.textContent = text;
        return span;
    };

    const initials = (name) => {
        const words = (name || '').trim().split(/\s+/).filter(Boolean);
        if (!words.length) return '?';
        const first = words[0][0] || '';
        const last = words.length > 1 ? words[words.length - 1][0] : '';
        return (first + last).toUpperCase();
    };

    // Keep each checkbox column's select-all box in its header in step with its rows:
    // ☐ none, ⊟ some, ☑ all. Non-checkbox columns lose theirs. Runs in the editor and in play.
    const syncSelectAll = (table) => {
        const headerRow = table?.querySelector('thead tr');
        if (!headerRow) return;
        const rows = Array.from(table.querySelectorAll('tbody > tr'));
        Array.from(headerRow.children).forEach((th, index) => {
            const content = th.querySelector(':scope > .data-table-header-content');
            let box = content?.querySelector(':scope > .dt-select-all');
            if (th.getAttribute('data-column-type') !== ColumnTypes.CHECKBOX) {
                box?.remove();
                return;
            }
            if (!content) return;
            if (!box) {
                box = document.createElement('i');
                box.title = 'Select all';
                content.insertBefore(box, content.firstChild);
            }
            const cells = rows.map(tr => tr.children[index]).filter(isCheckCell);
            const on = cells.filter(isChecked).length;
            const state = cells.length && on === cells.length ? 'fa-solid fa-square-check'
                : on ? 'fa-solid fa-square-minus' : 'fa-regular fa-square';
            const cls = `dt-select-all ${state}`;
            if (box.className !== cls) box.className = cls;
        });
    };

    // Tick / clear every row of a checkbox column (its header's select-all)
    const toggleColumn = (table, index) => {
        const cells = Array.from(table.querySelectorAll('tbody > tr'))
            .map(tr => tr.children[index]).filter(isCheckCell);
        const all = cells.length > 0 && cells.every(isChecked);
        cells.forEach(td => setChecked(td, !all));
        syncSelectAll(table);
    };

    const bindCheckbox = (checkboxDiv) => {
        if (checkboxDiv._dtBound) return;
        checkboxDiv._dtBound = true;
        checkboxDiv.addEventListener('click', () => {
            const td = checkboxDiv.closest('td');
            if (td) setChecked(td, !isChecked(td));
            syncSelectAll(checkboxDiv.closest('table'));
        });
    };

    const bindToggle = (toggle) => {
        if (toggle._dtBound) return;
        toggle._dtBound = true;
        toggle.addEventListener('click', () => {
            toggle.setAttribute('data-on', String(toggle.getAttribute('data-on') !== 'true'));
        });
    };

    const bindStatusDot = (dot) => {
        if (dot._dtBound) return;
        dot._dtBound = true;
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const pill = dot.closest('.dt-status');
            if (!pill) return;
            const i = TONES.indexOf(pill.dataset.dtTone);
            pill.dataset.dtTone = TONES[(i + 1) % TONES.length];
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
    // `row` (its row's index) picks the default text, so rows don't all repeat one value.
    const createCell = (type = ColumnTypes.TEXT, saved = null, row = 0) => {
        const td = document.createElement('td');
        td.className = 'dt-cell-td';
        const shows = { text: true, icon: false, checked: false, tone: false };

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
                // Color: the project's primary, from css (.dt-cell-td .fa-square-check)
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fa-solid fa-square-check';
                checkIcon.style.cssText = `
                    font-size: 18px;
                    display: ${saved && saved.checked ? 'block' : 'none'};
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    border: none;
                `;
                checkboxDiv.appendChild(checkIcon);
                bindCheckbox(checkboxDiv);
                td.appendChild(checkboxDiv);
                Object.assign(shows, { text: false, checked: true });
                break;
            }

            case ColumnTypes.TOGGLE: {
                const toggle = document.createElement('span');
                toggle.className = 'dt-toggle non-editable';
                toggle.setAttribute('data-on', String(saved && saved.checked != null ? saved.checked : row % 3 !== 2));
                const knob = document.createElement('span');
                knob.className = 'dt-toggle-knob';
                toggle.appendChild(knob);
                bindToggle(toggle);
                td.appendChild(toggle);
                Object.assign(shows, { text: false, checked: true });
                break;
            }

            case ColumnTypes.LINK: {
                // Color: the project's primary, from css (.dt-link)
                const link = editableSpan('dt-link', textFor(type, saved, row));
                markUnedited(link, type, saved, row);
                td.appendChild(link);
                break;
            }

            case ColumnTypes.STATUS: {
                const text = textFor(type, saved, row);
                const pill = document.createElement('span');
                pill.className = 'dt-status';
                pill.dataset.dtTone = (saved && saved.tone) || DEFAULT_TONE[text] || 'success';
                const dot = document.createElement('span');
                dot.className = 'dt-status-dot non-editable';
                dot.title = 'Change color';
                bindStatusDot(dot);
                const label = editableSpan('', text);
                markUnedited(label, type, saved, row);
                pill.append(dot, label);
                td.appendChild(pill);
                shows.tone = true;
                break;
            }

            case ColumnTypes.PERSON: {
                const text = textFor(type, saved, row);
                td.classList.add('dt-person');
                const avatar = document.createElement('span');
                avatar.className = 'dt-avatar non-editable';
                avatar.textContent = initials(text);
                const name = editableSpan('dt-person-name', text);
                markUnedited(name, type, saved, row);
                td.append(avatar, name);
                break;
            }

            case ColumnTypes.ACTION: {
                const actionIcon = document.createElement('i');
                actionIcon.className = (saved && saved.icon) || DEFAULT_ICON;
                bindActionIcon(actionIcon);
                const actionText = editableSpan('', textFor(type, saved, row));
                actionText.style.marginLeft = '8px';
                markUnedited(actionText, type, saved, row);
                td.classList.add('icon-container');
                td.append(actionIcon, actionText);
                shows.icon = true;
                break;
            }

            case ColumnTypes.NUMBER:
            default: {
                const t = type === ColumnTypes.NUMBER ? type : ColumnTypes.TEXT;
                if (t === ColumnTypes.NUMBER) td.classList.add('dt-number');
                td.setAttribute('contenteditable', 'true');
                td.textContent = textFor(t, saved, row);
                markUnedited(td, t, saved, row);
            }
        }

        // Keep what this type can't show, so switching back restores it
        if (saved) {
            if (!shows.text && saved.text != null) {
                td.dataset.dtText = saved.text;
                if (saved.usa) td.dataset.dtUsa = 'true';
            }
            if (!shows.icon && saved.icon) td.dataset.dtIcon = saved.icon;
            if (!shows.checked && saved.checked) td.dataset.dtChecked = 'true';
            if (!shows.tone && saved.tone) td.dataset.dtTone = saved.tone;
        }
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
        td.querySelectorAll(':scope > .fa-square').forEach(bindCheckbox);
        td.querySelectorAll(':scope > .dt-toggle').forEach(bindToggle);
        td.querySelectorAll(':scope > .dt-status > .dt-status-dot').forEach(bindStatusDot);
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
            if (isCheckCell(cell)) return ColumnTypes.CHECKBOX;
            if (cell.querySelector(':scope > .dt-toggle')) return ColumnTypes.TOGGLE;
            if (cell.querySelector(':scope > .dt-status')) return ColumnTypes.STATUS;
            if (cell.classList.contains('dt-person')) return ColumnTypes.PERSON;
            if (cell.classList.contains('dt-number')) return ColumnTypes.NUMBER;
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

    // ---- table styles ---------------------------------------------------------------

    const styleIndex = (wrapper) =>
        Math.max(0, TABLE_STYLES.findIndex(s => s.id === (wrapper.getAttribute('data-table-style') || 'classic')));

    const applyStyle = (wrapper, index) => {
        const n = TABLE_STYLES.length;
        const style = TABLE_STYLES[((index % n) + n) % n];
        if (style.id === 'classic') wrapper.removeAttribute('data-table-style');
        else wrapper.setAttribute('data-table-style', style.id);
        const number = wrapper.closest('.component-container')
            ?.querySelector(':scope > .dt-style-controls .variant-number');
        if (number) number.textContent = `${TABLE_STYLES.indexOf(style) + 1}/${n}`;
        markDirty(wrapper, 'Table style changed');
    };

    // Style arrows on the surrounding .component-container, like other components' variant
    // arrows (outside .component-content, so never saved). Rebuilt on every setup.
    const setupStyleControls = (wrapper) => {
        const host = wrapper.closest('.component-container');
        if (!host) return null;
        // The + Row / + Column buttons ride in the bar: keep them (and their listeners)
        const buttons = host.querySelector(':scope > .dt-style-controls > .data-table-button-container');
        host.querySelectorAll(':scope > .dt-style-controls').forEach(el => el.remove());
        const n = TABLE_STYLES.length;

        const controls = document.createElement('div');
        controls.className = 'variant-controls dt-style-controls';
        controls.title = 'Table style';
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-control prev-nav';
        prevBtn.innerHTML = '<i class="fas fa-circle-left"></i>';
        const number = document.createElement('span');
        number.className = 'variant-number';
        number.textContent = `${styleIndex(wrapper) + 1}/${n}`;
        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-control next-nav';
        nextBtn.innerHTML = '<i class="fas fa-circle-right"></i>';
        controls.append(prevBtn, number, nextBtn);
        controls.addEventListener('click', (e) => e.stopPropagation());
        prevBtn.addEventListener('click', () => applyStyle(wrapper, styleIndex(wrapper) - 1));
        nextBtn.addEventListener('click', () => applyStyle(wrapper, styleIndex(wrapper) + 1));
        if (buttons) controls.appendChild(buttons);
        host.appendChild(controls);
        return controls;
    };

    // ---- prototype player ---------------------------------------------------------------
    // The player (js/prototype.js) plays a cloneNode of the screen, which carries none of
    // the editor's listeners, so everything here binds on the clone's own elements.

    const SORT_ICONS = ['fa-sort', 'fa-sort-up', 'fa-sort-down'];
    const parseNumber = (text) => {
        const n = parseFloat(String(text).replace(/[^0-9.\-]/g, ''));
        return Number.isFinite(n) ? n : null;
    };
    // A cell's value for sorting: checked / on first for checkboxes and toggles, numbers by
    // value (so $860 < $1,250), otherwise its text (a person cell's name, not its initials)
    const sortValue = (td) => {
        if (!td) return '';
        if (isCheckCell(td)) return isChecked(td) ? 0 : 1;
        const toggle = td.querySelector(':scope > .dt-toggle');
        if (toggle) return toggle.getAttribute('data-on') === 'true' ? 0 : 1;
        const text = (editableOf(td) || td).textContent.trim();
        if (td.classList.contains('dt-number')) {
            const n = parseNumber(text);
            if (n != null) return n;
        }
        return text;
    };
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

        // Rows with a checked box get a highlight; select-all boxes follow their rows
        const refresh = () => {
            rows().forEach(tr => tr.classList.toggle('dt-play-checked',
                Array.from(tr.children).some(td => isCheckCell(td) && isChecked(td))));
            syncSelectAll(table);
        };

        // Tick a box
        tbody.querySelectorAll('.dt-cell-td > .fa-square').forEach(box => {
            box.addEventListener('click', (e) => {
                if (linked(e)) return;
                const td = box.closest('td');
                setChecked(td, !isChecked(td));
                refresh();
            });
        });

        // Flip a switch
        tbody.querySelectorAll('.dt-cell-td > .dt-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (linked(e)) return;
                toggle.setAttribute('data-on', String(toggle.getAttribute('data-on') !== 'true'));
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

        headers().forEach((th) => {
            th.addEventListener('click', (e) => {
                if (linked(e)) return;
                const index = headers().indexOf(th);
                const isCheckColumn = rows().some(tr => isCheckCell(tr.children[index]));

                // Checkbox column: the header (its select-all) ticks / clears every row
                if (isCheckColumn && !e.target.closest('.td-header-icon')) {
                    toggleColumn(table, index);
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
        styles: TABLE_STYLES.map(s => s.id),

        // Switch style by index or id (e.g. from templates). `root` = the table's wrapper or inside it.
        setStyle(root, style) {
            const wrapper = root?.closest?.('.data-table-scroll-wrapper') || root?.querySelector?.('.data-table-scroll-wrapper');
            if (!wrapper) return;
            const index = typeof style === 'number' ? style : TABLE_STYLES.findIndex(s => s.id === style);
            if (index >= 0) applyStyle(wrapper, index);
        },

        // Prototype player: tick checkboxes (header = select all), flip toggles, click a header to sort
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

            // Style arrows live on the wrapper's container, which can be new even when the
            // table isn't (re-wrapped), so they're (re)built before the already-wired check
            const styleControls = setupStyleControls(tableWrapper);

            // Already wired (load/rehydrate paths can reach here more than once)
            if (table._dtController) return table._dtController;

            // Find or create the + Row / + Column buttons. They live in the style arrows' bar
            // (either side of the arrows, css .dt-style-controls), so they show with it and sit
            // in one place on any screen size. No bar (not wrapped yet): in the content.
            let buttonContainer = styleControls?.querySelector(':scope > .data-table-button-container')
                || content.querySelector('.data-table-button-container');
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
            }
            (styleControls || content).appendChild(buttonContainer);

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
                table.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
                    const cell = row.children[colIndex];
                    if (!cell || !cell.classList.contains('dt-cell-td')) return;
                    row.replaceChild(createCell(newType, readCell(cell), rowIndex), cell);
                });
                headerCell.setAttribute('data-column-type', newType);
                const select = headerCell.querySelector('.dt-col-type-selector');
                if (select) setSelectValue(select, newType);
                syncSelectAll(table);
            };

            const deleteColumn = (colIndex) => {
                // Keep at least one column, otherwise there's nothing left to add rows to
                if (headerRow.children.length <= 1) return;
                table.querySelectorAll('tr').forEach(row => {
                    if (row.children.length > colIndex) row.deleteCell(colIndex);
                });
                syncSelectAll(table);
            };

            const updateAddButtonVisibility = () => {
                const addRowBtn = buttonContainer.querySelector('.data-table-add-row-btn');
                if (addRowBtn) addRowBtn.style.display = tbody.children.length >= MAX_ROWS ? 'none' : 'flex';
            };

            // Header chrome (editor-only, stripped on save — EDITOR_CHROME): the type / delete
            // menu and the resize grip. Rebuilt here so load, undo and live sync get them back.
            const buildControls = () => {
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
                return controls;
            };

            const buildResizer = () => {
                const resizer = document.createElement('div');
                resizer.className = 'td-column-resizer';
                return resizer;
            };

            // Drag a column's right edge. Pointer events + capture, so mouse, pen and touch
            // all work and the drag keeps going outside the grip. The width follows the
            // pointer at any editor zoom: screen pixels are divided by the screen's scale.
            const bindResizer = (th, resizer, controls) => {
                resizer.addEventListener('pointerdown', (e) => {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    e.stopPropagation();
                    resizer.setPointerCapture(e.pointerId);

                    const scale = (th.getBoundingClientRect().width / th.offsetWidth) || 1;
                    const startX = e.clientX;
                    const startWidth = th.offsetWidth;
                    shared.resizing = true;
                    document.body.classList.add('dt-col-resizing');
                    if (controls) controls.style.display = 'none';

                    const move = (ev) => {
                        const width = Math.max(MIN_COL_WIDTH, Math.round(startWidth + (ev.clientX - startX) / scale));
                        th.style.width = `${width}px`;
                    };
                    const end = () => {
                        resizer.removeEventListener('pointermove', move);
                        resizer.removeEventListener('pointerup', end);
                        resizer.removeEventListener('pointercancel', end);
                        resizer.removeEventListener('lostpointercapture', end);
                        shared.resizing = false;
                        document.body.classList.remove('dt-col-resizing');
                    };
                    resizer.addEventListener('pointermove', move);
                    resizer.addEventListener('pointerup', end);
                    resizer.addEventListener('pointercancel', end);
                    resizer.addEventListener('lostpointercapture', end);
                });
                // The grip's click mustn't reach the header (sorting / menus)
                resizer.addEventListener('click', (e) => e.stopPropagation());
                // Double-click: back to the default width
                resizer.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    th.style.removeProperty('width');
                    if (!th.getAttribute('style')) th.removeAttribute('style');
                });
            };

            // Wire a header cell's controls (works for freshly built and restored cells)
            const bindHeaderCell = (th) => {
                if (th._dtBound) return;
                th._dtBound = true;

                let controls = th.querySelector(':scope > .data-table-column-controls');
                if (!controls) {
                    controls = buildControls();
                    th.insertBefore(controls, th.querySelector(':scope > .td-column-resizer'));
                }
                controls.style.display = 'none';
                let resizer = th.querySelector(':scope > .td-column-resizer');
                if (!resizer) {
                    resizer = buildResizer();
                    th.appendChild(resizer);
                }

                const typeSelector = controls.querySelector('.dt-col-type-selector');
                const deleteBtn = controls.querySelector('.delete-dt-col-btn');
                const sortIcon = th.querySelector('.td-header-icon i');

                const type = inferColumnType(th, table);
                th.setAttribute('data-column-type', type);
                if (typeSelector) setSelectValue(typeSelector, type);

                if (sortIcon) bindActionIcon(sortIcon);

                // grab cursor: CSS (#mockZone .data-table-header-cell), not an inline style that was
                // saved / live-synced with every hover
                th.addEventListener('mouseenter', () => {
                    if (!shared.activeControls && !shared.resizing) controls.style.display = 'flex';
                });
                th.addEventListener('mouseleave', (e) => {
                    if (!controls.contains(e.relatedTarget) && shared.activeControls !== controls) {
                        controls.style.display = 'none';
                    }
                });

                if (typeSelector) {
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

                bindResizer(th, resizer, controls);
            };

            const createHeaderCell = (text = 'New Column', type = ColumnTypes.TEXT) => {
                const th = document.createElement('th');
                th.className = 'data-table-header-cell';
                th.setAttribute('data-column-type', type);

                const headerContent = document.createElement('div');
                headerContent.className = 'data-table-header-content';

                const headerText = document.createElement('span');
                headerText.className = 'usa';
                headerText.textContent = text;
                headerText.setAttribute('contenteditable', 'true');
                headerContent.appendChild(headerText);

                const headerIconContainer = document.createElement('div');
                headerIconContainer.className = 'td-header-icon icon-container';
                const sortIcon = document.createElement('i');
                sortIcon.className = 'fas fa-sort';
                headerIconContainer.appendChild(sortIcon);
                headerContent.appendChild(headerIconContainer);

                th.appendChild(headerContent);
                th.appendChild(buildControls());
                th.appendChild(buildResizer());

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
                    syncSelectAll(table);
                });
                // Row is position: relative while hovered via CSS (#mockZone .data-table-row:hover)
                tr.addEventListener('mouseenter', () => {
                    deleteBtn.style.display = 'flex';
                    placeRowDelete(tr, deleteBtn);
                });
                tr.addEventListener('mouseleave', () => {
                    deleteBtn.style.display = 'none';
                });

                tr.querySelectorAll(':scope > td.dt-cell-td').forEach(hydrateCell);
            };

            // The × sits at the row's right end, over the last cell. A number column is
            // right-aligned, so there it would cover the value: put it at the left of that
            // cell instead. Measured on screen, divided by the editor zoom.
            function placeRowDelete(tr, btn) {
                const cells = tr.querySelectorAll(':scope > td.dt-cell-td');
                const last = cells[cells.length - 1];
                if (!last || !last.classList.contains('dt-number')) {
                    btn.style.removeProperty('right');
                    return;
                }
                const trRect = tr.getBoundingClientRect();
                const scale = (trRect.width / tr.offsetWidth) || 1;
                const fromRight = (trRect.right - last.getBoundingClientRect().left) / scale;
                btn.style.right = `${Math.max(14, fromRight - 10 - btn.offsetWidth)}px`;
            }

            const createRow = () => {
                const tr = document.createElement('tr');
                tr.className = 'data-table-row';
                const rowIndex = tbody.children.length;
                Array.from(headerRow.children).forEach(th => {
                    tr.appendChild(createCell(th.getAttribute('data-column-type') || ColumnTypes.TEXT, null, rowIndex));
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
                    // Highlight the dragged column with a session class (stripped on save / sync /
                    // undo), not inline styles that a save mid-drag would keep
                    onStart(evt) {
                        evt.item.classList.add(DRAG_CLASS);
                        table.querySelectorAll(`tbody td:nth-child(${evt.oldIndex + 1})`).forEach(cell => {
                            cell.classList.add(DRAG_CLASS);
                        });
                    },
                    onEnd(evt) {
                        table.querySelectorAll(`.${DRAG_CLASS}`).forEach(el => el.classList.remove(DRAG_CLASS));

                        const { oldIndex, newIndex } = evt;
                        if (oldIndex === newIndex) return;

                        table.querySelectorAll('tbody tr').forEach(row => {
                            const cells = Array.from(row.children);
                            const [movedCell] = cells.splice(oldIndex, 1);
                            row.insertBefore(movedCell, cells[newIndex] || null);
                        });
                        syncSelectAll(table);
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
                table.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
                    const controls = row.querySelector(':scope > .row-controls');
                    row.insertBefore(createCell(ColumnTypes.TEXT, null, rowIndex), controls);
                });
            });

            rebindButton('.data-table-add-row-btn', () => {
                if (tbody.children.length >= MAX_ROWS) return;
                tbody.appendChild(createRow());
                updateAddButtonVisibility();
                syncSelectAll(table);
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
            // A person's avatar initials follow their name
            table.addEventListener('input', (e) => {
                const name = e.target.closest?.('.dt-person-name');
                const avatar = name?.parentElement?.querySelector(':scope > .dt-avatar');
                if (avatar) {
                    const text = initials(name.textContent);
                    if (avatar.textContent !== text) avatar.textContent = text;
                }
            });

            // A checkbox column's select-all box (in its header) ticks / clears every row
            headerRow.addEventListener('click', (e) => {
                const box = e.target.closest('.dt-select-all');
                if (!box) return;
                e.stopPropagation();
                toggleColumn(table, columnIndexOf(box.closest('th')));
            });

            table.addEventListener('paste', (e) => {
                if (!editableTarget(e)) return;
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text/plain');
                document.execCommand('insertText', false, text.replace(/\s*[\r\n]+\s*/g, ' '));
            });

            // ---- build or hydrate -------------------------------------------------------

            if (headerRow.children.length === 0) {
                [
                    { text: 'All', type: ColumnTypes.CHECKBOX },
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
            syncSelectAll(table);

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
