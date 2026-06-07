import { products } from "./products";

const p = (sku) => products.find((x) => x.sku === sku);

// Pedido 1 — Entregado (hace 18 días)
const order1Items = [
  { product: p("5449000000996"), quantity: 6 },  // Coca-Cola x6
  { product: p("3017624010701"), quantity: 1 },  // Nutella x1
  { product: p("7622210951137"), quantity: 2 },  // Oreo x2
];

// Pedido 2 — En camino (hace 3 días)
const order2Items = [
  { product: p("9002490100070"), quantity: 4 },  // Red Bull x4
  { product: p("5053990109434"), quantity: 2 },  // Pringles x2
  { product: p("7501030450071"), quantity: 3 },  // Sabritas x3
  { product: p("7614500010003"), quantity: 1 },  // Toblerone x1
];

// Pedido 3 — Procesando (ayer)
const order3Items = [
  { product: p("5059319012413"), quantity: 2 },  // Corn Flakes x2
  { product: p("3033710071975"), quantity: 4 },  // Activia x4
  { product: p("8001120806000"), quantity: 6 },  // San Pellegrino x6
  { product: p("5411188130413"), quantity: 2 },  // Alpro Soja x2
  { product: p("7501059203119"), quantity: 1 },  // Nescafé x1
];

const total = (items) =>
  items.reduce((sum, { product: prod, quantity }) => sum + prod.price * quantity, 0);

export const seedOrders = [
  {
    id: "ORD-1747944000001",
    createdAt: "2026-05-20T10:15:00.000Z",
    items: order1Items,
    total: total(order1Items),
    status: "Entregado",
    customerName: "Ana García López",
    address: "Av. Insurgentes Sur 1602, Col. Crédito Constructor, CDMX",
    cardLast4: "4242",
  },
  {
    id: "ORD-1749081600002",
    createdAt: "2026-06-04T16:45:00.000Z",
    items: order2Items,
    total: total(order2Items),
    status: "En camino",
    customerName: "Carlos Mendoza Ríos",
    address: "Calle Madero 300, Col. Centro, Guadalajara, Jalisco",
    cardLast4: "1337",
  },
  {
    id: "ORD-1749254400003",
    createdAt: "2026-06-06T09:20:00.000Z",
    items: order3Items,
    total: total(order3Items),
    status: "Procesando",
    customerName: "Sofía Herrera Vega",
    address: "Blvd. Kukulcán Km 9, Zona Hotelera, Cancún, Q. Roo",
    cardLast4: "9981",
  },
];
