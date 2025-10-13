document.addEventListener("DOMContentLoaded", () => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
    const experienceGrid = document.querySelector("[data-experience-grid]");
    const orbs = Array.from(document.querySelectorAll("[data-orb]"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
            const shouldHighlight = targetId && targetId === currentSection;

            if (shouldHighlight) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };

    activateNavigation();
    window.addEventListener("scroll", activateNavigation, { passive: true });

    if (experienceGrid) {
        fetch("resume_data.json")
            .then(response => response.json())
            .then(data => {
                const experiences = Array.isArray(data.experience) ? data.experience : [];

                if (!experiences.length) {
                    experienceGrid.innerHTML = "<p class=\"loading-text\">Experience information is coming soon.</p>";
                    return;
                }

                experienceGrid.innerHTML = "";

                experiences.forEach(exp => {
                    const card = document.createElement("article");
                    card.className = "experience-card";
                    card.innerHTML = `
                        <h3>${exp.role ?? "Role"}</h3>
                        <h4>${exp.company ?? ""}</h4>
                        <p class="experience-date">${exp.date ?? ""}</p>
                        <p>${exp.description ?? ""}</p>
                    `;
                    experienceGrid.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Error loading experience data", error);
                experienceGrid.innerHTML = "<p class=\"loading-text\">Unable to load experience at the moment.</p>";
            });
    }

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
