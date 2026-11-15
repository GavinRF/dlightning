// Component registry module — see docs/component-module-migration.md
// musicPlayer: static "now playing" mockup (album art, title/artist, progress, controls).
//
// This module owns its variant HTML: setupVariants('musicPlayer') falls through to
// window.Components.musicPlayer.variants() (see the `default:` in variants.js), so the
// arrows / templates / insertComponent({ variant }) all work with no core changes.
//
// No setup() — in the editor the only behavior is waveform scrubbing (delegated). In the
// prototype player, play() (playHook) runs play/pause, skip, ±15s, seek and the heart /
// shuffle / repeat toggles. Control hover is CSS
// (.music-player-container .player-controls i:hover), so it survives duplicate,
// save/reload and live sync untouched.
//
// Authoring notes (same hooks as variants.js):
//  - Each variant string must start with `<` — the variant switcher takes temp.firstChild.
//  - Keep `music-player-container` on the root and `player-controls` on the control row
//    so the shared CSS applies; `icon-container` makes each control icon pickable.
//  - `.card-image` = album art upload slot; `var(--color-*)` backgrounds get swatches.
window.Components = window.Components || {};

window.Components.musicPlayer = (() => {
    const ICON_BTN = 'cursor: pointer; opacity: 0.8; transition: opacity 0.2s;';
    const icon = (cls, size = '16px') =>
        `<i class="fas ${cls}" style="font-size: ${size}; ${ICON_BTN}"></i>`;

    const progressBar = (height = '4px') => /*html*/`<div style="width: 100%; height: ${height}; background-color: var(--neutral-gray); border-radius: 2px; position: relative;">
                <div style="width: 45%; height: 100%; background-color: var(--color-accent); border-radius: 2px; position: relative;">
                    <div style="width: 12px; height: 12px; background-color: var(--color-accent); border-radius: 50%; position: absolute; right: -6px; top: 50%; transform: translateY(-50%);"></div>
                </div>
            </div>`;

    const times = /*html*/`<div style="display: flex; justify-content: space-between; font-size: 12px;">
                <div contenteditable="true">1:45</div>
                <div contenteditable="true">3:30</div>
            </div>`;

    // Vertical-line waveform. Bar heights are a fixed, deterministic shape (layered sines)
    // so every insert looks the same and the HTML stays stable for undo/sync diffs.
    // Color comes from ONE inline `color: var(--color-accent)` on the wrapper — the bars
    // paint with currentColor via CSS (.mp-waveform) — so the component gets a single
    // swatch for the whole wave instead of one per bar.
    // Also used by the chat voice-message variant (via waveformHTML below): pass
    // color: null to inherit the surrounding text color (e.g. a bubble's contrast color).
    const waveform = (bars = 48, played = 0.45, { color = 'var(--color-accent)', height = null } = {}) => {
        const playedCount = Math.round(bars * played);
        let html = '';
        for (let i = 0; i < bars; i++) {
            const t = i / bars;
            const env = 0.55 + 0.45 * Math.sin(Math.PI * t);               // louder mid-song
            const wobble = Math.abs(Math.sin(i * 1.7) * 0.6 + Math.sin(i * 0.45) * 0.4);
            const h = Math.round(Math.max(12, Math.min(100, env * (25 + 75 * wobble))));
            const cls = i < playedCount ? 'mp-wave-bar' : 'mp-wave-bar mp-wave-unplayed';
            html += `<span class="${cls}" style="height: ${h}%;"></span>`;
        }
        const style = [color && `color: ${color};`, height && `height: ${height};`].filter(Boolean).join(' ');
        return `<div class="mp-waveform non-editable" data-played="${played}" title="Click or drag to set how much has played"${style ? ` style="${style}"` : ''}>${html}</div>`;
    };

    // --- Waveform scrubbing -------------------------------------------------------------
    // Click/drag across a waveform to set how much is "played". The state is just the
    // bars' mp-wave-unplayed class (+ data-played), so it saves, syncs, duplicates and
    // undoes like any other markup edit. One delegated document listener (installed once
    // below) instead of per-instance setup, so load / duplicate / live sync / undo /
    // variant switch need no wiring.
    const parseTime = (text) => {
        const parts = (text || '').trim().split(':');
        if (parts.length < 2 || parts.some(p => !/^\d+$/.test(p))) return null;
        return parts.reduce((total, p) => total * 60 + parseInt(p, 10), 0);
    };
    const formatTime = (secs, like) => {
        const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
        const pad = (n) => String(n).padStart(2, '0');
        // Keep the total's format (h:mm:ss vs m:ss)
        return (like.split(':').length > 2 || h) ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
    };

    const setPlayed = (waveformEl, fraction) => {
        const bars = waveformEl.querySelectorAll('.mp-wave-bar');
        if (!bars.length) return;
        const count = Math.round(Math.max(0, Math.min(1, fraction)) * bars.length);
        bars.forEach((bar, i) => bar.classList.toggle('mp-wave-unplayed', i >= count));
        const value = +(count / bars.length).toFixed(3);
        if (waveformEl.dataset.played !== String(value)) waveformEl.dataset.played = value;

        // Keep the elapsed time in step with the scrubber, when the total is a time
        const player = waveformEl.closest('.music-player-container, .chat-voice');
        const current = player?.querySelector('.mp-time-current');
        const totalEl = player?.querySelector('.mp-time-total');
        const total = parseTime(totalEl?.textContent);
        if (current && total != null) {
            const text = formatTime(Math.round(total * value), totalEl.textContent.trim());
            if (current.textContent !== text) current.textContent = text;
        }
    };

    const fractionAt = (waveformEl, clientX) => {
        const rect = waveformEl.getBoundingClientRect();
        return rect.width ? (clientX - rect.left) / rect.width : 0;
    };

    if (!window.__musicPlayerScrubInstalled) {
        window.__musicPlayerScrubInstalled = true;
        document.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            const waveformEl = e.target.closest?.('.mp-waveform');
            if (!waveformEl || waveformEl.closest('.color-swatch-container')) return;
            e.preventDefault(); // no text selection while scrubbing
            setPlayed(waveformEl, fractionAt(waveformEl, e.clientX));

            const move = (ev) => setPlayed(waveformEl, fractionAt(waveformEl, ev.clientX));
            const end = () => {
                document.removeEventListener('pointermove', move);
                document.removeEventListener('pointerup', end);
                document.removeEventListener('pointercancel', end);
            };
            document.addEventListener('pointermove', move);
            document.addEventListener('pointerup', end);
            document.addEventListener('pointercancel', end);
        });
    }

    const VARIANTS = [
        // 1 — Classic (the original player; markup matches what was built in JS before,
        // so players saved before variants existed are this variant)
        /*html*/
        `<div class="music-player-container">
            <div class="resizeable" style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                <div class="card-image" style="width: 80px; height: 80px; background-color: var(--neutral-gray); border-radius: 4px; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    <i class="fas fa-music" style="font-size: 24px;"></i>
                </div>
                <div style="flex-grow: 1;">
                    <div contenteditable="true" style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">Song Title</div>
                    <div contenteditable="true" style="font-size: 14px; opacity: 0.8;">Artist Name</div>
                </div>
            </div>
            <div style="margin-bottom: 16px;">
                <div style="margin-bottom: 8px;">${progressBar()}</div>
                ${times}
            </div>
            <div class="player-controls icon-container" style="display: flex; justify-content: center; align-items: center; gap: 24px;">
                ${icon('fa-backward-step')}
                ${icon('fa-play', '24px')}
                ${icon('fa-forward-step')}
            </div>
        </div>`,

        // 2 — Now Playing (full-width art, like a player screen)
        /*html*/
        `<div class="music-player-container" style="display: flex; flex-direction: column; gap: 16px; padding: 8px;">
            <div class="card-image resizeable" style="width: 100%; height: 280px; background-color: var(--neutral-gray); border-radius: 12px; display: flex; justify-content: center; align-items: center;">
                <i class="fas fa-music" style="font-size: 48px;"></i>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="flex-grow: 1; min-width: 0;">
                    <div contenteditable="true" style="font-size: 20px; font-weight: bold; margin-bottom: 4px;">Song Title</div>
                    <div contenteditable="true" style="font-size: 15px; opacity: 0.8;">Artist Name</div>
                </div>
                <div class="player-controls icon-container">${icon('fa-heart', '20px')}</div>
            </div>
            <div>
                <div style="margin-bottom: 8px;">${progressBar()}</div>
                ${times}
            </div>
            <div class="player-controls icon-container" style="display: flex; justify-content: space-between; align-items: center; padding: 0 8px;">
                ${icon('fa-shuffle')}
                ${icon('fa-backward-step', '22px')}
                <div style="width: 60px; height: 60px; border-radius: 50%; background-color: var(--color-accent); display: flex; justify-content: center; align-items: center;">
                    ${icon('fa-play', '24px')}
                </div>
                ${icon('fa-forward-step', '22px')}
                ${icon('fa-repeat')}
            </div>
        </div>`,

        // 3 — Mini player (compact now-playing bar, progress along the bottom)
        /*html*/
        `<div class="music-player-container" style="padding: 0; overflow: hidden; border-radius: 12px; background-color: var(--color-secondary);">
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px;">
                <div class="card-image" style="width: 44px; height: 44px; background-color: var(--neutral-gray); border-radius: 6px; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    <i class="fas fa-music" style="font-size: 16px;"></i>
                </div>
                <div style="flex-grow: 1; min-width: 0;">
                    <div contenteditable="true" style="font-size: 15px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Song Title</div>
                    <div contenteditable="true" style="font-size: 13px; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Artist Name</div>
                </div>
                <div class="player-controls icon-container" style="display: flex; align-items: center; gap: 18px; flex-shrink: 0;">
                    ${icon('fa-heart')}
                    ${icon('fa-play', '20px')}
                    ${icon('fa-forward-step')}
                </div>
            </div>
            <div style="height: 3px; background-color: var(--neutral-gray);">
                <div style="width: 45%; height: 100%; background-color: var(--color-accent);"></div>
            </div>
        </div>`,

        // 4 — Card (colored card with a round play button)
        /*html*/
        `<div class="music-player-container" style="padding: 16px; border-radius: 16px; background-color: var(--color-primary); display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <div class="card-image" style="width: 64px; height: 64px; background-color: var(--neutral-gray); border-radius: 10px; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    <i class="fas fa-music" style="font-size: 20px;"></i>
                </div>
                <div style="flex-grow: 1; min-width: 0;">
                    <div contenteditable="true" style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; margin-bottom: 4px;">Now Playing</div>
                    <div contenteditable="true" style="font-size: 17px; font-weight: bold; margin-bottom: 2px;">Song Title</div>
                    <div contenteditable="true" style="font-size: 14px; opacity: 0.8;">Artist Name</div>
                </div>
                <div class="player-controls icon-container" style="width: 48px; height: 48px; border-radius: 50%; background-color: var(--color-accent); display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    ${icon('fa-play', '20px')}
                </div>
            </div>
            <div>
                <div style="margin-bottom: 8px;">${progressBar()}</div>
                ${times}
            </div>
        </div>`,

        // 5 — Waveform (vertical-line sound wave as the scrubber)
        /*html*/
        `<div class="music-player-container" style="display: flex; flex-direction: column; gap: 14px; padding: 8px;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <div class="card-image" style="width: 56px; height: 56px; background-color: var(--neutral-gray); border-radius: 8px; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    <i class="fas fa-music" style="font-size: 18px;"></i>
                </div>
                <div style="flex-grow: 1; min-width: 0;">
                    <div contenteditable="true" style="font-size: 17px; font-weight: bold; margin-bottom: 2px;">Song Title</div>
                    <div contenteditable="true" style="font-size: 14px; opacity: 0.8;">Artist Name</div>
                </div>
                <div class="player-controls icon-container">${icon('fa-ellipsis', '18px')}</div>
            </div>
            <div>
                <div style="margin-bottom: 6px;">${waveform()}</div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <div class="mp-time-current" contenteditable="true">1:35</div>
                    <div class="mp-time-total" contenteditable="true">3:30</div>
                </div>
            </div>
            <div class="player-controls icon-container" style="display: flex; justify-content: center; align-items: center; gap: 28px;">
                ${icon('fa-rotate-left', '18px')}
                ${icon('fa-backward-step', '20px')}
                ${icon('fa-circle-play', '44px')}
                ${icon('fa-forward-step', '20px')}
                ${icon('fa-rotate-right', '18px')}
            </div>
        </div>`
    ];

    // --- Prototype player (js/prototype.js) -----------------------------------------------
    // Play/pause runs the progress in real time; the bar or waveform can be dragged; next /
    // previous restart the track; the heart toggles. The editor's delegated scrub listener
    // never sees player events (the player stops them bubbling), so this binds its own.
    const PLAY_ICONS = { 'fa-play': 'fa-pause', 'fa-circle-play': 'fa-circle-pause' };
    const PAUSE_ICONS = { 'fa-pause': 'fa-play', 'fa-circle-pause': 'fa-circle-play' };
    const TIME_RE = /^\s*\d+:\d{2}(:\d{2})?\s*$/;

    // A plain progress bar (no class in the markup): a gray track whose first child is a % fill
    const findBar = (root) => [...root.querySelectorAll('div')].find(d => {
        const fill = d.firstElementChild;
        return fill && fill.tagName === 'DIV' && /neutral-gray/.test(d.getAttribute('style') || '') &&
            /width:\s*[\d.]+%/.test(fill.getAttribute('style') || '');
    });

    const playHook = (root) => {
        const player = root.querySelector('.music-player-container');
        if (!player || player._playBound) return;
        player._playBound = true;

        const wave = player.querySelector('.mp-waveform');
        const bar = wave ? null : findBar(player);
        const fill = bar?.firstElementChild;
        let current = player.querySelector('.mp-time-current');
        let totalEl = player.querySelector('.mp-time-total');
        if (!current || !totalEl) {
            const times = [...player.querySelectorAll('div')].filter(d => !d.children.length && TIME_RE.test(d.textContent));
            if (times.length >= 2) { current = times[0]; totalEl = times[times.length - 1]; }
        }
        const total = parseTime(totalEl?.textContent) || 210;
        let fraction = wave ? (parseFloat(wave.dataset.played) || 0) : (parseFloat(fill?.style.width) || 0) / 100;
        let timer = null;

        const render = () => {
            if (wave) { setPlayed(wave, fraction); return; } // also updates the time
            if (fill) fill.style.width = `${(fraction * 100).toFixed(2)}%`;
            if (current && totalEl) current.textContent = formatTime(Math.round(total * fraction), totalEl.textContent.trim());
        };
        const playIcons = () => [...player.querySelectorAll('.player-controls i')]
            .filter(i => Object.keys(PLAY_ICONS).concat(Object.keys(PAUSE_ICONS)).some(c => i.classList.contains(c)));
        const setPlaying = (on) => {
            clearInterval(timer);
            timer = null;
            playIcons().forEach(i => {
                const map = on ? PLAY_ICONS : PAUSE_ICONS;
                Object.entries(map).forEach(([from, to]) => {
                    if (i.classList.contains(from)) i.classList.replace(from, to);
                });
            });
            if (!on) return;
            timer = setInterval(() => {
                if (!player.isConnected) return clearInterval(timer); // screen changed
                fraction = Math.min(1, fraction + 0.25 / total);
                render();
                if (fraction >= 1) setPlaying(false);
            }, 250);
        };

        player.addEventListener('click', (e) => {
            // The icon itself, or a round button around a single icon
            const host = e.target.closest('.player-controls > div, .player-controls');
            const i = e.target.closest('.player-controls i') ||
                (host?.querySelectorAll('i').length === 1 ? host.querySelector('i') : null);
            if (!i) return;
            if (i.matches('.fa-play, .fa-circle-play')) setPlaying(true);
            else if (i.matches('.fa-pause, .fa-circle-pause')) setPlaying(false);
            else if (i.matches('.fa-forward-step, .fa-backward-step')) { fraction = 0; render(); }
            else if (i.matches('.fa-rotate-left, .fa-rotate-right')) {
                fraction = Math.max(0, Math.min(1, fraction + (i.matches('.fa-rotate-left') ? -15 : 15) / total));
                render();
            } else if (i.matches('.fa-heart, .fa-shuffle, .fa-repeat')) {
                i.style.color = i.style.color ? '' : 'var(--color-accent)';
                i.style.opacity = i.style.color ? '1' : '';
            }
        });

        // Drag the waveform or the bar (the track's hit area is padded a little)
        const scrubber = wave || bar;
        if (!scrubber) return;
        if (!wave) { scrubber.style.cursor = 'pointer'; scrubber.style.touchAction = 'none'; }
        scrubber.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            scrubber.setPointerCapture?.(e.pointerId);
            const at = (ev) => { fraction = Math.max(0, Math.min(1, fractionAt(scrubber, ev.clientX))); render(); };
            at(e);
            const end = () => {
                scrubber.removeEventListener('pointermove', at);
                scrubber.removeEventListener('pointerup', end);
                scrubber.removeEventListener('pointercancel', end);
            };
            scrubber.addEventListener('pointermove', at);
            scrubber.addEventListener('pointerup', end);
            scrubber.addEventListener('pointercancel', end);
        });
    };

    return {
        // Variant HTML strings, read by setupVariants('musicPlayer').
        variants() {
            return VARIANTS.slice();
        },

        play: playHook,

        // Waveform markup for other components (chat voice message). Scrubbing works
        // anywhere — the delegated listener matches any .mp-waveform.
        waveformHTML({ bars = 48, played = 0.45, color, height } = {}) {
            return waveform(bars, played, { color, height });
        },

        // Set a waveform's played amount programmatically (0–1), e.g. from templates.
        setPlayed(root, fraction) {
            const waveformEl = root?.matches?.('.mp-waveform') ? root : root?.querySelector?.('.mp-waveform');
            if (waveformEl) setPlayed(waveformEl, fraction);
        },

        // Build a fresh player (variant 1) — used by the editor factory on insert.
        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            return temp.firstElementChild;
        }
    };
})();
