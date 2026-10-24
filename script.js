/* =========================================
   1. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    // Close the mobile menu when a navigation link is clicked.
    navItems.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-label", "Open navigation");
        });
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
        const clickedInsideMenu = navLinks.contains(event.target);
        const clickedMenuButton = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedMenuButton) {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        }
    });

    // Close the menu when switching back to desktop width.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        }
    });
}


/* =========================================
   2. DARK AND LIGHT THEME TOGGLE
========================================= */

const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function updateThemeButton() {
    if (!themeToggle) return;

    const isLightTheme = body.classList.contains("light-theme");

    themeToggle.textContent = isLightTheme ? "☀" : "☾";

    themeToggle.setAttribute(
        "aria-label",
        isLightTheme
            ? "Switch to dark theme"
            : "Switch to light theme"
    );

    themeToggle.setAttribute(
        "title",
        isLightTheme ? "Switch to dark theme" : "Switch to light theme"
    );
}

// Restore the previously selected theme.
// The default theme is dark olive green.
try {
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        body.classList.add("light-theme");
    } else {
        body.classList.remove("light-theme");
    }
} catch (error) {
    // The site still works if browser storage is unavailable.
}

updateThemeButton();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("light-theme");

        const selectedTheme = body.classList.contains("light-theme")
            ? "light"
            : "dark";

        try {
            localStorage.setItem("portfolio-theme", selectedTheme);
        } catch (error) {
            // Theme switching still works for the current page.
        }

        updateThemeButton();
    });
}


/* =========================================
   3. TYPING ANIMATION
========================================= */

const typingText = document.getElementById("typingText");

if (typingText) {
    const roles = [
        "Software Developer",
        "Web Developer",
        "Problem Solver",
        "Tech Enthusiast"
    ];

    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = true;

    // Begin by showing the existing text, then start cycling.
    typingText.textContent = roles[0];

    function typeRole() {
        const currentRole = roles[roleIndex];

        if (deleting) {
            characterIndex--;

            typingText.textContent = currentRole.substring(
                0,
                Math.max(0, characterIndex)
            );

            if (characterIndex <= 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;

                setTimeout(typeRole, 350);
                return;
            }

            setTimeout(typeRole, 45);
        } else {
            const nextRole = roles[roleIndex];

            characterIndex++;

            typingText.textContent = nextRole.substring(
                0,
                characterIndex
            );

            if (characterIndex >= nextRole.length) {
                deleting = true;

                setTimeout(typeRole, 1600);
                return;
            }

            setTimeout(typeRole, 85);
        }
    }

    // Allow the initial role to remain visible briefly.
    setTimeout(typeRole, 1800);
}


/* =========================================
   4. SCROLL REVEAL ANIMATIONS
========================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    // Fallback for browsers without IntersectionObserver.
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}


/* =========================================
   5. ACTIVE NAVIGATION ON SCROLL
========================================= */

const pageSections = document.querySelectorAll("main section[id]");

function updateActiveNavigation() {
    const marker = window.scrollY + 150;
    let currentSection = "home";

    pageSections.forEach((section) => {
        if (marker >= section.offsetTop) {
            currentSection = section.id;
        }
    });

    navItems.forEach((link) => {
        const isActive =
            link.getAttribute("href") === `#${currentSection}`;

        link.classList.toggle("active", isActive);
    });
}

window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
});

updateActiveNavigation();


/* =========================================
   6. PROJECT FILTER BUTTONS
========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter || "all";

        // Update the selected filter button.
        filterButtons.forEach((filterButton) => {
            filterButton.classList.remove("active");
            filterButton.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        // Show only matching projects.
        projectCards.forEach((card) => {
            const category = card.dataset.category || "all";

            const shouldShow =
                selectedFilter === "all" ||
                category === selectedFilter;

            card.hidden = !shouldShow;

            if (shouldShow) {
                card.classList.add("visible");
            }
        });
    });

    button.setAttribute(
        "aria-pressed",
        button.classList.contains("active") ? "true" : "false"
    );
});


/* =========================================
   7. BACK TO TOP BUTTON
========================================= */

const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 400) {
        backToTop.classList.add("visible");
    } else {
        backToTop.classList.remove("visible");
    }
}

window.addEventListener("scroll", updateBackToTop, {
    passive: true
});

updateBackToTop();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================================
   8. AUTOMATIC FOOTER YEAR
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================================
   9. IMAGE FALLBACK
========================================= */

const profilePhoto = document.querySelector(".profile-photo");

if (profilePhoto) {
    profilePhoto.addEventListener("error", () => {
        profilePhoto.style.display = "none";

        const avatar = profilePhoto.closest(".avatar");

        if (avatar && !avatar.querySelector(".photo-fallback")) {
            const fallback = document.createElement("span");

            fallback.className = "photo-fallback";
            fallback.textContent = "AN";
            fallback.setAttribute("aria-label", "Profile initials");

            fallback.style.color = "var(--primary)";
            fallback.style.fontFamily = "var(--font-heading)";
            fallback.style.fontSize = "2.5rem";
            fallback.style.fontWeight = "700";

            avatar.appendChild(fallback);
        }
    });
}