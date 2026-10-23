/* Reveals .titolo sections as they scroll into view, staggers their grids and draws zigzags when they appear.
   Also fades photos in as they load and pauses the values orbit while it is off screen or hovered.
   Hidden states only apply when the "js" class is set on <html>. */
(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll(".titolo"));
  var zigzags = Array.prototype.slice.call(document.querySelectorAll(".zigzag"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("a11y-still");

  /* Give grid and stagger children an index so CSS can offset their entrance. */
  sections.forEach(function (section) {
    section.querySelectorAll(".grid, .stagger").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty("--i", Math.min(i, 7));
      });
    });
  });

  function showAll() {
    sections.forEach(function (el) { el.classList.add("is-visible"); });
    zigzags.forEach(function (el) { el.classList.add("is-drawn"); });
  }

  if (reduce || !("IntersectionObserver" in window)) return showAll();

  /* Sections already on screen appear at once (no fade). The hiding styles only switch on here, after that
     decision, so nothing is hidden before this script has run. */
  var vh = window.innerHeight;
  sections.concat(zigzags).forEach(function (el) {
    var box = el.getBoundingClientRect();
    if (box.top < vh * 0.94 && box.bottom > 0) {
      el.classList.add(el.classList.contains("zigzag") ? "is-drawn" : "is-visible", "is-instant");
    }
  });
  document.documentElement.classList.add("js-reveal");

  var observerWorks = false;

  function watch(items, className, options) {
    var observer = new IntersectionObserver(function (entries) {
      observerWorks = true;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(className);
        observer.unobserve(entry.target);
      });
    }, options);
    items.forEach(function (el) { observer.observe(el); });
  }

  watch(sections, "is-visible", { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
  /* The zigzag is tiny, so it waits until it is properly on screen. */
  watch(zigzags, "is-drawn", { threshold: 1, rootMargin: "0px 0px -10% 0px" });

  /* Safety net: only if the observer never reports anything, so content cannot stay hidden.
     (Revealing everything on a timer would switch the scroll reveal off after a few seconds.) */
  setTimeout(function () { if (!observerWorks) showAll(); }, 4000);

  /* Photos that arrive after the page is shown sharpen in from a soft blur over their grey placeholder,
     instead of popping in. Photos already loaded are left alone, and nothing is hidden while waiting. */
  Array.prototype.forEach.call(document.querySelectorAll("img.ph"), function (img) {
    if (img.complete) return;
    img.addEventListener("load", function () {
      img.classList.add("is-fading-in");
      img.addEventListener("animationend", function () { img.classList.remove("is-fading-in"); }, { once: true });
    }, { once: true });
  });

  /* The values orbit only needs to turn while someone can see it. */
  var orbit = document.querySelector(".values-stage");
  if (orbit && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      orbit.classList.toggle("is-paused", !entries[entries.length - 1].isIntersecting);
    }).observe(orbit);
  }
})();
