(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }

  const testimonialEl = document.querySelector(".testimonial-swiper");
  if (testimonialEl && typeof Swiper !== "undefined") {
    new Swiper(testimonialEl, {
      slidesPerView: 1,
      spaceBetween: 28,
      loop: true,
      speed: 700,
      autoplay: { delay: 5200, disableOnInteraction: false },
      pagination: { el: ".testimonial-pagination", clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    });
  }

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const animateCount = (el) => {
      const target = Number(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  const process = document.querySelector(".process-track");
  if (process) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) process.classList.add("is-active");
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(process);
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  const filterItems = document.querySelectorAll("[data-category]");

  const applyFilter = (filter) => {
    filterButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-filter") === filter);
    });

    filterItems.forEach((item) => {
      const match = filter === "all" || item.getAttribute("data-category") === filter;
      item.classList.toggle("is-hidden", !match);
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.getAttribute("data-filter")));
  });

  const hash = window.location.hash.replace("#", "");
  if (hash && document.querySelector(`[data-filter="${hash}"]`)) {
    applyFilter(hash);
    const bar = document.querySelector(".filter-bar");
    if (bar) {
      window.setTimeout(() => bar.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  }

  document.querySelectorAll("img").forEach((img, index) => {
    if (index > 0 && !img.hasAttribute("loading")) {
      img.loading = "lazy";
    }
    img.decoding = "async";
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = trigger.getAttribute("href") || trigger.dataset.full || trigger.src;
      if (lightboxCaption) {
        lightboxCaption.textContent = trigger.getAttribute("data-caption") || "";
      }
      lightbox.classList.add("is-open");
      document.body.classList.add("nav-open");
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.closest("[data-lightbox-close]")) {
        closeLightbox();
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const required = contactForm.querySelectorAll("[required]");
      let valid = true;

      required.forEach((field) => {
        const empty = !String(field.value || "").trim();
        field.classList.toggle("is-invalid", empty);
        if (empty) valid = false;
      });

      if (!valid) return;

      contactForm.classList.add("is-sent");
      contactForm.reset();
    });
  }

  if (!document.querySelector(".wa-float")) {
    const wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href = "https://wa.me/918808801432";
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "Chat on WhatsApp 88088 01432");
    wa.innerHTML = '<i class="bi bi-whatsapp"></i>';
    document.body.appendChild(wa);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
