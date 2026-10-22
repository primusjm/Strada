/* Reveals .titolo sections as they scroll into view, staggers their grids and draws zigzags when they appear.
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

  function watch(items, className, options) {
    var observer = new IntersectionObserver(function (entries) {
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

  /* Safety net: never leave content hidden if the observer does not fire. */
  setTimeout(showAll, 4000);
})();
