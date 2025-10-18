/**
 * attachIridescence(el, {follow = 'pointer'|'center'|HTMLElement, damping = 0.15})
 * Returns a cleanup function.
 */
function attachIridescence(el, opts = {}) {
    const follow = opts.follow ?? "pointer";
    const damping = opts.damping ?? 0.15;

    let targetX = 0.5,
        targetY = 0.4;
    let curX = targetX,
        curY = targetY;
    let raf;

    const setTarget = (x, y) => {
        targetX = x;
        targetY = y;
    };

    function onMove(e) {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setTarget(x, y);
    }

    function tick() {
        curX += (targetX - curX) * damping;
        curY += (targetY - curY) * damping;
        el.style.setProperty("--mx", `${Math.round(curX * 100)}%`);
        el.style.setProperty("--my", `${Math.round(curY * 100)}%`);
        raf = requestAnimationFrame(tick);
    }

    // Set initial
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "40%");

    // Event wiring
    let targetEl = null;
    if (follow === "pointer") {
        targetEl = el;
        el.addEventListener("pointermove", onMove);
    } else if (follow === "center") {
        setTarget(0.5, 0.5);
    } else if (follow instanceof HTMLElement) {
        targetEl = follow;
        targetEl.addEventListener("pointermove", onMove);
    }

    raf = requestAnimationFrame(tick);

    // Accessibility: pause on reduced motion
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const handleMQ = () => {
        if (mq.matches) {
            cancelAnimationFrame(raf);
            raf = null;
        } else if (!raf) {
            raf = requestAnimationFrame(tick);
        }
    };
    mq.addEventListener?.("change", handleMQ);
    handleMQ();

    // Cleanup
    return () => {
        if (targetEl) targetEl.removeEventListener("pointermove", onMove);
        if (raf) cancelAnimationFrame(raf);
        mq.removeEventListener?.("change", handleMQ);
    };
}

const cleanup = attachIridescence(document.getElementById("top-nav"), {
    follow: "pointer", // or 'center' or another element
    damping: 0.1 // lower = snappier, higher = floaty
});