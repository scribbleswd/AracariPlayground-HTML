// DRAWER
const drawer = document.getElementById("drawer"),
  overlay = document.getElementById("drawerOverlay"),
  hamburger = document.getElementById("hamburger"),
  drawerClose = document.getElementById("drawerClose");
function springAnimate(el, delay, k, d) {
  setTimeout(() => {
    let x = 260,
      sc = 0.9,
      op = 0,
      vx = 0,
      vs = 0,
      lastTime = null;
    const SPEED = 1.132;
    const OP_RATE = 0.272;
    el.style.opacity = "0";
    el.style.transform = `translateX(${x}px) scale(${sc})`;
    function tick(timestamp) {
      if (lastTime === null) lastTime = timestamp;
      const elapsed = Math.min(timestamp - lastTime, 50);
      const dt = (elapsed / 1000) * SPEED;
      lastTime = timestamp;
      vx += (-k * x - d * vx) * dt;
      vs += (-k * (sc - 1) - d * vs) * dt;
      x += vx * dt;
      sc += vs * dt;
      op = Math.min(1, op + OP_RATE * (elapsed / 1000));
      el.style.transform = `translateX(${x.toFixed(2)}px) scale(${sc.toFixed(4)})`;
      el.style.opacity = op.toFixed(3);
      if (
        Math.abs(x) > 0.15 ||
        Math.abs(vx) > 0.15 ||
        Math.abs(sc - 1) > 0.001 ||
        Math.abs(vs) > 0.001
      ) {
        requestAnimationFrame(tick);
      } else {
        el.style.transform = "translateX(0) scale(1)";
        el.style.opacity = "1";
      }
    }
    requestAnimationFrame(tick);
  }, delay);
}
function openDrawer() {
  drawer.classList.add("open");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  const links = [...drawer.querySelectorAll(".drawer-links a")],
    footer = drawer.querySelector(".drawer-footer");
  [...links, footer].forEach((el) => {
    el.style.transition = "none";
    el.style.transform = "translateX(260px) scale(0.9)";
    el.style.opacity = "0";
  });
  links.forEach((el, i) => springAnimate(el, 40 + i * 122, 3.75, 1.8));
  springAnimate(footer, 40 + links.length * 122, 3.75, 1.8);
  drawerClose.focus();
}
function closeDrawer() {
  drawer.classList.remove("open");
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  hamburger.focus();
}
hamburger.addEventListener("click", openDrawer);
drawerClose.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

// THEME
const themeToggle = document.getElementById("themeToggle"),
  drawerThemeToggle = document.getElementById("drawerThemeToggle"),
  html = document.documentElement;
let isDark = true;
function setTheme(d) {
  isDark = d;
  html.setAttribute("data-theme", d ? "dark" : "light");
  const l = d ? "☀ Light" : "🌙 Dark";
  themeToggle.textContent = l;
  drawerThemeToggle.textContent = l;
}
themeToggle.addEventListener("click", () => setTheme(!isDark));
drawerThemeToggle.addEventListener("click", () => setTheme(!isDark));

// GALLERY FILTERS
const filterBtns = document.querySelectorAll(".filter-btn"),
  masonryItems = document.querySelectorAll(".masonry-item");
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    masonryItems.forEach((item) =>
      item.classList.toggle(
        "hidden",
        f !== "all" && item.dataset.cat !== f,
      ),
    );
  }),
);

// LIGHTBOX
const lightbox = document.getElementById("lightbox"),
  lbImg = document.getElementById("lbImg"),
  lbTitle = document.getElementById("lbTitle"),
  lbCat = document.getElementById("lbCat"),
  lbCounter = document.getElementById("lbCounter"),
  lbClose = document.getElementById("lbClose"),
  lbPrev = document.getElementById("lbPrev"),
  lbNext = document.getElementById("lbNext");
let lbIndex = 0,
  lbItems = [];
function getVisible() {
  return [...masonryItems].filter(
    (el) => !el.classList.contains("hidden"),
  );
}
function openLightbox(i) {
  lbItems = getVisible();
  lbIndex = i;
  showLb();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
  lbClose.focus();
}
function showLb() {
  const item = lbItems[lbIndex],
    img = item.querySelector("img");
  lbImg.src = img.src;
  lbImg.alt = item.dataset.title;
  lbTitle.textContent = item.dataset.title;
  lbCat.textContent = item.dataset.cat
    .replace("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  lbCounter.textContent = `${lbIndex + 1} / ${lbItems.length}`;
  lbImg.style.opacity = "0";
  lbImg.onload = () => {
    lbImg.style.transition = "opacity .25s";
    lbImg.style.opacity = "1";
  };
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  lbImg.src = "";
}
function lbNav(d) {
  lbItems = getVisible();
  lbIndex = (lbIndex + d + lbItems.length) % lbItems.length;
  showLb();
}
masonryItems.forEach((item) =>
  item.addEventListener("click", () => {
    const v = getVisible(),
      i = v.indexOf(item);
    if (i !== -1) openLightbox(i);
  }),
);
lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => lbNav(-1));
lbNext.addEventListener("click", () => lbNav(1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lbNav(-1);
  if (e.key === "ArrowRight") lbNav(1);
});

// FAQ
document.querySelectorAll(".faq-q").forEach((btn) =>
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item"),
      isOpen = item.classList.contains("open");
    document
      .querySelectorAll(".faq-item")
      .forEach((i) => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
    btn.setAttribute("aria-expanded", !isOpen);
  }),
);

// FORM
function handleSubmit(e) {
  e.preventDefault();
  document.getElementById("form-thanks").style.display = "block";
  e.target.reset();
}

// NAV / HERO LOGO SCROLL FADE
const mainNav = document.querySelector("body > nav");
const heroLogo = document.getElementById("heroLogo");
const FADE_DISTANCE = 160;
const DRAWER_BREAKPOINT = 768;
function updateScrollFade() {
  const isMobile = window.innerWidth <= DRAWER_BREAKPOINT;
  const progress = Math.min(1, window.scrollY / FADE_DISTANCE);
  if (isMobile) {
    mainNav.style.opacity = "1";
    mainNav.style.pointerEvents = "auto";
  } else {
    mainNav.style.opacity = progress;
    mainNav.style.pointerEvents = progress > 0.05 ? "auto" : "none";
  }
  heroLogo.style.opacity = 1 - progress;
}
window.addEventListener("scroll", updateScrollFade, { passive: true });
window.addEventListener("resize", updateScrollFade, { passive: true });
updateScrollFade();

// SCROLL REVEAL
const reveals = document.querySelectorAll(".reveal"),
  observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
reveals.forEach((el) => observer.observe(el));
