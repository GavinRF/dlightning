// Component registry module — see docs/component-module-migration.md
// datePicker: date field / calendars. Owns its variants (setupVariants falls through).
//
//   1 Classic   — text field + toggleable calendar popover (the original)
//   2 iOS wheel — month / day / year wheels (static mockup, values editable)
//   3 Material  — inline calendar card with header date + Cancel/OK
//   4 iOS inline calendar — compact month grid + time row
//
// setup() accepts either the original 4 args (wrapper, dateText, calendarIcon,
// calendarComponent) or just a root element (as undo/live sync call it), and binds
// whatever the markup contains. Calendar grids (.dp-grid) select a day on click: the
// selected day keeps the inline background color (swatch + contrast) and the swatches
// are rebuilt for it.
window.Components = window.Components || {};

window.Components.datePicker = (() => {
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];

    // January 2025 starts on a Wednesday (3 leading blanks, Sun-first weeks)
    const grid = (selected = 15, color = 'var(--color-primary)') => {
        let html = '<span class="dp-blank"></span>'.repeat(3);
        for (let d = 1; d <= 31; d++) {
            html += d === selected
                ? `<span class="dp-day dp-selected" style="background-color: ${color};">${d}</span>`
                : `<span class="dp-day">${d}</span>`;
        }
        return `<div class="dp-grid">${html}</div>`;
    };
    const weekdays = (labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']) =>
        `<div class="dp-weekdays non-editable">${labels.map(l => `<span>${l}</span>`).join('')}</div>`;

    const wheel = (items, selectedIndex) => `<div class="dp-wheel-col">${items.map((t, i) =>
        `<div class="dp-wheel-item${i === selectedIndex ? ' dp-wheel-selected' : ''} usa" contenteditable="true">${t}</div>`).join('')}</div>`;

    const classicDays = Array.from({ length: 31 }, (_, i) =>
        `<span class="date-picker-day-cell">${i + 1}</span>`).join('');

    const VARIANTS = [
        // 1 — Classic field + popover (matches the old JS factory's markup)
        /*html*/
        `<div class="date-picker-wrapper"><span class="usa" contenteditable="true" spellcheck="false" style="opacity: 0.7;">DD/MM/YYYY</span><i class="fas fa-calendar-alt date-picker-icon" style="color: var(--color-primary);"></i><div class="date-picker-calendar-con"><div class="date-picker-month-text usa" contenteditable="true">January</div><div class="date-picker-year-text usa" contenteditable="true">2025</div><div class="date-picker-days-grid">${classicDays}</div></div></div>`,

        // 2 — iOS wheel
        /*html*/
        `<div class="dp-ios-wheel">
            <div class="dp-wheel-band"></div>
            ${wheel(['November', 'December', 'January', 'February', 'March'], 2)}
            ${wheel(['13', '14', '15', '16', '17'], 2)}
            ${wheel(['2023', '2024', '2025', '2026', '2027'], 2)}
        </div>`,

        // 3 — Material calendar card
        /*html*/
        `<div class="dp-cal dp-material">
            <div class="dp-m-head">
                <div class="dp-m-caption usa" contenteditable="true">Select date</div>
                <div class="dp-m-date-row">
                    <div class="dp-header-date usa" contenteditable="true">Jan 15</div>
                    <div class="icon-container"><i class="fas fa-pen"></i></div>
                </div>
            </div>
            <div class="dp-month-row">
                <span class="dp-month usa" contenteditable="true">January 2025</span>
                <div class="icon-container dp-nav"><i class="fas fa-chevron-left"></i><i class="fas fa-chevron-right"></i></div>
            </div>
            ${weekdays()}
            ${grid(15)}
            <div class="dp-actions" style="color: var(--color-primary);">
                <span class="usa" contenteditable="true">Cancel</span>
                <span class="usa" contenteditable="true">OK</span>
            </div>
        </div>`,

        // 4 — iOS inline calendar
        /*html*/
        `<div class="dp-cal dp-ios-cal">
            <div class="dp-month-row">
                <span class="dp-month usa" contenteditable="true">January 2025</span>
                <div class="icon-container dp-nav" style="color: var(--color-accent);"><i class="fas fa-chevron-left"></i><i class="fas fa-chevron-right"></i></div>
            </div>
            ${weekdays(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'])}
            ${grid(15, 'var(--color-accent)')}
            <div class="dp-time-row">
                <span class="usa" contenteditable="true">Time</span>
                <span class="dp-time-pill usa" contenteditable="true">9:41 AM</span>
            </div>
        </div>`
    ];

    // --- classic popover ---------------------------------------------------------------
    const bindClassic = (wrapper, dateText, calendarIcon, calendarComponent) => {
        if (!wrapper || !dateText || !calendarIcon || !calendarComponent) return;
        // Bind once per element: a second calendarIcon listener would toggle the
        // calendar straight back closed. (Expandos aren't cloned, so duplicates still bind.)
        if (wrapper._datePickerBound) return;
        wrapper._datePickerBound = true;

        dateText.addEventListener('input', () => {
            dateText.style.opacity = '1';
        });

        calendarIcon.addEventListener('click', () => {
            calendarComponent.style.display = calendarComponent.style.display === 'none' ? 'block' : 'none';
        });

        wrapper.querySelectorAll('.date-picker-day-cell').forEach(dayCell => {
            dayCell.addEventListener('click', () => {
                const month = wrapper.querySelector('.date-picker-month-text').textContent;
                const year = wrapper.querySelector('.date-picker-year-text').textContent;
                dateText.textContent = `${month} ${dayCell.textContent}, ${year}`;
                calendarComponent.style.display = 'none';
                dateText.style.opacity = '1';
            });
        });
    };

    // --- calendar grids ----------------------------------------------------------------
    const rebuildSwatches = (el) => {
        const cc = el.closest('.component-container');
        const content = cc?.querySelector(':scope > .component-content');
        if (!cc || !content || typeof editor === 'undefined') return;
        cc.querySelectorAll(':scope > .color-swatch-container').forEach(s => s.remove());
        editor.createColorSwatchesForVariant(cc, content);
        window.updateComponentSwatches?.(cc);
    };

    // Month row "January 2025" → { month: 0, year: 2025 } (null if it isn't a month + year)
    const parseMonth = (text) => {
        const [name = '', yearText] = (text || '').trim().split(/\s+/);
        const month = MONTHS.findIndex(m => m.toLowerCase().startsWith(name.toLowerCase().slice(0, 3)) && name.length >= 3);
        const year = parseInt(yearText, 10);
        return month >= 0 && Number.isFinite(year) ? { month, year } : null;
    };

    // Rebuild a calendar's grid for another month (prototype player only). The selected
    // day keeps its number where it exists and its color; the header follows.
    const shiftMonth = (cal, delta) => {
        const label = cal.querySelector('.dp-month');
        const cur = parseMonth(label?.textContent);
        const gridEl = cal.querySelector('.dp-grid');
        if (!cur || !gridEl) return;
        const d = new Date(cur.year, cur.month + delta, 1);
        const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        const prev = gridEl.querySelector('.dp-day.dp-selected');
        const color = prev?.style.backgroundColor || 'var(--color-primary)';
        const selected = Math.min(parseInt(prev?.textContent, 10) || 1, days);
        let html = '<span class="dp-blank"></span>'.repeat(d.getDay());
        for (let n = 1; n <= days; n++) html += `<span class="dp-day">${n}</span>`;
        gridEl.innerHTML = html;
        label.textContent = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
        const day = gridEl.querySelectorAll('.dp-day')[selected - 1];
        day.classList.add('dp-selected');
        day.style.backgroundColor = color;
        selectDay(cal, day, { play: true, force: true });
    };

    const selectDay = (cal, day, { play = false, force = false } = {}) => {
        const prev = cal.querySelector('.dp-day.dp-selected');
        if (prev === day && !force) return;
        // The selected day's color moves with the selection (keeps a swatch-picked color)
        const color = prev?.style.backgroundColor || 'var(--color-primary)';
        if (prev && prev !== day) {
            prev.classList.remove('dp-selected');
            prev.style.removeProperty('background-color');
            prev.style.removeProperty('color');
        }
        day.classList.add('dp-selected');
        day.style.backgroundColor = color;
        window.TextContrastAdjuster?.updateElementContrast(day);

        // Material header: "Jan 15" from the month row's month name
        const header = cal.querySelector('.dp-header-date');
        if (header) {
            const monthName = (cal.querySelector('.dp-month')?.textContent || '').trim().split(/\s+/)[0];
            const known = MONTHS.find(m => m.toLowerCase().startsWith(monthName.toLowerCase().slice(0, 3)));
            header.textContent = `${(known || monthName).slice(0, 3)} ${day.textContent.trim()}`;
        }
        if (!play) rebuildSwatches(cal); // the player's clone has no editor chrome
    };

    const bindCalendars = (root) => {
        const cals = root.classList?.contains('dp-cal') ? [root] : [...(root.querySelectorAll?.('.dp-cal') || [])];
        cals.forEach(cal => {
            if (cal._dpBound) return;
            cal._dpBound = true;
            cal.addEventListener('click', (e) => {
                const day = e.target.closest('.dp-day');
                if (day && cal.contains(day)) selectDay(cal, day);
            });
        });
    };

    return {
        variants() {
            return VARIANTS.slice();
        },

        // Build a fresh picker (variant 1) — used by the editor factory on insert.
        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            const el = temp.firstElementChild;
            this.setup(el);
            return el;
        },

        afterVariantChange(content) {
            this.setup(content);
        },

        // Prototype player (js/prototype.js): the classic field opens its calendar (from the
        // field or the icon) and a day fills it in; calendars pick a day and page months
        // with the chevrons; wheel columns pick the tapped item. Nothing touches swatches.
        play(root) {
            root.querySelectorAll('.date-picker-wrapper').forEach(wrapper => {
                const cal = wrapper.querySelector('.date-picker-calendar-con');
                const field = wrapper.querySelector(':scope > span');
                if (!cal || wrapper._playBound) return;
                wrapper._playBound = true;
                wrapper.style.cursor = 'pointer';
                cal.style.display = 'none';
                wrapper.addEventListener('click', (e) => {
                    const cell = e.target.closest('.date-picker-day-cell');
                    if (cell) {
                        const month = wrapper.querySelector('.date-picker-month-text')?.textContent.trim() || '';
                        const year = wrapper.querySelector('.date-picker-year-text')?.textContent.trim() || '';
                        if (field) { field.textContent = `${month} ${cell.textContent.trim()}, ${year}`; field.style.opacity = '1'; }
                        cal.style.display = 'none';
                    } else if (!cal.contains(e.target)) {
                        cal.style.display = cal.style.display === 'none' ? 'block' : 'none';
                    }
                });
            });

            root.querySelectorAll('.dp-cal').forEach(cal => {
                if (cal._playBound) return;
                cal._playBound = true;
                cal.addEventListener('click', (e) => {
                    const day = e.target.closest('.dp-day');
                    if (day) return selectDay(cal, day, { play: true });
                    const chevron = e.target.closest('.dp-nav i');
                    if (chevron) shiftMonth(cal, chevron.classList.contains('fa-chevron-left') ? -1 : 1);
                });
                cal.querySelectorAll('.dp-nav i').forEach(i => { i.style.cursor = 'pointer'; });
            });

            root.querySelectorAll('.dp-wheel-col').forEach(col => {
                if (col._playBound) return;
                col._playBound = true;
                col.addEventListener('click', (e) => {
                    const item = e.target.closest('.dp-wheel-item');
                    if (!item) return;
                    // Roll the column so the tapped value lands in the selection band
                    const items = [...col.querySelectorAll('.dp-wheel-item')];
                    const center = items.findIndex(el => el.classList.contains('dp-wheel-selected'));
                    const shift = items.indexOf(item) - (center >= 0 ? center : Math.floor(items.length / 2));
                    const texts = items.map(el => el.textContent);
                    items.forEach((el, i) => { el.textContent = texts[(((i + shift) % items.length) + items.length) % items.length]; });
                });
            });
        },

        setup(wrapper, dateText, calendarIcon, calendarComponent) {
            if (!wrapper) return;
            if (dateText && calendarIcon && calendarComponent) {
                bindClassic(wrapper, dateText, calendarIcon, calendarComponent);
                return;
            }
            // Root-only call: find the parts of whatever variant this is
            const classic = wrapper.classList?.contains('date-picker-wrapper')
                ? wrapper : wrapper.querySelector?.('.date-picker-wrapper');
            if (classic) {
                bindClassic(classic,
                    classic.querySelector('span'),
                    classic.querySelector('.date-picker-icon') || classic.querySelector('i'),
                    classic.querySelector('.date-picker-calendar-con'));
            }
            bindCalendars(wrapper);
        }
    };
})();
