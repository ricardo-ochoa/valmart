const FIELDS = [
  "code",
  "product_name",
  "generic_name",
  "ingredients_text",
  "brands",
  "categories",
  "image_url",
  "image_front_small_url",
  "quantity",
  "serving_size",
  "nutriscore_grade",
  "ecoscore_grade",
  "nova_group",
  "packaging",
  "labels",
  "countries",
  "stores",
  "nutriments",
].join(",");

// Deterministic price so the same product always costs the same
function toPrice(code) {
  let n = 0;
  for (const c of String(code)) n = (n * 31 + c.charCodeAt(0)) & 0xffff;
  return Number((2.99 + (n % 9601) / 100).toFixed(2));
}

// Deterministic rating 3.0–5.0
function toRating(code) {
  let n = 0;
  for (const c of String(code)) n = (n * 17 + c.charCodeAt(0)) & 0xff;
  return parseFloat((3.0 + (n % 20) / 10).toFixed(1));
}

// Deterministic review count 20–9999
function toReviews(code) {
  let n = 0;
  for (const c of String(code)) n = (n * 7 + c.charCodeAt(0)) & 0x3fff;
  return 20 + (n % 9979);
}

// Strip language prefixes like "en:", "es:", "fr:" from comma-separated lists
function cleanTags(str, limit = 3) {
  if (!str) return "";
  return str
    .split(",")
    .map((s) => s.replace(/^[a-z]{2}:/i, "").replace(/-/g, " ").trim())
    .filter(Boolean)
    .slice(0, limit)
    .join(", ");
}

function transformProduct(p) {
  if (!p.code || !p.product_name || !p.image_url) return null;
  const code = String(p.code);
  return {
    // Identity
    id: code,
    sku: code,
    // Basic info
    name: p.product_name,
    description: p.generic_name || "",
    ingredients: p.ingredients_text || "",
    brand: cleanTags(p.brands, 2),
    category: cleanTags(p.categories, 1),
    // Media
    image: p.image_url,
    thumbnail: p.image_front_small_url || p.image_url,
    // Physical
    productQuantity: p.quantity || "",
    servingSize: p.serving_size || "",
    // Scores
    nutriScore: p.nutriscore_grade?.toUpperCase() || null,
    ecoScore: p.ecoscore_grade?.toUpperCase() || null,
    novaGroup: p.nova_group ? String(p.nova_group) : null,
    // Other
    packaging: cleanTags(p.packaging, 2),
    labels: cleanTags(p.labels, 3),
    countries: cleanTags(p.countries, 3),
    stores: cleanTags(p.stores, 3),
    // Generated
    price: toPrice(code),
    rating: toRating(code),
    reviews: toReviews(code),
  };
}

export async function fetchProducts() {
  try {
    const url =
      `https://es.openfoodfacts.org/cgi/search.pl` +
      `?action=process&json=1&page_size=60&sort_by=popularity_key&fields=${FIELDS}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const products = (data.products || [])
      .map(transformProduct)
      .filter(Boolean)
      .slice(0, 24);

    return products.length >= 5 ? products : null;
  } catch {
    return null;
  }
}
