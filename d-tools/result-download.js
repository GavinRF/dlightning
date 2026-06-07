/*
 * Dlightning — Decision Tool Result Downloader
 * -------------------------------------------------
 * Drop-in script that lets visitors save the results of any decision tool
 * as a branded PNG or PDF artifact (Dlightning logo + website + contact),
 * so the result becomes a lasting, recognizable keepsake on their device.
 *
 * Usage — add one line near the bottom of a tool page:
 *
 *   <script src="result-download.js"
 *           data-dl-container="#results"
 *           data-dl-title="UX Maturity Assessment"
 *           data-dl-filename="ux-maturity-results"></script>
 *
 * Config (read from this script tag's data-* attributes):
 *   data-dl-container : CSS selector for the element that holds the results
 *                       and becomes visible once the tool is complete. Its
 *                       contents are what gets captured into the artifact.
 *   data-dl-title     : Friendly tool name shown under the logo in the artifact.
 *   data-dl-filename  : Base name for the downloaded file (no extension).
 *   data-dl-insert    : Optional. Selector to place the download bar after.
 *                       Defaults to the container element itself.
 */
(function () {
    'use strict';

    var cfgEl = document.currentScript;
    var CFG = {
        container: cfgEl.getAttribute('data-dl-container'),
        title: cfgEl.getAttribute('data-dl-title') || document.title || 'Your Results',
        filename: cfgEl.getAttribute('data-dl-filename') || 'dlightning-results',
        insertAfter: cfgEl.getAttribute('data-dl-insert') || null
    };

    var LOGO_SRC = '../img/logo-spelled-out-white.png';
    var SITE = 'dlightning.org';
    var CONTACT = 'dlightningexperience@gmail.com';
    var TAGLINE = 'UX & Experience Design';

    var HTML2CANVAS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    var JSPDF_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

    if (!CFG.container) {
        console.warn('[dl-download] missing data-dl-container; downloader disabled.');
        return;
    }

    /* ---------- one-time style injection ---------- */
    function injectStyles() {
        if (document.getElementById('dl-download-styles')) return;
        var css =
            '.dl-download-bar{display:none;flex-wrap:wrap;align-items:center;justify-content:center;' +
            'gap:12px;margin:22px auto 8px;padding:16px;max-width:520px;text-align:center;}' +
            '.dl-download-label{flex-basis:100%;font-size:.82rem;letter-spacing:.06em;text-transform:uppercase;' +
            'color:#5a6b8c;font-weight:600;margin-bottom:2px;}' +
            '.dl-btn{display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:none;' +
            'font-family:inherit;font-size:.95rem;font-weight:600;padding:11px 22px;border-radius:28px;' +
            'transition:transform .15s ease,box-shadow .15s ease,opacity .15s ease;}' +
            '.dl-btn:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,60,164,.22);}' +
            '.dl-btn:disabled{opacity:.6;cursor:wait;transform:none;box-shadow:none;}' +
            '.dl-btn-pdf{background:linear-gradient(135deg,#0066cc,#003ca4);color:#fff;}' +
            '.dl-btn-png{background:#fff;color:#033488;border:2px solid #0066cc;}' +
            '.dl-btn .dl-spin{width:15px;height:15px;border:2px solid rgba(255,255,255,.45);' +
            'border-top-color:#fff;border-radius:50%;animation:dl-spin .7s linear infinite;display:none;}' +
            '.dl-btn-png .dl-spin{border:2px solid rgba(0,102,204,.35);border-top-color:#0066cc;}' +
            '.dl-btn.is-loading .dl-spin{display:inline-block;}' +
            '.dl-btn.is-loading .dl-ico{display:none;}' +
            '@keyframes dl-spin{to{transform:rotate(360deg);}}' +
            /* offscreen artifact */
            '.dl-artifact{position:fixed;left:-10000px;top:0;width:760px;background:#fff;' +
            'font-family:"Roboto","Helvetica Neue",Arial,sans-serif;color:#1c2536;box-sizing:border-box;}' +
            '.dl-artifact *{box-sizing:border-box;}' +
            '.dl-artifact-header{background:linear-gradient(135deg,#0066cc 0%,#003ca4 100%);' +
            'padding:30px 40px;display:flex;align-items:center;justify-content:space-between;}' +
            '.dl-artifact-logo{height:42px;width:auto;display:block;}' +
            '.dl-artifact-toolname{color:#fff;font-size:1.05rem;font-weight:600;text-align:right;' +
            'max-width:360px;line-height:1.3;opacity:.96;}' +
            '.dl-artifact-body{padding:34px 40px 30px;}' +
            '.dl-artifact-body .dl-clone{display:block!important;}' +
            /* freeze entrance animations so the capture is fully rendered, not mid-fade */
            '.dl-artifact .dl-clone,.dl-artifact .dl-clone *{' +
            'animation:none!important;transition:none!important;opacity:1!important;}' +
            '.dl-artifact-footer{background:#0b1c71;padding:22px 40px;text-align:center;}' +
            '.dl-artifact-footer-main{color:#fff;font-size:1.25rem;font-weight:700;letter-spacing:.02em;}' +
            '.dl-artifact-footer-sub{color:#9db9ff;font-size:.9rem;margin-top:5px;}';
        var s = document.createElement('style');
        s.id = 'dl-download-styles';
        s.textContent = css;
        document.head.appendChild(s);
    }

    /* ---------- lazy script loader ---------- */
    var loaded = {};
    function loadScript(src) {
        if (loaded[src]) return loaded[src];
        loaded[src] = new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = function () { reject(new Error('Failed to load ' + src)); };
            document.head.appendChild(s);
        });
        return loaded[src];
    }

    /* ---------- build the offscreen branded artifact ---------- */
    function buildArtifact(container) {
        var artifact = document.createElement('div');
        artifact.className = 'dl-artifact';

        var header = document.createElement('div');
        header.className = 'dl-artifact-header';
        var logo = document.createElement('img');
        logo.className = 'dl-artifact-logo';
        logo.src = LOGO_SRC;
        logo.alt = 'Dlightning';
        logo.crossOrigin = 'anonymous';
        var toolName = document.createElement('div');
        toolName.className = 'dl-artifact-toolname';
        toolName.textContent = CFG.title;
        header.appendChild(logo);
        header.appendChild(toolName);

        var body = document.createElement('div');
        body.className = 'dl-artifact-body';
        var clone = container.cloneNode(true);
        clone.classList.add('dl-clone');
        clone.classList.remove('hidden');
        clone.removeAttribute('id'); // avoid id collisions; keep descendant styling intact
        clone.style.display = 'block';
        clone.style.margin = '0';
        clone.style.maxWidth = 'none';
        clone.style.width = '100%';
        // strip things that don't belong in a keepsake: our own UI, promo/CTA
        // banners, action buttons (Start Over, Next/Back, retake), and opt-outs
        Array.prototype.forEach.call(
            clone.querySelectorAll(
                '.dl-download-bar,[data-dl-ignore],[data-dl-omit],' +
                '.featureBgImg,.cta-box,.builder-banner,.button-group,button'
            ),
            function (n) { n.remove(); }
        );
        // drop link/CTA wrappers left empty after their button was removed
        Array.prototype.forEach.call(clone.querySelectorAll('a'), function (a) {
            if (!a.textContent.trim() && !a.querySelector('img')) a.remove();
        });
        body.appendChild(clone);

        var footer = document.createElement('div');
        footer.className = 'dl-artifact-footer';
        var fMain = document.createElement('div');
        fMain.className = 'dl-artifact-footer-main';
        fMain.textContent = SITE;
        var fSub = document.createElement('div');
        fSub.className = 'dl-artifact-footer-sub';
        fSub.textContent = TAGLINE + '  ·  ' + CONTACT;
        footer.appendChild(fMain);
        footer.appendChild(fSub);

        artifact.appendChild(header);
        artifact.appendChild(body);
        artifact.appendChild(footer);
        document.body.appendChild(artifact);
        return { artifact: artifact, logo: logo };
    }

    function whenLogoReady(img) {
        if (img.complete && img.naturalWidth) return Promise.resolve();
        return new Promise(function (resolve) {
            img.onload = resolve;
            img.onerror = resolve; // render anyway rather than hang
        });
    }

    /* ---------- render to canvas ---------- */
    function renderCanvas(container) {
        injectStyles();
        var built = buildArtifact(container);
        return whenLogoReady(built.logo)
            .then(function () { return loadScript(HTML2CANVAS_SRC); })
            .then(function () {
                return window.html2canvas(built.artifact, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true,
                    logging: false
                });
            })
            .then(function (canvas) {
                built.artifact.remove();
                return canvas;
            })
            .catch(function (err) {
                if (built.artifact.parentNode) built.artifact.remove();
                throw err;
            });
    }

    /* ---------- save helpers ---------- */
    function savePNG(container) {
        return renderCanvas(container).then(function (canvas) {
            return new Promise(function (resolve) {
                canvas.toBlob(function (blob) {
                    triggerDownload(URL.createObjectURL(blob), CFG.filename + '.png', true);
                    resolve();
                }, 'image/png');
            });
        });
    }

    function savePDF(container) {
        return renderCanvas(container)
            .then(function (canvas) {
                return loadScript(JSPDF_SRC).then(function () { return canvas; });
            })
            .then(function (canvas) {
                var jsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
                var w = canvas.width / 2, h = canvas.height / 2; // undo scale:2 for sane pt size
                var pdf = new jsPDF({
                    orientation: h >= w ? 'portrait' : 'landscape',
                    unit: 'pt',
                    format: [w, h]
                });
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);
                pdf.save(CFG.filename + '.pdf');
            });
    }

    function triggerDownload(href, name, revoke) {
        var a = document.createElement('a');
        a.href = href;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        if (revoke) setTimeout(function () { URL.revokeObjectURL(href); }, 4000);
    }

    /* ---------- button wiring ---------- */
    function makeButton(cls, ico, label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'dl-btn ' + cls;
        b.innerHTML =
            '<span class="dl-spin"></span>' +
            '<i class="fas ' + ico + ' dl-ico"></i>' +
            '<span>' + label + '</span>';
        return b;
    }

    function runWithSpinner(btn, fn) {
        if (btn.disabled) return;
        var bar = btn.closest('.dl-download-bar');
        var all = bar ? bar.querySelectorAll('.dl-btn') : [btn];
        Array.prototype.forEach.call(all, function (x) { x.disabled = true; });
        btn.classList.add('is-loading');
        Promise.resolve()
            .then(fn)
            .catch(function (err) {
                console.error('[dl-download]', err);
                alert('Sorry — we couldn’t generate the download. Please try again.');
            })
            .then(function () {
                btn.classList.remove('is-loading');
                Array.prototype.forEach.call(all, function (x) { x.disabled = false; });
            });
    }

    var bar = null;
    function buildBar(container) {
        if (bar) return bar;
        bar = document.createElement('div');
        bar.className = 'dl-download-bar';
        bar.setAttribute('data-dl-ignore', '');
        var label = document.createElement('span');
        label.className = 'dl-download-label';
        label.textContent = 'Save your results';
        var pdfBtn = makeButton('dl-btn-pdf', 'fa-file-pdf', 'Download PDF');
        var pngBtn = makeButton('dl-btn-png', 'fa-image', 'Download PNG');
        pdfBtn.addEventListener('click', function () { runWithSpinner(pdfBtn, function () { return savePDF(container); }); });
        pngBtn.addEventListener('click', function () { runWithSpinner(pngBtn, function () { return savePNG(container); }); });
        bar.appendChild(label);
        bar.appendChild(pdfBtn);
        bar.appendChild(pngBtn);

        var anchor = CFG.insertAfter ? document.querySelector(CFG.insertAfter) : container;
        if (anchor && anchor.parentNode) {
            anchor.parentNode.insertBefore(bar, anchor.nextSibling);
        } else {
            container.appendChild(bar);
        }
        return bar;
    }

    /* ---------- readiness detection ---------- */
    function isReady(el) {
        if (!el) return false;
        var visible = el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
        if (!visible) return false;
        return (el.innerText || '').trim().length > 15;
    }

    function sync() {
        var container = document.querySelector(CFG.container);
        if (!container) return;
        var ready = isReady(container);
        if (ready) buildBar(container);
        if (bar) bar.style.display = ready ? 'flex' : 'none';
    }

    function start() {
        var container = document.querySelector(CFG.container);
        if (!container) {
            // container may be injected later; retry briefly
            var tries = 0;
            var iv = setInterval(function () {
                if (document.querySelector(CFG.container) || ++tries > 40) {
                    clearInterval(iv);
                    if (document.querySelector(CFG.container)) start();
                }
            }, 250);
            return;
        }
        injectStyles();
        sync();
        var mo = new MutationObserver(sync);
        mo.observe(container, { attributes: true, childList: true, subtree: true, characterData: true });
        // also catch parent-driven class/display toggles
        if (container.parentNode) {
            mo.observe(container.parentNode, { attributes: true, attributeFilter: ['class', 'style'] });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
