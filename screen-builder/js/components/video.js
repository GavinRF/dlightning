// Component registry module — see docs/component-module-migration.md
// video: paste a YouTube/Vimeo URL to embed it as an iframe.
window.Components = window.Components || {};

window.Components.video = {
    // Prototype player (js/prototype.js): play/pause. Thumbnail variants hide the round play
    // button while "playing" (tap the video again to pause); the player variant runs its
    // progress bar and time in real time, can be scrubbed, and mutes from the volume icon.
    play(root) {
        // Thumbnail + round play button (classic, video card)
        root.querySelectorAll('.video-container, .video-card').forEach(box => {
            const btn = box.querySelector('.video-play-button');
            if (!btn || box._playBound) return;
            box._playBound = true;
            const icon = btn.querySelector('i');
            box.style.cursor = 'pointer';
            box.addEventListener('click', (e) => {
                if (e.target.closest('[data-proto-action]')) return;
                const on = !box.classList.contains('proto-video-playing');
                box.classList.toggle('proto-video-playing', on);
                icon?.classList.replace(on ? 'fa-play' : 'fa-pause', on ? 'fa-pause' : 'fa-play');
            });
        });

        // Player with controls
        root.querySelectorAll('.video-controls').forEach(controls => {
            if (controls._playBound) return;
            controls._playBound = true;
            const barEl = controls.querySelector('.video-progress-bar');
            const progress = controls.querySelector('.video-progress');
            const timeEl = controls.querySelector('.video-time');
            const toSecs = (t) => (t || '').trim().split(':').reduce((s, p) => s * 60 + (parseInt(p, 10) || 0), 0);
            const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
            const [, totalText] = (timeEl?.textContent || '').split('/');
            const total = toSecs(totalText) || 300;
            let fraction = progress ? (parseFloat(progress.style.width) ||
                (barEl?.offsetWidth ? progress.offsetWidth / barEl.offsetWidth : 0.25)) : 0;
            let timer = null;

            const render = () => {
                if (progress) progress.style.width = `${(fraction * 100).toFixed(2)}%`;
                if (timeEl) timeEl.textContent = `${fmt(total * fraction)} / ${totalText ? totalText.trim() : fmt(total)}`;
            };
            const toggleIcon = () => controls.querySelector('.video-control-icon i.fa-pause, .video-control-icon i.fa-play');
            const setPlaying = (on) => {
                clearInterval(timer);
                timer = null;
                const i = toggleIcon();
                i?.classList.replace(on ? 'fa-play' : 'fa-pause', on ? 'fa-pause' : 'fa-play');
                if (!on) return;
                timer = setInterval(() => {
                    if (!controls.isConnected) return clearInterval(timer);
                    fraction = Math.min(1, fraction + 0.25 / total);
                    render();
                    if (fraction >= 1) setPlaying(false);
                }, 250);
            };

            controls.addEventListener('click', (e) => {
                const i = e.target.closest('.video-control-icon')?.querySelector('i');
                if (!i) return;
                if (i.matches('.fa-pause, .fa-play')) setPlaying(i.classList.contains('fa-play'));
                else if (i.matches('.fa-volume-high, .fa-volume-xmark')) {
                    const muted = i.classList.contains('fa-volume-high');
                    i.classList.replace(muted ? 'fa-volume-high' : 'fa-volume-xmark', muted ? 'fa-volume-xmark' : 'fa-volume-high');
                }
            });

            if (barEl) {
                barEl.style.touchAction = 'none';
                barEl.addEventListener('pointerdown', (e) => {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    barEl.setPointerCapture?.(e.pointerId);
                    const at = (ev) => {
                        const r = barEl.getBoundingClientRect();
                        fraction = r.width ? Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) : 0;
                        render();
                    };
                    at(e);
                    const end = () => {
                        barEl.removeEventListener('pointermove', at);
                        barEl.removeEventListener('pointerup', end);
                        barEl.removeEventListener('pointercancel', end);
                    };
                    barEl.addEventListener('pointermove', at);
                    barEl.addEventListener('pointerup', end);
                    barEl.addEventListener('pointercancel', end);
                });
            }

            // The variant is designed mid-playback (a pause icon showing): keep it playing
            if (toggleIcon()?.classList.contains('fa-pause')) setPlaying(true);
        });
    },

    afterVariantChange(content) {
        this.setup(content);
    },

    // Comments section (editor): hover a comment for × (remove), hover the component for
    // "+ Add comment" (a copy of the last comment, fresh text and avatar, no replies).
    // The chrome is saved with the markup like the breadcrumb's; safe to call repeatedly.
    setupComments(content) {
        const section = content?.classList?.contains('video-comments') ? content : content?.querySelector('.video-comments');
        if (!section) return;
        const addDel = (comment) => {
            if (comment.querySelector(':scope > .vc-del')) return;
            const del = document.createElement('button');
            del.type = 'button';
            del.className = 'vc-del non-editable';
            del.title = 'Remove comment';
            del.textContent = '×';
            comment.appendChild(del);
        };
        section.querySelectorAll('.video-comment').forEach(addDel);
        if (!section.querySelector(':scope > .vc-add-btn')) {
            const add = document.createElement('button');
            add.type = 'button';
            add.className = 'vc-add-btn non-editable';
            add.innerHTML = '+ Add comment';
            section.appendChild(add);
        }
        if (section._vcBound) return;
        section._vcBound = true;
        section.addEventListener('click', (e) => {
            const ctrl = e.target.closest('.vc-del, .vc-add-btn');
            if (!ctrl || !section.contains(ctrl)) return;
            e.preventDefault();
            e.stopPropagation();
            const comments = [...section.querySelectorAll('.video-comment')];
            if (ctrl.classList.contains('vc-del')) {
                // keep one: play mode copies it for posted comments
                if (comments.length > 1) ctrl.closest('.video-comment')?.remove();
                return;
            }
            const last = comments[comments.length - 1];
            if (!last) return;
            const comment = last.cloneNode(true);
            comment.querySelector('.video-comment-replies')?.remove();
            const set = (sel, t) => { const el = comment.querySelector(sel); if (el) el.textContent = t; };
            set('.video-comment-name', '@username');
            set('.video-comment-time', 'Just now');
            set('.video-comment-text', 'Write a comment here.');
            comment.querySelectorAll('.nav-image').forEach(img => {
                img.classList.remove('with-image');
                img.style.backgroundImage = '';
                img.style.backgroundColor = '';
                img.innerHTML = '<i class="fa-solid fa-image image-ph non-editable"></i>';
            });
            ctrl.before(comment);
            addDel(comment);
            if (typeof editor !== 'undefined') {
                editor.setupIconPicker(comment);
                editor.setupImageUpload(comment);
            }
        });
    },

    setup(content) {
        this.setupComments(content);
        const embedContainer = content.querySelector('.video-embed-container');
        if (!embedContainer) return;

        const urlInput = embedContainer.querySelector('input[type="text"]');
        const embedButton = embedContainer.querySelector('.embed-video-btn');
        const placeholder = embedContainer.querySelector('.video-placeholder');
        const embeddedVideo = embedContainer.querySelector('.embedded-video');

        if (embedButton && urlInput) {
            // Remove existing listeners by cloning
            embedButton.replaceWith(embedButton.cloneNode(true));
            const newEmbedButton = embedContainer.querySelector('.embed-video-btn');

            // Add fresh event listener
            newEmbedButton.addEventListener('click', () => {
                const url = urlInput.value.trim();
                let videoId;

                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                    if (videoId) {
                        embeddedVideo.innerHTML = `
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/${videoId}"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>`;
                    }
                } else if (url.includes('vimeo.com')) {
                    videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
                    if (videoId) {
                        embeddedVideo.innerHTML = `
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://player.vimeo.com/video/${videoId}"
                                frameborder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowfullscreen>
                            </iframe>`;
                    }
                }

                if (videoId) {
                    placeholder.style.display = 'none';
                    embeddedVideo.style.display = 'block';
                } else {
                    alert('Please enter a valid YouTube or Vimeo URL');
                }
            });
        }
    }
};
