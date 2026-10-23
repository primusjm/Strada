/* Warms the next page when someone points at a link or touches it, so the click feels instant.
   Browsers with speculation rules (see header.html) do this themselves; this covers the rest. */
(function () {
  if (window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")) return;
  var seen = {};
  var timer;

  function warm(event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    var url;
    try { url = new URL(link.href); } catch (e) { return; }
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    if (/^\/(admin|assets)\//.test(url.pathname) || seen[url.pathname]) return;
    seen[url.pathname] = true;
    fetch(url.href, { credentials: "same-origin", priority: "low" }).catch(function () {});
  }

  document.addEventListener("pointerover", function (event) {
    if (event.pointerType === "touch") return;
    clearTimeout(timer);
    timer = setTimeout(function () { warm(event); }, 65);
  }, { passive: true });
  document.addEventListener("touchstart", warm, { passive: true });
})();
