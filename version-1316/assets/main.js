(function() {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function initMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function() {
      var opened = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    if (slides.length < 2) {
      return;
    }
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function setSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function() {
        setSlide(index + 1);
      }, 5600);
    }

    dots.forEach(function(dot, dotIndex) {
      dot.addEventListener("click", function() {
        setSlide(dotIndex);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function() {
        setSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function() {
        setSlide(index + 1);
        restart();
      });
    }

    restart();
  }

  function valueOf(selector) {
    var element = document.querySelector(selector);
    return element ? element.value.trim().toLowerCase() : "";
  }

  function initFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll(".searchable-grid, .movie-grid"));
    var inputs = Array.prototype.slice.call(document.querySelectorAll(".site-search, .filter-year, .filter-type, .filter-region"));
    if (!grids.length || !inputs.length) {
      return;
    }

    function apply() {
      var query = valueOf(".site-search");
      var year = valueOf(".filter-year");
      var type = valueOf(".filter-type");
      var region = valueOf(".filter-region");
      var visible = 0;

      grids.forEach(function(grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card, .rank-card"));
        cards.forEach(function(card) {
          var text = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-year") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-type") || "",
            card.getAttribute("data-genre") || "",
            card.getAttribute("data-tags") || "",
            card.textContent || ""
          ].join(" ").toLowerCase();
          var ok = true;
          if (query && text.indexOf(query) === -1) {
            ok = false;
          }
          if (year && String(card.getAttribute("data-year") || "").toLowerCase() !== year) {
            ok = false;
          }
          if (type && String(card.getAttribute("data-type") || "").toLowerCase() !== type) {
            ok = false;
          }
          if (region && String(card.getAttribute("data-region") || "").toLowerCase() !== region) {
            ok = false;
          }
          card.classList.toggle("is-filtered-out", !ok);
          if (ok) {
            visible += 1;
          }
        });
      });

      var empty = document.querySelector(".empty-message");
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    inputs.forEach(function(input) {
      input.addEventListener("input", apply);
      input.addEventListener("change", apply);
    });
  }

  ready(function() {
    initMenu();
    initHero();
    initFilters();
  });
})();
