(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  $("#year").textContent = new Date().getFullYear();

  const header = $("#header");
  const progress = $("#progress");
  const toTop = $("#toTop");

  function onScroll(){
    const d = document.documentElement;
    const max = d.scrollHeight - d.clientHeight;
    progress.style.transform = `scaleX(${max ? d.scrollTop/max : 0})`;
    header.classList.toggle("scrolled", d.scrollTop > 8);
    toTop.classList.toggle("show", d.scrollTop > 550);
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

  const nav = $("#nav");
  const menuBtn = $("#menuBtn");
  function setMenu(open){
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));

  const links = $$(".nav a");
  const sections = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window){
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const id = "#" + entry.target.id;
          links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === id));
        }
      });
    }, {rootMargin:"-40% 0px -50% 0px"});
    sections.forEach(s => spy.observe(s));
  }

  const form = $("#contactForm");
  const error = $("#formError");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    if(!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message){
      error.hidden = false;
      error.textContent = "Please enter your name, a valid email, and a message.";
      return;
    }
    error.hidden = true;
    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
    window.location.href = "mailto:shoshi4228@gmail.com?subject=" + subject + "&body=" + body;
    form.reset();
  });
})();
