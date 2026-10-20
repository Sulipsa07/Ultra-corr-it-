// Loading screen: the door frame draws itself while the page loads (00 → 100),
// then the doors swing open and the camera moves through into the site.
(function () {
    var root = document.documentElement;
    var intro = document.getElementById('intro');
    if (!intro) return;
    if (!root.classList.contains('intro')) { intro.remove(); return; }

    var stage = intro.querySelector('.intro-stage');
    var frame = intro.querySelector('.intro-frame rect');
    var count = intro.querySelector('.intro-count');
    var skip = intro.querySelector('.intro-skip');

    var MIN_MS = 2400;   // never finish faster than this, so the draw is visible
    var MAX_MS = 7000;   // never wait longer than this, even on a slow network
    var start = performance.now();
    var target = 10;     // how much of the page has actually loaded (0-100)
    var shown = 0;       // the number on screen
    var finished = false;

    function bump(value) { target = Math.max(target, value); }
    if (document.readyState !== 'loading') bump(45);
    else document.addEventListener('DOMContentLoaded', function () { bump(45); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { bump(70); });
    if (document.readyState === 'complete') bump(100);
    else window.addEventListener('load', function () { bump(100); });

    function render() {
        var v = Math.round(shown);
        count.textContent = v < 10 ? '0' + v : String(v);
        frame.style.strokeDashoffset = String(100 - shown);
    }

    var last = start;
    function tick(now) {
        if (finished) return;
        var elapsed = now - start;
        if (elapsed > MAX_MS) bump(100);
        var cap = Math.min(target, (elapsed / MIN_MS) * 100);
        // Time-based so the count speed is the same at any frame rate
        shown = Math.min(cap, shown + (now - last) * 0.07);
        last = now;
        render();
        if (shown >= 99.9) { shown = 100; render(); open(); return; }
        requestAnimationFrame(tick);
    }

    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    function done() {
        try { sessionStorage.setItem('ucIntroSeen', '1'); } catch (e) {}
        root.classList.remove('intro');
        intro.remove();
        document.dispatchEvent(new CustomEvent('uc:intro-done'));
    }

    function open() {
        if (finished) return;
        finished = true;
        intro.classList.add('complete');
        wait(350)
            .then(function () { intro.classList.add('lit'); return wait(300); })
            .then(function () { intro.classList.add('open'); return wait(950); })
            .then(function () {
                // Zoom through the doorway until its white light fills the screen
                var box = stage.getBoundingClientRect();
                var scale = Math.max(innerWidth / box.width, innerHeight / box.height) * 1.6;
                stage.style.transform = 'scale(' + scale.toFixed(2) + ')';
                intro.classList.add('leaving');
                return wait(800);
            })
            .then(function () { intro.classList.add('gone'); return wait(700); })
            .then(done);
    }

    skip.addEventListener('click', function () {
        finished = true;
        intro.classList.add('gone');
        wait(500).then(done);
    });

    render();
    requestAnimationFrame(tick);
})();
