// WhatsApp de Romi (formato wa.me: país + área sin 0 ni 15)
const WHATSAPP_NUMBER = "5493874820015";

const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

// Header sólido al hacer scroll
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menú mobile
navToggle.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// Animaciones al entrar en pantalla + contadores
const counters = document.querySelectorAll("[data-count]");
const animateCount = (el) => {
  const target = +el.dataset.count;
  const start = performance.now();
  const dur = 1600;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("es-AR");
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      e.target.querySelectorAll("[data-count]").forEach(animateCount);
      io.unobserve(e.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
if (!("IntersectionObserver" in window)) counters.forEach(animateCount);

// Texto sobre la onda: avanza sin fin siguiendo la curva (cola circular)
const scriptWave = document.getElementById("scriptWave");
if (scriptWave && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const textPath = document.getElementById("scriptTextPath");
  const text = textPath.parentElement;
  const SPEED = 38; // unidades del SVG por segundo
  let cycle = 0, offset = 0, last = 0, running = false;

  const tick = (now) => {
    if (!running) return;
    offset -= ((now - last) / 1000) * SPEED;
    last = now;
    if (offset <= 0) offset += cycle; // al completar una vuelta, vuelve a empezar sin salto
    textPath.setAttribute("startOffset", offset);
    requestAnimationFrame(tick);
  };

  document.fonts.ready.then(() => {
    // Largo de una vuelta (una repetición de las palabras) medido sobre la curva
    cycle = text.getSubStringLength(0, textPath.dataset.unit.length);
    offset = cycle;
    textPath.setAttribute("startOffset", offset);
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
      else if (!e.isIntersecting) running = false;
    }).observe(scriptWave);
  });
}

// Tabs de servicios
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", t === tab);
    });
    document.querySelectorAll(".menu").forEach((m) =>
      m.classList.toggle("is-active", m.id === `tab-${tab.dataset.tab}`)
    );
  })
);

// Galería: carrusel de videos (misma lógica que Shine)
const carousel = document.getElementById("carousel");
if (carousel) {
  const track = carousel.querySelector(".carousel__track");
  const cards = [...track.children];
  const dots = carousel.querySelector(".carousel__dots");
  const GAP = 24;
  let page = 0;

  const perView = () => (innerWidth <= 560 ? 1 : innerWidth <= 960 ? 2 : 3);
  const pages = () => Math.ceil(cards.length / perView());

  const buildDots = () => {
    dots.innerHTML = "";
    for (let i = 0; i < pages(); i++) {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `Página ${i + 1}`);
      b.addEventListener("click", () => goTo(i));
      dots.appendChild(b);
    }
  };

  const goTo = (p) => {
    const n = pages();
    page = (p + n) % n;
    const first = Math.min(page * perView(), cards.length - perView());
    track.style.transform = `translateX(-${first * (cards[0].offsetWidth + GAP)}px)`;
    [...dots.children].forEach((d, i) => d.setAttribute("aria-selected", i === page));
  };

  carousel.querySelector(".carousel__ctrl--prev").addEventListener("click", () => goTo(page - 1));
  carousel.querySelector(".carousel__ctrl--next").addEventListener("click", () => goTo(page + 1));

  // Swipe / arrastre
  let startX = null;
  const start = (x) => (startX = x);
  const end = (x) => {
    if (startX === null) return;
    const dx = x - startX;
    if (Math.abs(dx) > 50) goTo(page + (dx < 0 ? 1 : -1));
    startX = null;
  };
  track.addEventListener("touchstart", (e) => start(e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", (e) => end(e.changedTouches[0].clientX));
  track.addEventListener("mousedown", (e) => { e.preventDefault(); start(e.clientX); });
  addEventListener("mouseup", (e) => end(e.clientX));

  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildDots(); goTo(Math.min(page, pages() - 1)); }, 150);
  });

  buildDots();
  goTo(0);

  // Los videos sólo se reproducen cuando la galería está en pantalla
  const videos = carousel.querySelectorAll("video");
  new IntersectionObserver(([e]) => {
    videos.forEach((v) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
  }, { threshold: 0.2 }).observe(carousel);
}

// Formulario de turnos → WhatsApp
const form = document.getElementById("bookingForm");
if (form) {
  const formError = document.getElementById("formError");
  form.fecha.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { nombre, servicio, fecha, horario, mensaje } = form;
    [nombre, servicio].forEach((f) => f.classList.toggle("is-invalid", !f.value.trim()));
    if (!nombre.value.trim() || !servicio.value) {
      formError.textContent = "Completá tu nombre y el servicio, por favor.";
      return;
    }
    formError.textContent = "";

    const fechaTxt = fecha.value
      ? new Date(fecha.value + "T12:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
      : "a coordinar";
    const lines = [
      `¡Hola Romi! Soy ${nombre.value.trim()} y quiero reservar un turno.`,
      `• Servicio: ${servicio.value}`,
      `• Día: ${fechaTxt}`,
      `• Horario: ${horario.value}`,
    ];
    if (mensaje.value.trim()) lines.push(`• Comentarios: ${mensaje.value.trim()}`);

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
