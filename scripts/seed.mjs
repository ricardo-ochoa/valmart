/**
 * Seed script — puebla origin_catalog y origin_orders en MongoDB
 * Uso: node scripts/seed.mjs
 *
 * Lee MONGODB_URI y MONGODB_DB desde .env.local usando dotenv
 * (se instala automáticamente si no está: npm i -D dotenv)
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

// ── Leer .env.local manualmente (sin dependencia extra) ──────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env.local");
const envVars = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
    .filter(([k]) => k)
    .map(([k, ...rest]) => [k, rest.join("=")])
);
const MONGODB_URI = envVars.MONGODB_URI;
const MONGODB_DB = envVars.MONGODB_DB;

if (!MONGODB_URI || !MONGODB_DB) {
  console.error("❌  MONGODB_URI o MONGODB_DB no encontrados en .env.local");
  process.exit(1);
}

// ── Datos de productos (origin_catalog) ─────────────────────────
const products = [
  { id:"5449000000996", sku:"5449000000996", name:"Coca-Cola Original 330ml", description:"Refresco de cola carbonatado", ingredients:"Agua carbonatada, azúcar, colorante caramelo (E-150d), ácido fosfórico, aromas naturales, cafeína.", brand:"Coca-Cola", category:"Bebidas", image:"https://picsum.photos/seed/cocacola330/300/300", thumbnail:"https://picsum.photos/seed/cocacola330/100/100", productQuantity:"330 ml", servingSize:"330 ml", nutriScore:"E", ecoScore:"C", novaGroup:"4", packaging:"Lata de aluminio", labels:"Sin gluten", countries:"México, España, Estados Unidos, Francia", stores:"Walmart, Oxxo, Soriana, Chedraui", price:18.50, rating:4.7, reviews:8923 },
  { id:"3017624010701", sku:"3017624010701", name:"Nutella 400g", description:"Crema de avellanas con cacao", ingredients:"Azúcar, aceite de palma, avellanas (13%), cacao magro en polvo (7.4%), leche desnatada en polvo (6.6%), suero de leche en polvo, emulgente (lecitina de soja), vainillina.", brand:"Ferrero", category:"Untables", image:"https://picsum.photos/seed/nutella400/300/300", thumbnail:"https://picsum.photos/seed/nutella400/100/100", productQuantity:"400 g", servingSize:"15 g", nutriScore:"E", ecoScore:"D", novaGroup:"4", packaging:"Frasco de vidrio", labels:"Vegetariano", countries:"México, España, Francia, Italia, Alemania", stores:"Walmart, Costco, Sam's Club, Soriana", price:89.90, rating:4.8, reviews:12456 },
  { id:"7622210951137", sku:"7622210951137", name:"Oreo Original 154g", description:"Galletas de chocolate con relleno de crema de vainilla", ingredients:"Harina de trigo, azúcar, aceite de palma, cacao en polvo (6%), almidón de trigo, gasificantes (carbonato de sodio, carbonato de amonio), sal, emulgente (lecitina de soja), aroma de vainilla.", brand:"Mondeléz", category:"Galletas", image:"https://picsum.photos/seed/oreooriginal/300/300", thumbnail:"https://picsum.photos/seed/oreooriginal/100/100", productQuantity:"154 g", servingSize:"34 g (3 galletas)", nutriScore:"E", ecoScore:"C", novaGroup:"4", packaging:"Bolsa de plástico", labels:"Apto para veganos", countries:"México, España, Estados Unidos, Brasil", stores:"Walmart, Oxxo, 7-Eleven, Soriana", price:32.00, rating:4.6, reviews:9871 },
  { id:"7501030450071", sku:"7501030450071", name:"Sabritas Clásicas 150g", description:"Papas fritas con sal", ingredients:"Papas, aceite vegetal (girasol, maíz y/o cártamo), sal.", brand:"Sabritas (PepsiCo)", category:"Botanas", image:"https://picsum.photos/seed/sabritas150/300/300", thumbnail:"https://picsum.photos/seed/sabritas150/100/100", productQuantity:"150 g", servingSize:"28 g (aprox. 15 papas)", nutriScore:"D", ecoScore:"C", novaGroup:"4", packaging:"Bolsa de plástico metalizado", labels:"Sin gluten, Vegetariano", countries:"México", stores:"Oxxo, 7-Eleven, Walmart, Soriana, Chedraui", price:28.50, rating:4.5, reviews:7234 },
  { id:"7501059203119", sku:"7501059203119", name:"Nescafé Clásico 200g", description:"Café soluble instantáneo", ingredients:"Café soluble (100%).", brand:"Nestlé", category:"Café", image:"https://picsum.photos/seed/nescafe200/300/300", thumbnail:"https://picsum.photos/seed/nescafe200/100/100", productQuantity:"200 g", servingSize:"2 g", nutriScore:"B", ecoScore:"C", novaGroup:"2", packaging:"Frasco de vidrio con tapa metálica", labels:"Sin gluten, Sin lactosa", countries:"México, Colombia, Brasil", stores:"Walmart, Soriana, Chedraui, Sam's Club", price:95.00, rating:4.5, reviews:6123 },
  { id:"7613035309401", sku:"7613035309401", name:"KitKat 4 Dedos 41.5g", description:"Barrita de galleta cubierta de chocolate con leche", ingredients:"Azúcar, harina de trigo, grasa de leche, cacao, leche desnatada en polvo, suero de leche en polvo, aceite vegetal, emulgente (lecitina de soja), aroma de vainilla.", brand:"Nestlé", category:"Chocolates", image:"https://picsum.photos/seed/kitkat415/300/300", thumbnail:"https://picsum.photos/seed/kitkat415/100/100", productQuantity:"41.5 g", servingSize:"41.5 g (1 barrita)", nutriScore:"E", ecoScore:"C", novaGroup:"4", packaging:"Envoltorio de papel y plástico", labels:"Certificación UTZ", countries:"México, España, Reino Unido, Alemania", stores:"Oxxo, 7-Eleven, Walmart, Costco", price:22.00, rating:4.6, reviews:11342 },
  { id:"5053990109434", sku:"5053990109434", name:"Pringles Original 165g", description:"Papas fritas en tubo, sabor original", ingredients:"Hojuelas de papa deshidratada (42%), aceite vegetal, harina de trigo, almidón de maíz, arroz, sal, emulgente (lecitina de soja).", brand:"Kellogg's", category:"Botanas", image:"https://picsum.photos/seed/pringles165/300/300", thumbnail:"https://picsum.photos/seed/pringles165/100/100", productQuantity:"165 g", servingSize:"30 g (aprox. 16 papas)", nutriScore:"D", ecoScore:"D", novaGroup:"4", packaging:"Tubo de cartón con base metálica y tapa de plástico", labels:"Sin gluten", countries:"México, España, Estados Unidos", stores:"Walmart, Costco, Oxxo, Sam's Club", price:45.00, rating:4.4, reviews:5987 },
  { id:"5059319012413", sku:"5059319012413", name:"Kellogg's Corn Flakes 500g", description:"Hojuelas de maíz tostado", ingredients:"Maíz (93%), azúcar, sal, extracto de malta de cebada, niacina, hierro, vitamina B6, riboflavina, tiamina, ácido fólico, vitamina D, vitamina B12.", brand:"Kellogg's", category:"Cereales", image:"https://picsum.photos/seed/cornflakes500/300/300", thumbnail:"https://picsum.photos/seed/cornflakes500/100/100", productQuantity:"500 g", servingSize:"30 g", nutriScore:"B", ecoScore:"B", novaGroup:"3", packaging:"Caja de cartón con bolsa interior de plástico", labels:"Sin gluten, Vegetariano, Bajo en grasa", countries:"México, España, Estados Unidos", stores:"Walmart, Soriana, Chedraui, Sam's Club, Costco", price:65.00, rating:4.3, reviews:4521 },
  { id:"9002490100070", sku:"9002490100070", name:"Red Bull Energy Drink 250ml", description:"Bebida energizante con taurina y cafeína", ingredients:"Agua, sacarosa, glucosa, acidulante (ácido cítrico), taurina (0.4%), reguladores de acidez (carbonatos de sodio, carbonatos de magnesio), cafeína (0.03%), vitaminas (niacina, ácido pantoténico, B6, B12), aromas naturales y artificiales, colorantes (caramelo E-150c, riboflavina).", brand:"Red Bull", category:"Bebidas energéticas", image:"https://picsum.photos/seed/redbull250/300/300", thumbnail:"https://picsum.photos/seed/redbull250/100/100", productQuantity:"250 ml", servingSize:"250 ml", nutriScore:"E", ecoScore:"C", novaGroup:"4", packaging:"Lata de aluminio", labels:"Sin gluten", countries:"México, España, Austria, Alemania, Estados Unidos", stores:"Oxxo, 7-Eleven, Walmart, Soriana", price:35.00, rating:4.5, reviews:7865 },
  { id:"3033710071975", sku:"3033710071975", name:"Activia Natural 125g", description:"Yogur natural con bifidobacterias", ingredients:"Leche entera pasteurizada, fermentos lácticos (Streptococcus thermophilus, Lactobacillus bulgaricus), Bifidobacterium animalis lactis DN-173 010.", brand:"Danone", category:"Lácteos", image:"https://picsum.photos/seed/activia125/300/300", thumbnail:"https://picsum.photos/seed/activia125/100/100", productQuantity:"125 g", servingSize:"125 g", nutriScore:"B", ecoScore:"C", novaGroup:"3", packaging:"Tarrina de plástico con tapa de aluminio", labels:"Vegetariano, Sin gluten", countries:"México, España, Francia", stores:"Walmart, Soriana, Chedraui, Oxxo", price:18.00, rating:4.2, reviews:3456 },
  { id:"7614500010003", sku:"7614500010003", name:"Toblerone Leche 100g", description:"Chocolate con leche, miel y turrón de almendras", ingredients:"Azúcar, leche entera en polvo, manteca de cacao, cacao, almendras (8.5%), miel (3.6%), pasta de almendras, clara de huevo, emulgente (lecitina de soja), aroma de vainilla.", brand:"Mondeléz", category:"Chocolates", image:"https://picsum.photos/seed/toblerone100/300/300", thumbnail:"https://picsum.photos/seed/toblerone100/100/100", productQuantity:"100 g", servingSize:"20 g (2 porciones triangulares)", nutriScore:"E", ecoScore:"C", novaGroup:"4", packaging:"Caja de cartón triangular", labels:"Certificado Rainforest Alliance", countries:"México, España, Suiza, Alemania, Francia", stores:"Walmart, Costco, Sam's Club, aeropuertos", price:48.00, rating:4.7, reviews:6789 },
  { id:"0013000006408", sku:"0013000006408", name:"Heinz Ketchup 567g", description:"Salsa de tomate condimentada", ingredients:"Tomate concentrado reconstituido (150g de tomate por 100g de producto), vinagre de destilación, azúcar, sal, especias y hierbas aromáticas.", brand:"Heinz", category:"Salsas y condimentos", image:"https://picsum.photos/seed/heinzketchup/300/300", thumbnail:"https://picsum.photos/seed/heinzketchup/100/100", productQuantity:"567 g", servingSize:"17 g (1 cucharada)", nutriScore:"C", ecoScore:"B", novaGroup:"3", packaging:"Botella de plástico con tapa dosificadora", labels:"Sin gluten, Vegetariano, Sin conservantes artificiales", countries:"México, España, Estados Unidos, Reino Unido", stores:"Walmart, Costco, Soriana, Sam's Club", price:42.00, rating:4.6, reviews:8102 },
  { id:"0021000009213", sku:"0021000009213", name:"Philadelphia Original 225g", description:"Queso crema original para untar", ingredients:"Queso crema (leche pasteurizada, sal, estabilizante E407, fermentos lácticos), crema de leche, proteínas de leche, sal, regulador de acidez (ácido láctico).", brand:"Mondeléz", category:"Lácteos", image:"https://picsum.photos/seed/philadelphia225/300/300", thumbnail:"https://picsum.photos/seed/philadelphia225/100/100", productQuantity:"225 g", servingSize:"30 g", nutriScore:"D", ecoScore:"C", novaGroup:"3", packaging:"Tarrina de plástico con tapa de plástico", labels:"Vegetariano, Sin gluten", countries:"México, España, Estados Unidos", stores:"Walmart, Costco, Soriana, Chedraui", price:55.00, rating:4.4, reviews:4230 },
  { id:"0044000036874", sku:"0044000036874", name:"Ritz Original 200g", description:"Galletas saladas crujientes con mantequilla", ingredients:"Harina de trigo enriquecida, aceite de palma y/o canola, azúcar, sal, levadura, bicarbonato de sodio, lecitina de soja, sabor natural.", brand:"Mondeléz", category:"Galletas", image:"https://picsum.photos/seed/ritz200g/300/300", thumbnail:"https://picsum.photos/seed/ritz200g/100/100", productQuantity:"200 g", servingSize:"16 g (5 galletas)", nutriScore:"D", ecoScore:"C", novaGroup:"4", packaging:"Caja de cartón con envoltorio interior de plástico", labels:"Vegetariano", countries:"México, España, Estados Unidos", stores:"Walmart, Oxxo, Soriana, Chedraui", price:35.00, rating:4.3, reviews:5412 },
  { id:"8001120806000", sku:"8001120806000", name:"San Pellegrino Sparkling 500ml", description:"Agua mineral natural con gas", ingredients:"Agua mineral natural carbonatada. Residuo seco a 180°C: 1109 mg/l.", brand:"Nestlé", category:"Agua", image:"https://picsum.photos/seed/sanpellegrino/300/300", thumbnail:"https://picsum.photos/seed/sanpellegrino/100/100", productQuantity:"500 ml", servingSize:"250 ml", nutriScore:"A", ecoScore:"B", novaGroup:"1", packaging:"Botella de vidrio", labels:"Sin azúcar, Sin calorías, Sin gluten, Vegetariano, Vegano", countries:"México, Italia, España, Francia, Alemania", stores:"Walmart, Costco, Sam's Club, restaurantes", price:22.00, rating:4.5, reviews:3987 },
  { id:"5411188130413", sku:"5411188130413", name:"Alpro Bebida de Soja 1L", description:"Bebida vegetal de soja sin azúcar añadida", ingredients:"Agua, soja (8.7%), minerales (fosfato de calcio, cloruro de magnesio), vitaminas (B12, B2, D2), azúcares de la soja.", brand:"Alpro", category:"Bebidas vegetales", image:"https://picsum.photos/seed/alprosoja1l/300/300", thumbnail:"https://picsum.photos/seed/alprosoja1l/100/100", productQuantity:"1 L", servingSize:"250 ml", nutriScore:"A", ecoScore:"A", novaGroup:"2", packaging:"Tetrabrik con tapón de plástico reciclable", labels:"Vegano, Sin gluten, Sin lactosa, Sin azúcar añadida, Orgánico", countries:"México, España, Francia, Alemania, Bélgica", stores:"Walmart, Costco, supermercados orgánicos", price:52.00, rating:4.2, reviews:2876 },
];

// ── Helper para calcular total de un pedido ──────────────────────
const p = (sku) => products.find((x) => x.sku === sku);
const calcTotal = (items) =>
  items.reduce((sum, { product: prod, quantity }) => sum + prod.price * quantity, 0);

// ── Datos de pedidos (origin_orders) ────────────────────────────
const buildOrders = () => {
  const order1Items = [
    { product: p("5449000000996"), quantity: 6 },
    { product: p("3017624010701"), quantity: 1 },
    { product: p("7622210951137"), quantity: 2 },
  ];
  const order2Items = [
    { product: p("9002490100070"), quantity: 4 },
    { product: p("5053990109434"), quantity: 2 },
    { product: p("7501030450071"), quantity: 3 },
    { product: p("7614500010003"), quantity: 1 },
  ];
  const order3Items = [
    { product: p("5059319012413"), quantity: 2 },
    { product: p("3033710071975"), quantity: 4 },
    { product: p("8001120806000"), quantity: 6 },
    { product: p("5411188130413"), quantity: 2 },
    { product: p("7501059203119"), quantity: 1 },
  ];

  return [
    { id:"ORD-1747944000001", createdAt:"2026-05-20T10:15:00.000Z", items:order1Items, total:calcTotal(order1Items), status:"Entregado", customerName:"Ana García López", address:"Av. Insurgentes Sur 1602, Col. Crédito Constructor, CDMX", cardLast4:"4242" },
    { id:"ORD-1749081600002", createdAt:"2026-06-04T16:45:00.000Z", items:order2Items, total:calcTotal(order2Items), status:"En camino", customerName:"Carlos Mendoza Ríos", address:"Calle Madero 300, Col. Centro, Guadalajara, Jalisco", cardLast4:"1337" },
    { id:"ORD-1749254400003", createdAt:"2026-06-06T09:20:00.000Z", items:order3Items, total:calcTotal(order3Items), status:"Procesando", customerName:"Sofía Herrera Vega", address:"Blvd. Kukulcán Km 9, Zona Hotelera, Cancún, Q. Roo", cardLast4:"9981" },
  ];
};

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅  Conectado a MongoDB Atlas");

    const db = client.db(MONGODB_DB);

    // --- origin_catalog ---
    const catalogCol = db.collection("origin_catalog");
    await catalogCol.deleteMany({});
    const catalogResult = await catalogCol.insertMany(products);
    console.log(`✅  origin_catalog: ${catalogResult.insertedCount} productos insertados`);

    // --- origin_orders ---
    const ordersCol = db.collection("origin_orders");
    await ordersCol.deleteMany({});
    const orders = buildOrders();
    const ordersResult = await ordersCol.insertMany(orders);
    console.log(`✅  origin_orders: ${ordersResult.insertedCount} pedidos insertados`);

    console.log("\n🎉  Seed completado exitosamente");
  } catch (err) {
    console.error("❌  Error durante el seed:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
