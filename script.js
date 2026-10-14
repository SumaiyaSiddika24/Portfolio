(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("#year").textContent = new Date().getFullYear();

  // Mobile menu
  var nav = $("#nav"), menuBtn = $("#menuBtn");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Header turns solid after scrolling
  var header = $("#header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active nav link
  var links = $$(".nav a");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) { var s = $(a.getAttribute("href")); if (s) spy.observe(s); });

    // Count-up numbers
    var cObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.dataset.target), d = parseInt(el.dataset.decimals || "0", 10);
        obs.unobserve(el);
        if (reduce) { el.textContent = target.toFixed(d); return; }
        var start = performance.now();
        (function step(now) {
          var t = Math.min((now - start) / 1300, 1);
          el.textContent = (target * (1 - Math.pow(1 - t, 3))).toFixed(d);
          if (t < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.6 });
    $$(".count").forEach(function (el) { cObs.observe(el); });
  }

  // Contact form: opens the visitor's email app
  var form = $("#contactForm"), err = $("#formError");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim(), email = form.elements.email.value.trim(), msg = form.elements.message.value.trim();
    var problem = !name ? "Please enter your name." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Please enter a valid email address." : !msg ? "Please write a message." : "";
    err.hidden = !problem;
    if (problem) { err.textContent = problem; return; }
    window.location.href = "mailto:shoshi4228@gmail.com?subject=" + encodeURIComponent("Portfolio message from " + name) +
      "&body=" + encodeURIComponent(msg + "\n\n— " + name + " (" + email + ")");
    form.reset();
  });
})();