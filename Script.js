const countdown = document.querySelector(".countdown");

if (countdown) {
  const eventDate = new Date(countdown.dataset.eventDate);
  const units = {
    days: countdown.querySelector('[data-unit="days"] [data-value]'),
    hours: countdown.querySelector('[data-unit="hours"] [data-value]'),
    minutes: countdown.querySelector('[data-unit="minutes"] [data-value]'),
    seconds: countdown.querySelector('[data-unit="seconds"] [data-value]'),
  };

  const previousValues = {};

  const setUnit = (unit, value) => {
    const node = units[unit];

    if (!node || previousValues[unit] === value) {
      return;
    }

    previousValues[unit] = value;
    node.textContent = value;

    const item = node.closest(".countdown-item");
    item.classList.remove("is-ticking");
    void item.offsetWidth;
    item.classList.add("is-ticking");
  };

  const updateCountdown = () => {
    const distance = Math.max(0, eventDate - new Date());
    const totalSeconds = Math.floor(distance / 1000);

    setUnit("days", Math.floor(totalSeconds / 86400));
    setUnit("hours", Math.floor((totalSeconds % 86400) / 3600));
    setUnit("minutes", Math.floor((totalSeconds % 3600) / 60));
    setUnit("seconds", totalSeconds % 60);
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  window.setInterval(() => {
    ["days", "hours"].forEach((unit) => {
      const item = units[unit]?.closest(".countdown-item");

      if (!item) {
        return;
      }

      item.classList.remove("is-ticking");
      void item.offsetWidth;
      item.classList.add("is-ticking");
    });
  }, 4500);
}

const menuToggle = document.querySelector(".menu-toggle");
const mainMenu = document.querySelector(".main-menu");
const menuLinks = document.querySelectorAll(".main-menu .nav-links a");
const experienceTrigger = document.querySelector(".experience-trigger");
const navExperience = document.querySelector(".nav-experience");
const experienceMenuToggle = document.querySelector(".experience-menu-toggle");
let setMobileMenuOpen = () => {};

if (menuToggle && mainMenu) {
  const setMenuOpen = (isOpen) => {
    menuToggle.classList.toggle("is-open", isOpen);
    mainMenu.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  setMobileMenuOpen = setMenuOpen;

  menuToggle.addEventListener("click", () => {
    const isOpen = !mainMenu.classList.contains("is-open");
    setMenuOpen(isOpen);

    if (isOpen && menuLinks.length > 0) {
      menuLinks.forEach((link) => link.classList.remove("is-active"));
      menuLinks[0].classList.add("is-active");
    }
  });

  menuLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      menuLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
    });

    link.addEventListener("click", () => setMenuOpen(false));
  });
}

const setExperienceMenuOpen = (isOpen) => {
  if (!navExperience || !experienceMenuToggle) {
    return;
  }

  navExperience.classList.toggle("is-open", isOpen);
  experienceMenuToggle.setAttribute("aria-expanded", String(isOpen));
};

if (experienceTrigger && navExperience) {
  experienceTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (window.matchMedia("(max-width: 1100px)").matches) {
      setMobileMenuOpen(true);
    }

    setExperienceMenuOpen(true);
  });
}

if (experienceMenuToggle && navExperience) {
  experienceMenuToggle.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 1100px)").matches) {
      event.preventDefault();
      setExperienceMenuOpen(!navExperience.classList.contains("is-open"));
    }
  });

  document.addEventListener("click", (event) => {
    if (!navExperience.contains(event.target) && event.target !== experienceTrigger) {
      setExperienceMenuOpen(false);
    }
  });
}

const carouselTrack = document.querySelector(".expo-carousel-track");
const carouselPrev = document.querySelector("[data-carousel-prev]");
const carouselNext = document.querySelector("[data-carousel-next]");

if (carouselTrack && carouselPrev && carouselNext) {
  let carouselIndex = 0;

  const getVisibleCount = () => (window.matchMedia("(max-width: 1100px)").matches ? 1 : 3);

  const updateCarousel = () => {
    const cards = [...carouselTrack.children];
    const firstCard = cards[0];

    if (!firstCard) {
      return;
    }

    const gap = parseFloat(getComputedStyle(carouselTrack).columnGap || "0");
    const step = firstCard.getBoundingClientRect().width + gap;
    const maxIndex = Math.max(0, cards.length - getVisibleCount());
    carouselIndex = Math.min(Math.max(carouselIndex, 0), maxIndex);
    carouselTrack.style.transform = `translateX(${-carouselIndex * step}px)`;
  };

  carouselPrev.addEventListener("click", () => {
    const maxIndex = Math.max(0, carouselTrack.children.length - getVisibleCount());
    carouselIndex = carouselIndex === 0 ? maxIndex : carouselIndex - 1;
    updateCarousel();
  });

  carouselNext.addEventListener("click", () => {
    const maxIndex = Math.max(0, carouselTrack.children.length - getVisibleCount());
    carouselIndex = carouselIndex === maxIndex ? 0 : carouselIndex + 1;
    updateCarousel();
  });

  window.addEventListener("resize", updateCarousel);
  updateCarousel();
}
