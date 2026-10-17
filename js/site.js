/* Empty string: copy the brief and show it. A non-empty address also opens a mailto draft. */
const CONTACT_EMAIL = "";

(function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setNav(!open);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });
  }

  var mailMode = document.querySelector("[data-mail-mode]");
  if (mailMode && CONTACT_EMAIL.trim()) {
    mailMode.textContent = "The form copies a brief, shows it on this page, and opens a mail draft.";
  }

  var form = document.querySelector("[data-brief-form]");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var brief = compose(form);
    var out = document.querySelector("[data-brief-out]");
    var status = document.querySelector("[data-brief-status]");

    if (out) {
      out.hidden = false;
      out.textContent = brief;
    }

    copyText(brief).then(function (copied) {
      var message = copied
        ? "Copied. The brief is on this page."
        : "The brief is on this page. Select it in the panel if the copy did not land.";
      if (CONTACT_EMAIL.trim()) {
        message += " A mail draft is opening.";
      }
      if (status) status.textContent = message;
      if (out) out.focus();
    });

    if (CONTACT_EMAIL.trim()) {
      var href = "mailto:" + CONTACT_EMAIL.trim()
        + "?subject=" + encodeURIComponent("Practice brief")
        + "&body=" + encodeURIComponent(brief);
      window.location.href = href;
    }
  });

  function compose(form) {
    var data = new FormData(form);
    var lines = ["Practice brief", "Kyler Loucks", ""];
    data.forEach(function (value, key) {
      var text = String(value).trim();
      if (!text) return;
      lines.push(label(key) + ": " + text);
    });
    return lines.join("\n");
  }

  function label(key) {
    var text = String(key).replace(/_/g, " ");
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }, function () {
        return false;
      });
    }
    return Promise.resolve(false);
  }
})();
