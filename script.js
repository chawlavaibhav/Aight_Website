// header shadow on scroll
const header = document.querySelector("[data-header]");
const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

// mobile nav toggle
const toggle = document.querySelector("[data-nav-toggle]");
toggle?.addEventListener("click", () => {
  const open = header.classList.toggle("nav-open");
  toggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("[data-nav-links] a").forEach((a) =>
  a.addEventListener("click", () => {
    header.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  })
);

// staggered reveal, with safety fallbacks so content can never stay hidden
const reveal = (el) => el.classList.add("in");
const items = Array.from(document.querySelectorAll(".rv"));

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          reveal(e.target);
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
  );
  items.forEach((el) => {
    // reveal immediately if already within the viewport on load
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
    else io.observe(el);
  });
  // hard safety net: nothing stays invisible past 3s regardless of scroll/IO timing
  setTimeout(() => items.forEach(reveal), 3000);
} else {
  items.forEach(reveal);
}

window.addEventListener("load", () =>
  document.querySelectorAll(".hero .rv").forEach(reveal)
);
