// SIIT Study Hub — shared interaction layer (showcase prototype, no backend)
(function () {
  "use strict";

  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".navlinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open-mobile");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navLinks.style.display = open ? "flex" : "";
    });
  }

  /* ---- Tabs (Exam Intel / Materials, Unresolved / Resolved) ---- */
  qsa("[data-tabs]").forEach(function (group) {
    var tabs = qsa(".tab", group);
    var panels = qsa("[data-tabpanel]", group.closest("[data-tabs-scope]") || document);
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
        tab.setAttribute("aria-selected", "true");
        var target = tab.getAttribute("data-tab-target");
        panels.forEach(function (p) {
          p.hidden = p.getAttribute("data-tabpanel") !== target;
        });
      });
    });
  });

  /* ---- Pill single-select groups (Exam Type, Material Type) ---- */
  qsa("[data-pillgroup]").forEach(function (group) {
    var pills = qsa(".pill", group);
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.setAttribute("aria-pressed", "false"); });
        pill.setAttribute("aria-pressed", "true");
      });
    });
  });

  /* ---- Checkbox pill groups (Format: MCQ / Written) ---- */
  qsa("[data-pillcheck]").forEach(function (group) {
    qsa(".pill", group).forEach(function (pill) {
      pill.addEventListener("click", function () {
        var pressed = pill.getAttribute("aria-pressed") === "true";
        pill.setAttribute("aria-pressed", pressed ? "false" : "true");
      });
    });
  });

  /* ---- Range sliders with live output ---- */
  qsa('input[type="range"][data-output]').forEach(function (input) {
    var out = document.getElementById(input.getAttribute("data-output"));
    var suffix = input.getAttribute("data-suffix") || "";
    function update() { if (out) out.textContent = input.value + suffix; }
    input.addEventListener("input", update);
    update();
  });

  /* ---- Vote controls (local-only, no persistence) ---- */
  qsa(".vote").forEach(function (vote) {
    var up = vote.querySelector('[data-vote="up"]');
    var down = vote.querySelector('[data-vote="down"]');
    var score = vote.querySelector(".vote__score");
    var base = parseInt(score.textContent, 10) || 0;
    var state = 0; // -1, 0, 1
    function render() {
      score.textContent = base + state;
      up.setAttribute("aria-pressed", state === 1 ? "true" : "false");
      down.setAttribute("aria-pressed", state === -1 ? "true" : "false");
    }
    up.addEventListener("click", function (e) { e.preventDefault(); state = state === 1 ? 0 : 1; render(); });
    down.addEventListener("click", function (e) { e.preventDefault(); state = state === -1 ? 0 : -1; render(); });
  });

  /* ---- Tag input (topics field on Submit Exam Intel) ---- */
  qsa("[data-tagfield]").forEach(function (field) {
    var input = field.querySelector("input");
    if (!input) return;
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && input.value.trim()) {
        e.preventDefault();
        addTag(field, input.value.trim());
        input.value = "";
      }
    });
    qsa(".tag button", field).forEach(bindTagRemove);
  });
  function addTag(field, text) {
    var tag = document.createElement("span");
    tag.className = "tag";
    var label = document.createElement("span");
    label.textContent = text;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = '<svg class="icon icon-sm" viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15"/></svg>';
    btn.setAttribute("aria-label", "Remove " + text);
    tag.appendChild(label);
    tag.appendChild(btn);
    bindTagRemove(btn);
    field.insertBefore(tag, field.querySelector("input"));
  }
  function bindTagRemove(btn) {
    btn.addEventListener("click", function () { btn.closest(".tag").remove(); });
  }

  /* ---- Report modal ---- */
  var overlay = document.getElementById("report-overlay");
  if (overlay) {
    var titleField = document.getElementById("report-target-title");
    var lastFocused = null;

    function openReport(triggerEl) {
      lastFocused = triggerEl || document.activeElement;
      var title = (triggerEl && triggerEl.getAttribute("data-report-title")) || "this submission";
      if (titleField) titleField.textContent = "“" + title + "”";
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var firstPill = overlay.querySelector(".pill");
      if (firstPill) firstPill.focus();
    }
    function closeReport() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }
    qsa("[data-open-report]").forEach(function (btn) {
      btn.addEventListener("click", function (e) { e.preventDefault(); openReport(btn); });
    });
    qsa("[data-close-report]", overlay).forEach(function (btn) {
      btn.addEventListener("click", function (e) { e.preventDefault(); closeReport(); });
    });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeReport(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeReport();
    });
    var reportForm = overlay.querySelector("form");
    if (reportForm) {
      reportForm.addEventListener("submit", function (e) {
        e.preventDefault();
        closeReport();
      });
    }
  }

  /* ---- Search filter (Course Catalogue) ---- */
  var catalogueSearch = document.getElementById("catalogue-search");
  if (catalogueSearch) {
    var rows = qsa("[data-course-row]");
    catalogueSearch.addEventListener("input", function () {
      var q = catalogueSearch.value.trim().toLowerCase();
      rows.forEach(function (row) {
        var hay = row.getAttribute("data-search") || "";
        row.style.display = hay.indexOf(q) === -1 ? "none" : "";
      });
    });
  }
})();
