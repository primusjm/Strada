/* Accessibility toolbar: text size and display options, saved per device. */
(function () {
  var KEY = "rlc-a11y";
  var root = document.documentElement;
  var SIZES = ["100%", "112%", "125%", "150%"];
  var TOGGLES = ["contrast", "underline", "spacing", "bold", "font", "still"];
  var prefs = { text: 0 };

  try {
    prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || "{}"));
  } catch (e) {}

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch (e) {}
  }

  function render() {
    var text = Math.max(0, Math.min(3, Number(prefs.text) || 0));
    if (text) root.setAttribute("data-text", text);
    else root.removeAttribute("data-text");

    TOGGLES.forEach(function (name) {
      root.classList.toggle("a11y-" + name, !!prefs[name]);
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-a11y-toggle]"), function (button) {
      button.setAttribute("aria-pressed", prefs[button.dataset.a11yToggle] ? "true" : "false");
    });

    var status = document.querySelector("[data-a11y-status]");
    if (status) status.textContent = (status.dataset.label || "Text size") + " " + SIZES[text];
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-a11y-text], [data-a11y-toggle], [data-a11y-reset]");
    if (!target) return;

    if (target.hasAttribute("data-a11y-reset")) {
      prefs = { text: 0 };
    } else if (target.hasAttribute("data-a11y-toggle")) {
      var name = target.dataset.a11yToggle;
      prefs[name] = !prefs[name];
    } else {
      var step = Number(target.dataset.a11yText);
      prefs.text = step === 0 ? 0 : Math.max(0, Math.min(3, (Number(prefs.text) || 0) + step));
    }
    save();
    render();
  });

  /* Panel: non-modal, so the page behind stays scrollable and usable. */
  var dialog = document.getElementById("a11y-dialog");
  var opener = null;

  function openPanel(trigger) {
    opener = trigger;
    dialog.show();
    var first = dialog.querySelector("[data-a11y-close]");
    if (first) first.focus();
  }

  function closePanel(keepFocus) {
    dialog.close();
    if (opener && !keepFocus) opener.focus();
  }

  if (dialog && typeof dialog.show === "function") {
    document.addEventListener("click", function (event) {
      var open = event.target.closest("[data-a11y-open]");
      if (open) return dialog.open ? closePanel() : openPanel(open);
      if (event.target.closest("[data-a11y-close]")) return closePanel();
      /* A click anywhere outside the panel closes it, leaving focus where the click landed. */
      if (dialog.open && !dialog.contains(event.target)) closePanel(true);
    });
    /* Tabbing out of the panel closes it, so keyboard users are not left with it hanging open. */
    dialog.addEventListener("focusout", function (event) {
      var next = event.relatedTarget;
      if (dialog.open && next && !dialog.contains(next) && !next.closest("[data-a11y-open]")) closePanel(true);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && dialog.open) closePanel();
    });
  }

  render();
})();
