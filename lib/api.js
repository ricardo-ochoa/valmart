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

// Open Food Facts requires a User-Agent to avoid being blocked in production
const HEADERS = {
  "User-Agent": "Valmart/1.0 (https://github.com/ricardo-ochoa/valmart)",
  Accept: "application/json",
};

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
    id: code,
    sku: code,
    name: p.product_name,
    description: p.generic_name || "",
    ingredients: p.ingredients_text || "",
    brand: cleanTags(p.brands, 2),
    category: cleanTags(p.categories, 1),
    image: p.image_url,
    thumbnail: p.image_front_small_url || p.image_url,
    productQuantity: p.quantity || "",
    servingSize: p.serving_size || "",
    nutriScore: p.nutriscore_grade?.toUpperCase() || null,
    ecoScore: p.ecoscore_grade?.toUpperCase() || null,
    novaGroup: p.nova_group ? String(p.nova_group) : null,
    packaging: cleanTags(p.packaging, 2),
    labels: cleanTags(p.labels, 3),
    countries: cleanTags(p.countries, 3),
    stores: cleanTags(p.stores, 3),
    price: toPrice(code),
    rating: toRating(code),
    reviews: toReviews(code),
  };
}

async function fetchWithTimeout(url, options, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchProducts() {
  const url =
    `https://world.openfoodfacts.org/cgi/search.pl` +
    `?action=process&json=1&page_size=60&sort_by=popularity_key&fields=${FIELDS}`;

  try {
    const res = await fetchWithTimeout(
      url,
      {
        headers: HEADERS,
        next: { revalidate: 3600 },
      },
      8000
    );

    if (!res.ok) {
      console.error(`[api] Open Food Facts responded ${res.status}`);
      return null;
    }

    const data = await res.json();
    const products = (data.products || [])
      .map(transformProduct)
      .filter(Boolean)
      .slice(0, 24);

    if (products.length < 5) {
      console.error(`[api] Too few products (${products.length}), using fallback`);
      return null;
    }

    return products;
  } catch (err) {
    console.error("[api] fetchProducts failed:", err?.message ?? err);
    return null;
  }
}
