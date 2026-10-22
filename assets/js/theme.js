/* Light and dark theme: follows the device until the visitor uses the toggle, then remembers their choice.
   The first paint is handled by the inline script in the page head; this keeps the toggle and later changes in sync. */
(function () {
  var KEY = "rlc-theme";
  var root = document.documentElement;
  var query = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-theme-toggle]"));

  function saved() {
    try {
      var value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : "";
    } catch (e) {
      return "";
    }
  }

  /* High contrast mode is a light-on-dark-text design, so it always uses the light theme. */
  function wanted() {
    if (root.classList.contains("a11y-contrast")) return "light";
    return saved() || (query && query.matches ? "dark" : "light");
  }

  function apply() {
    var theme = wanted();
    if (root.getAttribute("data-theme") !== theme) root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#171C26" : "#FAF8F6");
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch (e) {}
      root.classList.add("theme-fade");
      apply();
      window.setTimeout(function () { root.classList.remove("theme-fade"); }, 400);
    });
  });

  /* Follow the device when there is no saved choice. */
  if (query) {
    var onChange = function () { if (!saved()) apply(); };
    if (query.addEventListener) query.addEventListener("change", onChange);
    else if (query.addListener) query.addListener(onChange);
  }

  /* Switching high contrast on or off changes the theme too. */
  new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ["class"] });

  apply();
})();
