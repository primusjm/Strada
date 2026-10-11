/* Header: tucks away while scrolling down, returns on scroll up, and gains a hairline once the page moves. */
(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("menu-toggle");
  var last = window.scrollY;
  var ticking = false;

  function update() {
    var y = window.scrollY;
    var menuOpen = toggle && toggle.getAttribute("aria-expanded") === "true";
    var hasFocus = header && header.contains(document.activeElement);

    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
      if (y <= 0 || y < last - 4 || menuOpen || hasFocus) {
        header.classList.remove("is-hidden");
      } else if (y > last + 4 && y > 160) {
        header.classList.add("is-hidden");
      }
    }
    last = y;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
})();

/* Scroll to top buttons (only present on some layouts) */
(function () {
  var buttons = [
    document.getElementById("scrollToTop"),
    document.getElementById("scrollToTopMobile")
  ].filter(Boolean);

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  var desktopButton = document.getElementById("scrollToTop");
  if (desktopButton) {
    window.addEventListener("scroll", function () {
      var show = window.scrollY > 200;
      desktopButton.classList.toggle("hidden", !show);
      desktopButton.classList.toggle("flex", show);
    }, { passive: true });
  }
})();
