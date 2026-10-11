/* Photo viewer for the gallery pages: keyboard, swipe and focus handling. */
(function () {
  var box = document.getElementById("lightbox");
  if (!box) return;

  var image = document.getElementById("lightbox-image");
  var count = document.getElementById("lightbox-count");
  var closeButton = box.querySelector("[data-lightbox-close]");
  var prevButton = box.querySelector("[data-lightbox-prev]");
  var nextButton = box.querySelector("[data-lightbox-next]");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var index = 0;
  var opener = null;
  var touchStartX = null;

  function show(i) {
    index = (i + triggers.length) % triggers.length;
    var trigger = triggers[index];
    var thumb = trigger.querySelector("img");
    image.src = trigger.getAttribute("data-lightbox");
    image.alt = thumb ? thumb.alt : "";
    count.textContent = index + 1 + " / " + triggers.length;
    /* Warm the cache for the next photo. */
    new Image().src = triggers[(index + 1) % triggers.length].getAttribute("data-lightbox");
  }

  function isOpen() {
    return !box.classList.contains("hidden");
  }

  function open(i, trigger) {
    opener = trigger;
    show(i);
    box.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function close() {
    box.classList.add("hidden");
    image.removeAttribute("src");
    document.body.style.overflow = "";
    if (opener) opener.focus();
  }

  triggers.forEach(function (trigger, i) {
    trigger.addEventListener("click", function () { open(i, trigger); });
  });

  closeButton.addEventListener("click", close);
  prevButton.addEventListener("click", function () { show(index - 1); });
  nextButton.addEventListener("click", function () { show(index + 1); });
  box.addEventListener("click", function (event) {
    if (event.target === box) close();
  });

  document.addEventListener("keydown", function (event) {
    if (!isOpen()) return;
    if (event.key === "Escape") return close();
    if (event.key === "ArrowLeft") return show(index - 1);
    if (event.key === "ArrowRight") return show(index + 1);
    if (event.key === "Tab") {
      /* Keep focus inside the dialog. */
      var stops = [prevButton, nextButton, closeButton];
      var at = stops.indexOf(document.activeElement);
      var next = event.shiftKey ? at - 1 : at + 1;
      event.preventDefault();
      stops[(next + stops.length) % stops.length].focus();
    }
  });

  box.addEventListener("touchstart", function (event) {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  box.addEventListener("touchend", function (event) {
    if (touchStartX === null) return;
    var dx = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
