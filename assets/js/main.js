/**
 * Template Name: MyResume
 * Updated: Sep 18 2023 with Bootstrap v5.3.2
 * Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: "smooth",
    });
  };

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("body").classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let body = select("body");
        if (body.classList.contains("mobile-nav-active")) {
          body.classList.remove("mobile-nav-active");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Hero type effect
   */
  const typed = select(".typed");
  if (typed) {
    let typed_strings = typed.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select(".skills-content");
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: "80%",
      handler: function (direction) {
        let progress = select(".progress .progress-bar", true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      // Define filter categories
      const filterCategories = [
        { id: "*", class: "" },
        { id: ".filter-3d", class: "filter-3d" },
        { id: ".filter-card", class: "filter-card" },
        { id: ".filter-cover", class: "filter-cover" },
        { id: ".filter-photos", class: "filter-photos" },
        { id: ".filter-tshirt", class: "filter-tshirt" },
        { id: ".filter-website", class: "filter-website" },
      ];

      // Function to create and setup badge
      const setupBadge = (element) => {
        let badge = element.querySelector(".badge");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "badge";
          badge.style.display = "none"; // Hide badge by default
          element.appendChild(badge);
        }
        return badge;
      };

      // Function to get item count for a filter
      const getFilterCount = (filterClass) => {
        return filterClass === "*"
          ? select(".portfolio-item", true).length
          : select(`.portfolio-item${filterClass}`, true).length;
      };

      // Function to handle badge display
      const handleBadgeDisplay = (element, filterClass) => {
        const badge = setupBadge(element);

        // Show badge on hover
        element.addEventListener("mouseenter", () => {
          const count = getFilterCount(filterClass);
          badge.textContent = count;
          badge.style.display = "inline-block";
          badge.classList.add("animate__animated", "animate__bounceIn");
        });

        // Hide badge on mouse leave
        element.addEventListener("mouseleave", () => {
          if (!element.classList.contains("filter-active")) {
            badge.style.display = "none";
            badge.classList.remove("animate__bounceIn");
          }
        });

        // Initialize badge count (but keep it hidden)
        const count = getFilterCount(filterClass);
        badge.textContent = count;
      };

      // Initialize all filters
      filterCategories.forEach(({ id, class: filterClass }) => {
        const filterElement = select(
          `#portfolio-flters li[data-filter="${id}"]`
        );
        if (filterElement) {
          handleBadgeDisplay(filterElement, id);
        }
      });

      // Single click handler for filter changes
      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();

          // Update filter active state
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
            // Hide badges on all inactive filters
            const badge = el.querySelector(".badge");
            if (badge) {
              badge.style.display = "none";
              badge.classList.remove("animate__bounceIn");
            }
          });

          this.classList.add("filter-active");

          // Show badge for active filter
          const filterValue = this.getAttribute("data-filter");
          const badge = setupBadge(this);
          const count = getFilterCount(filterValue);
          badge.textContent = count;
          badge.style.display = "inline-block";
          badge.classList.add("animate__animated", "animate__bounceIn");

          // Arrange items
          portfolioIsotope.arrange({
            filter: filterValue,
          });

          portfolioIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  /**
   * Initiate portfolio details lightbox
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: ".portfolio-details-lightbox",
    width: "90%",
    height: "90vh",
  });

  /**
   * Portfolio details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Testimonials slider
   */
  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();
})();
