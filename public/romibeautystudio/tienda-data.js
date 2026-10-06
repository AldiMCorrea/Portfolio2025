// Catálogo de la tienda (tomado de Shine como referencia).
// TODO: ajustar productos, precios e imágenes a los de Romi.
const STORE = [
  {
    "id": "internacional",
    "title": "Internacional",
    "subtitle": "Skincare importado de USA",
    "products": [
      {
        "id": "to_niacinamide",
        "name": "Niacinamide 10% + Zinc 1%",
        "brand": "The Ordinary",
        "description": "Sérum concentrado que reduce poros, controla oleosidad y mejora textura. El más vendido del mundo — 30ml.",
        "price": 32000,
        "image": "Asserts/tienda/TheOrdinary-Niacinamida.jpg",
        "origin": "USA"
      },
      {
        "id": "to_hyaluronic",
        "name": "Ácido Hialurónico 2% + B5",
        "brand": "The Ordinary",
        "description": "Hidratación profunda en múltiples capas de la piel. Con vitamina B5 para reparación. Apto para todo tipo de piel — 30ml.",
        "price": 34000,
        "image": "Asserts/tienda/TheOrdinary-Hyaluronic.jpg",
        "origin": "USA"
      },
      {
        "id": "to_aha_bha_peeling",
        "name": "AHA 30% + BHA 2% Peeling Solution",
        "brand": "The Ordinary",
        "description": "El famoso peeling exfoliante. 10 minutos para una piel más luminosa, suave y renovada. Uso semanal — 30ml.",
        "price": 42000,
        "image": "Asserts/tienda/TheOrdinary-AHAPeeling.jpg",
        "origin": "USA"
      },
      {
        "id": "to_squalane_cleanser",
        "name": "Squalane Cleanser",
        "brand": "The Ordinary",
        "description": "Limpiador suave con escualano que disuelve maquillaje e impurezas sin resecar. Textura bálsamo que se transforma en aceite — 150ml.",
        "price": 65000,
        "image": "Asserts/tienda/TheOrdinary-Cleanser.jpg",
        "origin": "USA"
      },
      {
        "id": "to_nmf",
        "name": "Natural Moisturizing Factors + HA",
        "brand": "The Ordinary",
        "description": "Crema hidratante con aminoácidos, ceramidas y ácido hialurónico. Hidratación no grasa para uso diario — 100ml.",
        "price": 58000,
        "image": "Asserts/tienda/TheOrdinary-Moisturizing.jpg",
        "origin": "USA"
      },
      {
        "id": "to_glycolic",
        "name": "Glycolic Acid 7% Toning Solution",
        "brand": "The Ordinary",
        "description": "Tónico exfoliante con ácido glicólico al 7%. Mejora textura, luminosidad y tono. Uso nocturno — 240ml.",
        "price": 48000,
        "image": "Asserts/tienda/TheOrdinary-GlycolicAcidToner.jpg",
        "origin": "USA"
      },
      {
        "id": "to_caffeine",
        "name": "Caffeine Solution 5% + EGCG",
        "brand": "The Ordinary",
        "description": "Sérum concentrado de cafeína para reducir ojeras e hinchazón del contorno de ojos. Resultados visibles — 30ml.",
        "price": 36000,
        "image": "Asserts/tienda/TheOrdinary-CaffeineSolutions.jpg",
        "origin": "USA"
      }
    ]
  },
  {
    "id": "combos",
    "title": "Combos &amp; colecciones",
    "subtitle": "Rutinas completas para tu piel",
    "products": [
      {
        "id": "idraet_limpieza_x6",
        "name": "Kit Rutina Limpieza e Hidratación x6",
        "brand": "Idraet",
        "description": "Leche limpiadora, gel purificante, tónico, crema hidratante y más. Rutina completa para todo tipo de piel.",
        "price": 85000,
        "image": null,
        "origin": "Argentina"
      },
      {
        "id": "idraet_vitamina_c",
        "name": "Rutina Vitamina C — Piel Mixta",
        "brand": "Idraet",
        "description": "Crema hidratante ligera + Sérum células madre con Vitamina C. Luminosidad y renovación celular para piel mixta.",
        "price": 110000,
        "image": null,
        "origin": "Argentina"
      },
      {
        "id": "idraet_peeling_x8",
        "name": "Kit Peeling Glicólico y Mandélico x8",
        "brand": "Idraet",
        "description": "Kit profesional completo: peeling glicólico, mandélico, pre-peel, neutralizador, hidratante. Renovación profunda.",
        "price": 135000,
        "image": null,
        "origin": "Argentina"
      },
      {
        "id": "combo_duo_hidratacion",
        "name": "Combo Duo Hidratación Básica",
        "brand": "The Ordinary",
        "description": "Niacinamide 10% + Zinc 1% (30ml) + Ácido Hialurónico 2% + B5 (30ml). El dúo más popular para piel hidratada.",
        "price": 60000,
        "image": null,
        "origin": "USA"
      }
    ]
  },
  {
    "id": "insumos",
    "title": "Insumos",
    "subtitle": "Herramientas y accesorios de estética",
    "products": [
      {
        "id": "guasha_rosa",
        "name": "Gua Sha Cuarzo Rosa",
        "brand": "Gua Sha",
        "description": "Piedra de cuarzo rosa para masaje facial. Drenaje linfático, deshincha y esculpe el rostro. Propiedades calmantes.",
        "price": 22000,
        "image": "Asserts/tienda/guashacuarzorosa.jpg",
        "origin": null
      },
      {
        "id": "guasha_jade",
        "name": "Gua Sha Jade Verde",
        "brand": "Gua Sha",
        "description": "Jade verde natural, se mantiene frío naturalmente. Ideal para contornear mandíbula y pómulos. Energía equilibrante.",
        "price": 18000,
        "image": "Asserts/tienda/guashapiedrajade.jpg",
        "origin": null
      },
      {
        "id": "guasha_acero",
        "name": "Gua Sha Acero Inoxidable",
        "brand": "Gua Sha",
        "description": "Gua Sha de acero inoxidable quirúrgico. Se enfría naturalmente, hipoalergénico y duradero. Ideal para drenaje profesional.",
        "price": 25000,
        "image": "Asserts/tienda/guashaacero.jpg",
        "origin": null
      },
      {
        "id": "kit_roller_guasha",
        "name": "Kit Roller de Jade + Gua Sha",
        "brand": "Set Completo",
        "description": "Set completo en caja de regalo: roller facial de jade + gua sha. El regalo perfecto para amantes del skincare.",
        "price": 32000,
        "image": "Asserts/tienda/guashayrollo.jpg",
        "origin": null
      },
      {
        "id": "kit_skincare_completo",
        "name": "Kit Skincare Completo",
        "brand": "Accesorios",
        "description": "Vincha spa + toalla facial microfibra + muñequeras + pad desmaquillante reutilizable. Todo para tu rutina diaria.",
        "price": 38000,
        "image": "Asserts/tienda/vinchaskincare.jpg",
        "origin": null
      },
      {
        "id": "toallitas_microfibra",
        "name": "Toallitas Desmaquillantes Reutilizables",
        "brand": "Accesorio",
        "description": "Set de toallitas desmaquillantes ultra suaves. Reutilizables, lavables a máquina. Ideales para pieles sensibles.",
        "price": 8000,
        "image": "Asserts/tienda/toallasdesmaquillantes.jpg",
        "origin": null
      }
    ]
  },
  {
    "id": "promos",
    "title": "Promos",
    "subtitle": "Packs con precio especial",
    "products": [
      {
        "id": "promo_combo_completo_to",
        "name": "Combo Completo The Ordinary x7",
        "brand": "The Ordinary",
        "description": "Los 7 productos: Squalane Cleanser + Niacinamide + Ácido Hialurónico + AHA Peeling + Moisturizing Factors + Glycolic Acid Toner + Caffeine Solution. Tu arsenal completo de skincare importado.",
        "price": 295000,
        "image": null,
        "origin": "USA"
      },
      {
        "id": "promo_rutina_completa_to",
        "name": "Rutina Completa The Ordinary x4",
        "brand": "The Ordinary",
        "description": "Squalane Cleanser + Niacinamide 10% + Ácido Hialurónico + Natural Moisturizing Factors. Tu rutina diaria importada completa.",
        "price": 170000,
        "image": null,
        "origin": "USA"
      },
      {
        "id": "promo_duo_exfoliacion",
        "name": "Duo Exfoliación Profunda",
        "brand": "The Ordinary",
        "description": "AHA 30% + BHA 2% Peeling Solution + Glycolic Acid 7% Toning Solution. Exfoliación semanal + diaria para piel renovada.",
        "price": 82000,
        "image": null,
        "origin": "USA"
      },
      {
        "id": "promo_idraet_completo",
        "name": "Pack Idraet Completo",
        "brand": "Idraet",
        "description": "Kit Limpieza x6 + Rutina Vitamina C. Limpieza profunda + luminosidad con dermocosmetica profesional argentina.",
        "price": 175000,
        "image": null,
        "origin": "Argentina"
      },
      {
        "id": "promo_skincare_starter",
        "name": "Starter Kit Skincare + Herramientas",
        "brand": "Shine Nails",
        "description": "Combo Duo Hidratación T.O. + Kit Roller de Jade + Gua Sha + Kit Skincare Completo. Todo para empezar tu rutina profesional.",
        "price": 118000,
        "image": null,
        "origin": null
      }
    ]
  }
];
