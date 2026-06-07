import { fetchProducts } from "@/lib/api";
import { products as staticProducts } from "@/lib/products";
import CatalogClient from "@/components/CatalogClient";

export default async function Home() {
  const apiProducts = await fetchProducts();
  const products = apiProducts ?? staticProducts;
  const source = apiProducts ? "api" : "static";
  return <CatalogClient products={products} source={source} />;
}
