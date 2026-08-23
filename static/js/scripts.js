document.addEventListener("DOMContentLoaded", () => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
    const orbs = Array.from(document.querySelectorAll("[data-orb]"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // THEME: system + toggle + persistence
    const root = document.documentElement;
    const themeBtn = document.querySelector("[data-theme-toggle]");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (t) => {
        if (t) {
            root.setAttribute("data-theme", t);
            try { localStorage.setItem("theme", t); } catch {}
            if (themeBtn) themeBtn.setAttribute("aria-pressed", t === "light" ? "true" : "false");
        }
    };
    const initTheme = () => {
        let t = null;
        try { t = localStorage.getItem("theme"); } catch {}
        if (!t) t = systemDark.matches ? "dark" : "light";
        applyTheme(t);
    };
    initTheme();
    systemDark.addEventListener?.("change", () => {
        const t = root.getAttribute("data-theme");
        // Only follow system if user hasn’t explicitly chosen
        if (!localStorage.getItem("theme")) applyTheme(systemDark.matches ? "dark" : "light");
    });
    themeBtn?.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        applyTheme(next);
    });

    const activateNavigation = () => {
        const offset = window.scrollY + 160;
        let currentSection = sections[0]?.id;

        sections.forEach(section => {
            if (offset >= section.offsetTop) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            const hash = link.getAttribute("href");
            const targetId = hash ? hash.replace("#", "") : null;
            const isActive = targetId && targetId === currentSection;
            link.classList.toggle("active", !!isActive);
            // Accessibility hint
            if (isActive) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
    };

    activateNavigation();
    window.addEventListener("scroll", activateNavigation, { passive: true });

    // Pointer-tilt on cards
    function setupTilt() {
        const tiltEls = document.querySelectorAll(".project-card, .experience-card");
        tiltEls.forEach(el => {
            el.classList.add("tilt");
            const max = 8; // degrees
            function onMove(e) {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                el.style.setProperty("--tiltY", `${x * max}deg`);
                el.style.setProperty("--tiltX", `${-y * max}deg`);
            }
            function onLeave() {
                el.style.setProperty("--tiltX", "0deg");
                el.style.setProperty("--tiltY", "0deg");
            }
            el.addEventListener("pointermove", onMove);
            el.addEventListener("pointerleave", onLeave);
        });
    }
    if (!prefersReducedMotion) setupTilt();

    // Reveal on scroll
    function setupReveal() {
        const items = document.querySelectorAll(".reveal:not(.revealed)");
        if (!items.length) return;
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add("revealed");
                    obs.unobserve(e.target);
                }
            });
        }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
        items.forEach(i => io.observe(i));
    }
    setupReveal();

    if (!prefersReducedMotion && orbs.length) {
        const moveOrbs = event => {
            const intensity = 18;
            const xRatio = (event.clientX / window.innerWidth) - 0.5;
            const yRatio = (event.clientY / window.innerHeight) - 0.5;

            orbs.forEach((orb, index) => {
                const depth = (index + 1) / orbs.length;
                const translateX = xRatio * intensity * (1 + depth);
                const translateY = yRatio * intensity * (1 + depth);
                orb.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
            });
        };

        window.addEventListener("mousemove", moveOrbs, { passive: true });
    }
});
