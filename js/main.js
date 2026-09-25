(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = () => window.innerWidth >= 1100;

  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  const setMenuOpen = (open) => {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.toggle("is-open", open);
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  };

  const closeMenu = (restoreFocus) => {
    if (!mobileNav || !navToggle || !mobileNav.classList.contains("is-open")) return;
    setMenuOpen(false);
    if (restoreFocus) navToggle.focus();
  };

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = !mobileNav.classList.contains("is-open");
      setMenuOpen(open);
      if (open) {
        const first = mobileNav.querySelector("a");
        if (first) first.focus();
      }
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu(false));
    });
  }

  const markIn = (el) => el.classList.add("is-in");

  const prepareReveal = (el, delay) => {
    el.classList.add("reveal");
    if (delay) el.style.setProperty("--d", delay + "ms");
  };

  const staggerGroup = (nodes, step) => {
    const list = Array.from(nodes);
    const gap = reduceMotion ? 0 : step;
    list.forEach((el, index) => prepareReveal(el, Math.min(index, 7) * gap));
    return list;
  };

  const revealTargets = [];

  document.querySelectorAll(".hero-content > *, .hero-frame").forEach((el, index) => {
    prepareReveal(el, reduceMotion ? 0 : index * 90);
    revealTargets.push(el);
  });

  document.querySelectorAll(".section-head, .filter-bar, .custom-banner .container, .cta-banner .container").forEach((el) => {
    prepareReveal(el, 0);
    revealTargets.push(el);
  });

  revealTargets.push(
    ...staggerGroup(document.querySelectorAll(".collection-card"), 80),
    ...staggerGroup(document.querySelectorAll(".feature-block"), 70),
    ...staggerGroup(document.querySelectorAll(".product-card"), 70),
    ...staggerGroup(document.querySelectorAll(".process-step"), 90),
    ...staggerGroup(document.querySelectorAll(".belief-item"), 70),
    ...staggerGroup(document.querySelectorAll(".memory-wall figure"), 80),
    ...staggerGroup(document.querySelectorAll(".gallery-preview a, .gallery-item"), 60),
    ...staggerGroup(document.querySelectorAll(".vm-card"), 90),
    ...staggerGroup(document.querySelectorAll(".intro-visual, .split-media, .intro-grid > div, .split > div, .contact-grid > *"), 80)
  );

  document.querySelectorAll("[data-aos]").forEach((el) => {
    if (!el.classList.contains("reveal")) {
      const delay = Number(el.getAttribute("data-aos-delay") || 0);
      prepareReveal(el, reduceMotion ? 0 : delay);
      revealTargets.push(el);
    }
  });

  document.documentElement.classList.add("has-motion");

  if (reduceMotion) {
    revealTargets.forEach(markIn);
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          markIn(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => io.observe(el));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelectorAll(".hero-content .reveal, .hero-frame").forEach(markIn);
      });
    });
  }

  const process = document.querySelector(".process-track");
  if (process) {
    if (reduceMotion) {
      process.classList.add("is-active");
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) process.classList.add("is-active");
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(process);
    }
  }

  const parallaxLayers = [
    ...document.querySelectorAll(".hero-media, .page-hero img, .custom-banner img, .cta-banner img"),
  ];

  const updateParallax = () => {
    if (reduceMotion || !isDesktop()) {
      parallaxLayers.forEach((el) => {
        el.style.transform = "";
        el.classList.remove("parallax-layer");
      });
      return;
    }

    const view = window.innerHeight;
    parallaxLayers.forEach((el) => {
      const box = el.getBoundingClientRect();
      if (box.bottom < 0 || box.top > view) return;
      el.classList.add("parallax-layer");
      const progress = (box.top + box.height / 2 - view / 2) / view;
      const shift = Math.max(-22, Math.min(22, progress * -28));
      const scale = el.matches("img") ? " scale(1.04)" : "";
      el.style.transform = "translate3d(0, " + shift.toFixed(1) + "px, 0)" + scale;
    });
  };

  if (!reduceMotion) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", updateParallax, { passive: true });
    updateParallax();
  }

  const testimonialEl = document.querySelector(".testimonial-swiper");
  if (testimonialEl && typeof Swiper !== "undefined") {
    new Swiper(testimonialEl, {
      slidesPerView: 1,
      spaceBetween: 28,
      loop: !reduceMotion,
      speed: reduceMotion ? 0 : 800,
      autoplay: reduceMotion ? false : { delay: 6400, disableOnInteraction: false },
      pagination: { el: ".testimonial-pagination", clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    });
  }

  const filterButtons = document.querySelectorAll("[data-filter]");
  const filterItems = document.querySelectorAll("[data-category]");

  const applyFilter = (filter) => {
    filterButtons.forEach((btn) => {
      const active = btn.getAttribute("data-filter") === filter;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    let visible = 0;
    filterItems.forEach((item) => {
      const match = filter === "all" || item.getAttribute("data-category") === filter;
      item.classList.toggle("is-hidden", !match);
      item.classList.remove("is-entering");
      if (!match) return;
      if (!reduceMotion) {
        item.style.setProperty("--d", Math.min(visible, 7) * 50 + "ms");
        void item.offsetWidth;
        item.classList.add("is-entering");
      }
      visible += 1;
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
      window.setTimeout(() => bar.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }), 200);
    }
  }

  document.querySelectorAll("img").forEach((img) => {
    const skipLazy = img.closest(".hero-media, .page-hero, .hero, .lightbox") || img.id === "lightboxImage";
    if (skipLazy) {
      img.loading = "eager";
    } else if (!img.hasAttribute("loading")) {
      img.loading = "lazy";
    }
    img.decoding = "async";
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = lightbox ? lightbox.querySelector("[data-lightbox-close]") : null;
  let lightboxSource = null;

  const closeLightbox = () => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-open");
    if (lightboxImage) {
      lightboxImage.alt = "";
    }
    if (lightboxSource) {
      lightboxSource.focus();
      lightboxSource = null;
    }
  };

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      if (!lightbox || !lightboxImage) return;
      const caption = trigger.getAttribute("data-caption") || "";
      const innerImg = trigger.querySelector("img");
      lightboxImage.src = trigger.getAttribute("href") || trigger.dataset.full || trigger.src;
      lightboxImage.alt = (innerImg && innerImg.getAttribute("alt")) || caption || "Framed photograph";
      if (lightboxCaption) {
        lightboxCaption.textContent = caption;
      }
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("nav-open");
      lightboxSource = trigger;
      if (lightboxClose) lightboxClose.focus();
    });
  });

  if (lightbox) {
    lightbox.setAttribute("aria-hidden", lightbox.classList.contains("is-open") ? "false" : "true");
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.closest("[data-lightbox-close]")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (lightbox && lightbox.classList.contains("is-open")) {
        closeLightbox();
        return;
      }
      closeMenu(true);
      return;
    }

    if (event.key === "Tab" && lightbox && lightbox.classList.contains("is-open")) {
      event.preventDefault();
      if (lightboxClose) lightboxClose.focus();
    }
  });

  const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const phoneOk = (value) => value.replace(/\D/g, "").length >= 8;

  const markField = (field, invalid) => {
    field.classList.toggle("is-invalid", invalid);
    field.setAttribute("aria-invalid", String(invalid));
  };

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("input", (event) => {
      const field = event.target;
      if (field && field.matches("input, select, textarea")) {
        markField(field, false);
      }
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const required = contactForm.querySelectorAll("[required]");
      let valid = true;
      let firstInvalid = null;

      required.forEach((field) => {
        const value = String(field.value || "").trim();
        let invalid = !value;
        if (!invalid && field.type === "email") invalid = !emailOk(value);
        if (!invalid && field.type === "tel") invalid = !phoneOk(value);
        markField(field, invalid);
        if (invalid) {
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      contactForm.classList.add("is-sent");
      contactForm.reset();
    });
  }

  if (!document.querySelector(".wa-float")) {
    const wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href = "https://wa.me/918808801432";
    wa.target = "_blank";
    wa.rel = "noopener noreferrer";
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
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (target.id === "main") {
        target.focus({ preventScroll: true });
      }
    });
  });
})();
