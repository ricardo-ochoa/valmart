export const dynamic = "force-dynamic";

import { Suspense } from "react";
import CatalogClient from "@/components/CatalogClient";
import { getDB } from "@/lib/mongodb";
import { products as staticProducts } from "@/lib/products";

/** Lee productos desde MongoDB; si falla cae al catálogo estático */
async function fetchProducts() {
  try {
    const db = await getDB();
    const docs = await db.collection("origin_catalog").find({}).toArray();
    if (!docs.length) return staticProducts;
    // Serializar _id de ObjectId a string para pasar como prop al Client Component
    return docs.map(({ _id, ...rest }) => ({ ...rest, _id: _id.toString() }));
  } catch {
    return staticProducts;
  }
}

export default async function Home() {
  const products = await fetchProducts();
  return (
    <Suspense>
      <CatalogClient products={products} />
    </Suspense>
  );
}
