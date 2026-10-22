/* Share button: uses the system share sheet where available, otherwise copies the link. */
(function () {
  var button = document.querySelector("[data-share]");
  if (!button) return;

  var label = button.querySelector("[data-share-label]");
  var status = document.querySelector("[data-share-status]");

  function confirmCopied() {
    label.textContent = "Link copied";
    status.textContent = "Link copied to clipboard";
    setTimeout(function () {
      label.textContent = "Share";
      status.textContent = "";
    }, 2500);
  }

  button.addEventListener("click", function () {
    var data = { title: button.dataset.title, url: window.location.href };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(data.url).then(confirmCopied, function () {});
    }
  });
})();
