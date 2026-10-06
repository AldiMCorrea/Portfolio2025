// Tienda: render de productos + carrito (cart.js) que arma el pedido por WhatsApp
const shop = document.getElementById("shop");
const shopNav = document.getElementById("shopNav");

const placeholder = '<span class="svc-card__placeholder" aria-hidden="true"></span>';

shop.innerHTML = STORE.map(
  (cat, i) => `
  <section class="section shop-section${i % 2 ? " shop-section--alt wave" : ""}" id="${cat.id}">
    <div class="container">
      <header class="section__head">
        <p class="eyebrow">${cat.subtitle}</p>
        <h2 class="title">${cat.title}</h2>
      </header>
      <div class="product-grid">
        ${cat.products
          .map(
            (p) => `
          <article class="product">
            <div class="product__img">${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : placeholder}
              ${p.origin ? `<span class="product__tag">Importado ${p.origin}</span>` : ""}
            </div>
            <div class="product__body">
              <p class="product__brand">${p.brand}</p>
              <h3>${p.name}</h3>
              <p class="product__desc">${p.description}</p>
              <div class="product__foot">
                <span class="product__price">${fmtARS(p.price)}</span>
                <button class="btn btn--small" data-add="${p.id}">Agregar</button>
              </div>
            </div>
          </article>`
          )
          .join("")}
      </div>
    </div>
  </section>`
).join("");

shopNav.innerHTML = STORE.map((c) => `<a href="#${c.id}">${c.title}</a>`).join("");

// ---- Carrito ----
createCart({
  key: "romi-cart",
  catalog: Object.fromEntries(STORE.flatMap((c) => c.products).map((p) => [p.id, { name: p.name, price: p.price }])),
  title: "Tu pedido",
  icon: "bag",
  sendLabel: "Enviar pedido por WhatsApp",
  fields: [{ id: "nombre", label: "Tu nombre", type: "text", placeholder: "Para el pedido" }],
  intro: (v) => `¡Hola Romi!${v.nombre ? ` Soy ${v.nombre}.` : ""} Quiero hacer este pedido de la tienda:`,
});
