/* Form handling: inline validation, a sending state, and confirmation only after Formspree accepts the message. */
(function () {
  /* Wording comes from data attributes on the form (editable in the CMS); these are fallbacks. */
  var DEFAULTS = { sending: "Sending…", failed: "Couldn't send your message. Check your connection and try again.", check: "Check this field" };
  function text(form, name) { return (form && form.dataset[name]) || DEFAULTS[name]; }

  function errorFor(field) {
    var id = field.id + "-error";
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("p");
      el.id = id;
      el.className = "field-error";
      field.parentNode.appendChild(el);
    }
    return el;
  }

  function clearError(field) {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
    var el = document.getElementById(field.id + "-error");
    if (el) el.remove();
  }

  function showError(field, message) {
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", field.id + "-error");
    errorFor(field).textContent = message;
  }

  function messageFor(field) {
    if (field.validity.typeMismatch && field.dataset.errorType) return field.dataset.errorType;
    return field.dataset.error || text(field.form, "check");
  }

  /* Returns true when every field is valid; focuses the first one that is not. */
  function validate(form) {
    var first = null;
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.willValidate || !field.id) return;
      clearError(field);
      if (!field.checkValidity()) {
        showError(field, messageFor(field));
        if (!first) first = field;
      }
    });
    if (first) first.focus();
    return !first;
  }

  function setSending(form, sending) {
    var button = form.querySelector("button[type=submit]");
    if (!button) return;
    var label = button.querySelector("[data-label]");
    if (sending) {
      button.dataset.idleLabel = label.textContent;
      label.textContent = text(form, "sending");
    } else if (button.dataset.idleLabel) {
      label.textContent = button.dataset.idleLabel;
    }
    button.disabled = sending;
    button.setAttribute("aria-busy", sending ? "true" : "false");
  }

  function calm() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("a11y-still");
  }

  /* The form fades out, then the thank-you message fades in and takes focus. */
  function succeed(form) {
    var hide = document.getElementById(form.dataset.hideId) || form;
    var done = document.getElementById(form.dataset.successId);
    form.reset();

    function swap() {
      hide.style.display = "none";
      hide.style.opacity = "";
      if (!done) return;
      done.style.display = "block";
      void done.offsetWidth; /* lets the browser see the hidden state first, so the fade-in runs */
      done.classList.add("is-visible");
      done.setAttribute("tabindex", "-1");
      done.focus({ preventScroll: false });
    }

    if (calm()) return swap();
    hide.style.transition = "opacity 0.25s ease-out";
    hide.style.opacity = "0";
    window.setTimeout(swap, 260);
  }

  function submit(form) {
    var status = document.getElementById(form.id ? form.id + "-status" : "");
    if (!status) status = form.querySelector(".form-status");
    var say = function (text) { if (status) status.textContent = text; };
    say("");
    setSending(form, true);

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    }).then(function (response) {
      if (response.ok) return succeed(form);
      return response.json().then(function (data) {
        say(data && data.errors ? data.errors.map(function (e) { return e.message; }).join(", ") : text(form, "failed"));
      }, function () { say(text(form, "failed")); });
    }).catch(function () {
      say(text(form, "failed"));
    }).then(function () {
      setSending(form, false);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("form[data-form]"), function (form) {
    form.addEventListener("input", function (event) {
      if (event.target.getAttribute && event.target.getAttribute("aria-invalid")) clearError(event.target);
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (validate(form)) submit(form);
    });
  });
})();
