"use client";

import { useState, useEffect } from "react";
import { Search, Wifi, WifiOff, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import { products as staticProducts } from "@/lib/products";

export default function CatalogClient() {
  const [products, setProducts] = useState([]);
  const [source, setSource] = useState(null); // null = loading, "api" | "static"
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (data && data.length >= 5) {
          setProducts(data);
          setSource("api");
        } else {
          setProducts(staticProducts);
          setSource("static");
        }
      })
      .catch(() => {
        setProducts(staticProducts);
        setSource("static");
      });
  }, []);

  const categories = [
    "Todos",
    ...[...new Set(products.map((p) => p.category).filter(Boolean))].slice(0, 8),
  ];

  const filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === "Todos" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const isLoading = source === null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Bienvenido a Valmart</h1>
        <p className="text-blue-100 text-lg">
          Los mejores productos al mejor precio, directamente a tu puerta.
        </p>
        <div className="mt-3 h-6">
          {isLoading && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 px-2.5 py-1 rounded-full">
              <Loader2 className="size-3 animate-spin" />
              Cargando productos...
            </span>
          )}
          {source === "api" && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 px-2.5 py-1 rounded-full">
              <Wifi className="size-3" />
              Productos en vivo · Open Food Facts
            </span>
          )}
          {source === "static" && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 px-2.5 py-1 rounded-full text-blue-200">
              <WifiOff className="size-3" />
              Catálogo local
            </span>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {!isLoading && (
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap capitalize ${
                  activeCategory === cat
                    ? "bg-blue-700 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="flex justify-between items-center mt-3">
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                  <div className="h-7 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products */}
      {!isLoading && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"} encontrados
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">No se encontraron productos</p>
              <p className="text-sm mt-1">Intenta con otro término o categoría</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
