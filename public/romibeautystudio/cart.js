// Carrito reutilizable (tienda y servicios): arma el pedido y lo envía por WhatsApp.
// Requiere WHATSAPP_NUMBER (script.js).
const fmtARS = (n) => `$${n.toLocaleString("es-AR")}`;

const CART_ICONS = {
  bag: '<path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
};

/**
 * @param {object} o
 * @param {string} o.key        clave de localStorage
 * @param {object} o.catalog    { id: { name, price } } — price null = "a consultar"
 * @param {string} o.title      título del panel
 * @param {string} o.icon       "bag" | "list"
 * @param {string} o.sendLabel  texto del botón de envío
 * @param {Array}  o.fields     campos extra: { id, label, type: "text"|"date"|"select", options?, placeholder? }
 * @param {Function} o.intro    (valores) => primera línea del mensaje
 */
function createCart({ key, catalog, title, icon = "bag", sendLabel, fields = [], intro }) {
  const fieldHTML = fields
    .map((f) => {
      const input =
        f.type === "select"
          ? `<select data-field="${f.id}">${f.options.map((o) => `<option>${o}</option>`).join("")}</select>`
          : `<input type="${f.type}" data-field="${f.id}" placeholder="${f.placeholder || ""}"${f.type === "text" ? ' autocomplete="name"' : ""}>`;
      return `<label class="cart__field">${f.label}${input}</label>`;
    })
    .join("");

  document.body.insertAdjacentHTML(
    "beforeend",
    `<button class="cart-fab" aria-label="Ver ${title.toLowerCase()}">
      <svg viewBox="0 0 24 24" aria-hidden="true">${CART_ICONS[icon]}</svg>
      <span class="cart-fab__count">0</span>
    </button>
    <div class="cart-backdrop" hidden></div>
    <aside class="cart" aria-label="${title}" aria-hidden="true">
      <header class="cart__head">
        <h2>${title}</h2>
        <button class="cart__close" aria-label="Cerrar">×</button>
      </header>
      <ul class="cart__items"></ul>
      <p class="cart__empty">Todavía no agregaste nada.</p>
      <footer class="cart__foot">
        <div class="cart__total"><span>Total</span><strong>$0</strong></div>
        <p class="cart__note" hidden>+ servicios a consultar</p>
        ${fieldHTML}
        <button class="btn btn--light btn--block cart__send">${sendLabel}</button>
      </footer>
    </aside>`
  );

  const $ = (sel) => document.querySelector(sel);
  const els = {
    fab: $(".cart-fab"), count: $(".cart-fab__count"), backdrop: $(".cart-backdrop"), panel: $(".cart"),
    items: $(".cart__items"), empty: $(".cart__empty"), total: $(".cart__total strong"),
    note: $(".cart__note"), send: $(".cart__send"),
  };
  const dateInput = els.panel.querySelector('input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(key)) || {}; } catch {}
  Object.keys(cart).forEach((id) => { if (!catalog[id]) delete cart[id]; }); // ítems que ya no existen

  const save = () => { try { localStorage.setItem(key, JSON.stringify(cart)); } catch {} };
  const priceText = (id) => (catalog[id].price == null ? "A consultar" : fmtARS(catalog[id].price * cart[id]));
  const totals = () => {
    const ids = Object.keys(cart);
    return {
      ids,
      qty: ids.reduce((n, id) => n + cart[id], 0),
      total: ids.reduce((n, id) => n + cart[id] * (catalog[id].price || 0), 0),
      pending: ids.some((id) => catalog[id].price == null),
    };
  };

  const render = () => {
    const { ids, qty, total, pending } = totals();
    els.count.textContent = qty;
    els.count.hidden = qty === 0;
    els.total.textContent = fmtARS(total);
    els.note.hidden = !pending;
    els.empty.hidden = ids.length > 0;
    els.send.disabled = ids.length === 0;
    els.items.innerHTML = ids
      .map((id) => `<li class="cart-item">
        <div><p class="cart-item__name">${catalog[id].name}</p><p class="cart-item__price">${priceText(id)}</p></div>
        <div class="qty">
          <button data-dec="${id}" aria-label="Quitar uno">−</button>
          <span>${cart[id]}</span>
          <button data-inc="${id}" aria-label="Agregar uno">+</button>
        </div>
      </li>`)
      .join("");
  };

  const setOpen = (open) => {
    els.panel.classList.toggle("is-open", open);
    els.panel.setAttribute("aria-hidden", !open);
    els.backdrop.hidden = !open;
    document.body.classList.toggle("cart-open", open);
  };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-add],[data-inc],[data-dec]");
    if (!t) return;
    const { add, inc, dec } = t.dataset;
    if (add && catalog[add]) {
      cart[add] = (cart[add] || 0) + 1;
      const label = t.textContent;
      t.classList.add("is-added");
      t.textContent = t.dataset.addedLabel || "¡Agregado!";
      setTimeout(() => { t.textContent = label; t.classList.remove("is-added"); }, 1200);
      els.fab.classList.remove("is-bump"); void els.fab.offsetWidth; els.fab.classList.add("is-bump");
    }
    if (inc) cart[inc]++;
    if (dec && --cart[dec] <= 0) delete cart[dec];
    save();
    render();
  });

  els.fab.addEventListener("click", () => setOpen(true));
  els.panel.querySelector(".cart__close").addEventListener("click", () => setOpen(false));
  els.backdrop.addEventListener("click", () => setOpen(false));
  addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));

  els.send.addEventListener("click", () => {
    const { ids, total, pending } = totals();
    if (!ids.length) return;
    const values = Object.fromEntries(
      [...els.panel.querySelectorAll("[data-field]")].map((f) => [f.dataset.field, f.value.trim()])
    );
    const lines = [
      intro(values),
      ...ids.map((id) => `• ${cart[id]} x ${catalog[id].name} — ${priceText(id)}`),
      `Total: ${fmtARS(total)}${pending ? " + servicios a consultar" : ""}`,
    ];
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });

  render();
}
