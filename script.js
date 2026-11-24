// AL LABIB Portfolio — Premium Interactions
document.addEventListener("DOMContentLoaded", () => {
  const refreshIcons = () => window.lucide && lucide.createIcons();
  const body = document.body;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const setMenu = (open) => {
    navLinks.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
    refreshIcons();
  };
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
    document.querySelectorAll(".nav-link").forEach((l) => l.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  }

  // Theme (default: dark)
  const themeToggle = document.getElementById("themeToggle");
  body.classList.toggle("dark-mode", localStorage.getItem("portfolio-theme") !== "light");
  const updateThemeIcon = () => {
    const dark = body.classList.contains("dark-mode");
    themeToggle.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}"></i>`;
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.title = dark ? "Light Mode" : "Dark Mode";
    refreshIcons();
  };
  updateThemeIcon();
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem("portfolio-theme", body.classList.contains("dark-mode") ? "dark" : "light");
    updateThemeIcon();
  });

  // Scroll progress bar
  const bar = Object.assign(document.createElement("div"), { className: "progress" });
  body.prepend(bar);
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100 + "%";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Cursor glow + card spotlight + profile tilt (desktop only)
  if (fine) {
    const glow = Object.assign(document.createElement("div"), { className: "cursor-glow" });
    body.prepend(glow);
    const cards = ".about-note,.fact-card,.skill-card,.project-card,.experience-card,.activity-card,.more-card,.contact-form";
    addEventListener("pointermove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      const card = e.target.closest?.(cards);
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      }
    }, { passive: true });

    const frame = document.querySelector(".profile-frame");
    const visual = document.querySelector(".hero-visual");
    if (frame && visual) {
      visual.addEventListener("pointermove", (e) => {
        const r = visual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        frame.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      visual.addEventListener("pointerleave", () => (frame.style.transform = ""));
    }
  }

  // Reveal on scroll (with small stagger inside grids)
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const sibs = [...en.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
        en.target.style.transitionDelay = Math.min(sibs.indexOf(en.target), 5) * 80 + "ms";
        en.target.classList.add("visible");
        obs.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("visible"));

  // Active nav
  const navItems = document.querySelectorAll(".nav-link");
  if ("IntersectionObserver" in window) {
    const no = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting)
          navItems.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${en.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => no.observe(s));
  }

  // Contact form → mailto
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (n) => form.elements.namedItem(n)?.value.trim();
      const [name, email, message] = [v("name"), v("email"), v("message")];
      if (!name || !email || !message) return alert("Please fill in all fields.");
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const text = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      location.href = `mailto:mdlabib122lim@gmail.com?subject=${subject}&body=${text}`;
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  refreshIcons();
});