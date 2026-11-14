(function(){
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA = "923087257451";

  /* ---------- Data ---------- */
  var PLANS = {
    "5":  { name:"5 Marla",  total:5900000,  marla:5,  dim:"≈ 125 sq. yd · 1,125 sq. ft plot" },
    "10": { name:"10 Marla", total:10500000, marla:10, dim:"≈ 250 sq. yd · 2,250 sq. ft plot" },
    "20": { name:"1 Kanal",  total:21000000, marla:20, dim:"≈ 500 sq. yd · 4,500 sq. ft plot" },
    "40": { name:"2 Kanal",  total:38000000, marla:40, dim:"≈ 1,000 sq. yd · 9,000 sq. ft plot" }
  };
  function groupPK(n){
    var s = String(Math.round(n)), last = s.slice(-3), rest = s.slice(0,-3);
    if(rest) last = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last;
    return last;
  }
  function fmt(n){ return "PKR " + groupPK(n); }

  /* ---------- Count-up ---------- */
  var activeTweens = [];
  function countTo(el, to, dur, formatter){
    if(!el) return;
    if(reduced || !window.gsap){ el.textContent = formatter ? formatter(to) : to; return; }
    var obj = { v: 0 };
    var tw = gsap.to(obj, { v: to, duration: dur || 1.1, ease: "power2.out", onUpdate: function(){
      el.textContent = formatter ? formatter(Math.round(obj.v)) : Math.round(obj.v);
    }, onComplete: function(){ el.textContent = formatter ? formatter(to) : to; }});
    activeTweens.push(tw);
  }

  /* ---------- Counters ---------- */
  var counted = new WeakSet();
  var counterIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && !counted.has(e.target)){
        counted.add(e.target);
        countTo(e.target, parseInt(e.target.getAttribute("data-count"),10), 1.4);
      }
    });
  }, { threshold: .5 });
  document.querySelectorAll("[data-count]").forEach(function(el){ counterIO.observe(el); });

  /* ---------- Reveal on scroll ---------- */
  var rvIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); rvIO.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".rv").forEach(function(el){ rvIO.observe(el); });

  /* ---------- Duplicate marquee tracks ---------- */
  document.querySelectorAll("[data-dup]").forEach(function(t){ t.innerHTML += t.innerHTML; });

  /* ---------- Preloader + hero intro ---------- */
  var heroPlayed = false;
  function playHero(){
    if(heroPlayed) return; heroPlayed = true;
    if(window.gsap && !reduced){
      gsap.to(".hero h1 .w", { opacity:1, y:0, rotate:0, duration:1, stagger:.16, ease:"power3.out", delay:.1 });
    } else {
      document.querySelectorAll(".hero h1 .w").forEach(function(w){ w.style.opacity=1; w.style.transform="none"; });
    }
  }
  var preDone = false;
  function dismissPreloader(){
    if(preDone) return; preDone = true;
    var pl = document.getElementById("preloader");
    if(pl) pl.classList.add("done");
    playHero();
  }
  function tipCycle(){
    var tip = document.getElementById("wa-tip");
    if(!tip) return;
    setTimeout(function(){ tip.classList.add("show"); }, 2600);
    setTimeout(function(){ tip.classList.remove("show"); }, 9000);
  }
  if(document.documentElement.classList.contains("no-pre")){
    /* Repeat page in this tab session: the inline head script + CSS already
       hid the preloader, so just run the hero intro and the WhatsApp tip. */
    dismissPreloader();
    tipCycle();
  } else {
    var armPreloader = function(){
      setTimeout(function(){ dismissPreloader(); tipCycle(); }, reduced ? 60 : 650);
    };
    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", armPreloader);
    } else {
      armPreloader();
    }
    window.addEventListener("load", function(){ setTimeout(dismissPreloader, reduced ? 60 : 650); });
    setTimeout(dismissPreloader, 2600); /* JS fallback: never leave the preloader stuck */
  }

  /* ---------- Router ---------- */
  var current = null, firstNav = true;
  function routeFromHash(){
    var p = document.querySelector(".page");
    return p ? (p.getAttribute("data-page") || "home") : "home";
  }
  function setActiveNav(route){
    document.querySelectorAll("[data-nav][data-route]").forEach(function(a){
      a.classList.toggle("on", a.getAttribute("data-route") === route);
    });
  }
  function showPage(route, animate){
    var pages = document.querySelectorAll(".page");
    pages.forEach(function(p){ p.classList.toggle("active", p.getAttribute("data-page") === route); });
    setActiveNav(route);
    window.scrollTo(0,0);
    current = route;
    var active = document.querySelector('.page[data-page="'+route+'"]');
    if(active){
      active.querySelectorAll(".rv").forEach(function(el){ rvIO.observe(el); });
      active.querySelectorAll("[data-count]").forEach(function(el){ counterIO.observe(el); });
    }
    if(route === "home") playHero();
    if(route === "plans") setCalc(currentSize, true);
  }
  document.querySelectorAll("a[data-nav]").forEach(function(a){
    a.addEventListener("click", function(e){
      var href = a.getAttribute("href");
      if(!href || href.indexOf(".html") === -1) return;
      if(firstNav || reduced || !window.gsap) return;
      e.preventDefault();
      closeMenu();
      var wipe = document.getElementById("wipe");
      wipe.classList.remove("run"); void wipe.offsetWidth; wipe.classList.add("run");
      setTimeout(function(){ window.location.href = href; }, 430);
    });
  });

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger"), mmenu = document.getElementById("mmenu");
  function closeMenu(){
    burger.classList.remove("open"); mmenu.classList.remove("open");
    burger.setAttribute("aria-expanded","false"); mmenu.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }
  burger.addEventListener("click", function(){
    var open = mmenu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    mmenu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  });
  mmenu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeMenu); });

  /* ---------- Hotspots ---------- */
  document.querySelectorAll(".hotspot").forEach(function(h){
    h.addEventListener("click", function(){
      var was = h.classList.contains("active");
      document.querySelectorAll(".hotspot").forEach(function(x){ x.classList.remove("active"); x.setAttribute("aria-expanded","false"); });
      if(!was){ h.classList.add("active"); h.setAttribute("aria-expanded","true"); }
    });
  });

  /* ---------- Size tabs (explorer + calculator) ---------- */
  var currentSize = "5";
  function syncTabs(){
    document.querySelectorAll(".size-tab").forEach(function(t){
      t.classList.toggle("active", t.getAttribute("data-size") === currentSize);
    });
  }
  document.querySelectorAll(".size-tab").forEach(function(t){
    t.addEventListener("click", function(){
      currentSize = t.getAttribute("data-size");
      syncTabs(); setCalc(currentSize, true); setExplorer(currentSize);
    });
  });
  function setExplorer(size){
    if(!document.getElementById("ex-size")) return;
    var p = PLANS[size]; if(!p) return;
    document.getElementById("ex-size").textContent = p.name;
    document.getElementById("ex-dim").textContent = p.dim;
    document.getElementById("ex-total").textContent = fmt(p.total);
    document.getElementById("ex-book").textContent = fmt(p.total * .20);
    document.getElementById("ex-month").textContent = fmt(p.total * .01);
    document.getElementById("ex-wa").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent("I want to book a " + p.name + " plot in Phase 4. Total " + fmt(p.total) + ", booking " + fmt(p.total*.20) + ".");
  }
  function setCalc(size, animate){
    if(!document.getElementById("c-total")) return;
    var p = PLANS[size]; if(!p) return;
    var book = p.total*.20, ballot = p.total*.10, month = p.total*.01, balloon = p.total*.05, poss = p.total*.20;
    document.getElementById("c-size-name").textContent = p.name;
    document.getElementById("c-per").textContent = "≈ " + fmt(Math.round(p.total / p.marla)) + " / Marla";
    var money = function(n){ return "PKR " + groupPK(n); };
    if(animate && !reduced && window.gsap){
      countTo(document.getElementById("c-total"), p.total, 1, money);
      countTo(document.getElementById("c-book"), book, 1, money);
      countTo(document.getElementById("c-ballot"), ballot, 1, money);
      countTo(document.getElementById("c-month"), month, 1, money);
      countTo(document.getElementById("c-balloon"), balloon, 1, money);
      countTo(document.getElementById("c-poss"), poss, 1, money);
      countTo(document.getElementById("c-check"), p.total, 1, money);
    } else {
      document.getElementById("c-total").textContent = money(p.total);
      document.getElementById("c-book").textContent = money(book);
      document.getElementById("c-ballot").textContent = money(ballot);
      document.getElementById("c-month").textContent = money(month);
      document.getElementById("c-balloon").textContent = money(balloon);
      document.getElementById("c-poss").textContent = money(poss);
      document.getElementById("c-check").textContent = money(p.total);
    }
    document.getElementById("c-wa").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(
      "Hello, I want to book a " + p.name + " plot in Etihad Town Phase 4.\nTotal: " + money(p.total) + "\nBooking (20%): " + money(book) + "\nMonthly: " + money(month) + " x 30\nPlease send me more details.");
  }
  syncTabs(); setExplorer("5"); setCalc("5", false);

  /* ---------- Hero 3D tilt ---------- */
  var tilt = document.getElementById("tilt");
  if(tilt && window.matchMedia("(pointer: fine)").matches && !reduced){
    var hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", function(e){
      var r = tilt.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width/2)) / r.width;
      var y = (e.clientY - (r.top + r.height/2)) / r.height;
      tilt.style.transform = "rotateY(" + (x*9).toFixed(2) + "deg) rotateX(" + (-y*7).toFixed(2) + "deg)";
    });
    hero.addEventListener("pointerleave", function(){ tilt.style.transform = "rotateY(0deg) rotateX(0deg)"; });
    tilt.style.transition = "transform .35s ease-out";
  }

  /* ---------- Gold dust canvas ---------- */
  var canvas = document.getElementById("gold-dust");
  if(canvas && !reduced){
    var ctx = canvas.getContext("2d"), W, H, parts = [];
    function sizeCanvas(){
      var heroEl = document.querySelector(".hero");
      W = canvas.width = heroEl.offsetWidth; H = canvas.height = heroEl.offsetHeight;
    }
    sizeCanvas(); window.addEventListener("resize", sizeCanvas);
    for(var i=0;i<42;i++) parts.push({ x:Math.random(), y:Math.random(), r:Math.random()*1.9+.5, s:Math.random()*.00045+.00012, o:Math.random()*.5+.15, ph:Math.random()*6.28 });
    (function loop(t){
      if(current === "home"){
        ctx.clearRect(0,0,W,H);
        parts.forEach(function(p){
          p.y -= p.s; if(p.y < -0.02){ p.y = 1.02; p.x = Math.random(); }
          var tw = .55 + .45 * Math.sin(t*.001 + p.ph);
          ctx.beginPath();
          ctx.arc(p.x*W + Math.sin(t*.0004+p.ph)*9, p.y*H, p.r, 0, 6.29);
          ctx.fillStyle = "rgba(90,140,230," + (p.o*tw).toFixed(3) + ")";
          ctx.fill();
        });
      }
      requestAnimationFrame(loop);
    })(0);
  }

  /* ---------- Deal form → WhatsApp ---------- */
  var form = document.getElementById("deal-form");
  if(form) form.addEventListener("submit", function(e){
    e.preventDefault();
    var name = document.getElementById("f-name").value.trim();
    var phone = document.getElementById("f-phone").value.trim();
    var size = document.getElementById("f-size").value;
    var msg = document.getElementById("f-msg").value.trim();
    var text = "Hello, I am " + name + ".\nI am interested in " + size + " in Etihad Town.\nMy number: " + phone + (msg ? "\nMessage: " + msg : "") + "\nPlease send me more details, thank you.";
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(text), "_blank", "noopener");
  });

  /* ---------- Init route ---------- */
  showPage(routeFromHash(), false);
  firstNav = false;
})();
