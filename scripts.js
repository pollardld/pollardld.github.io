document.addEventListener("DOMContentLoaded", function () {
    // Highlight active nav link on scroll
    const sections = document.querySelectorAll("section");
    const navLi = document.querySelectorAll("nav ul li a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute("id");
            }
        });
        navLi.forEach(a => {
            a.classList.remove("active");
            if (a.getAttribute("href") === "#" + current) {
                a.classList.add("active");
            }
        });
    });

    // Dynamically load experience data from JSON file
    fetch('resume_data.json')
        .then(response => response.json())
        .then(data => {
            const experienceSection = document.getElementById("experience");
            experienceSection.innerHTML = '<h2>Work Experience</h2>';
            data.experience.forEach(exp => {
                const div = document.createElement("div");
                div.className = "experience-item";
                div.innerHTML = `<h3>${exp.company}</h3>
                        <h4>${exp.role}</h4>
                        <p>${exp.date}</p>
                        <p>${exp.description}</p>`;
                experienceSection.appendChild(div);
            });
        })
        .catch(err => console.error("Error loading experience data: ", err));
});
