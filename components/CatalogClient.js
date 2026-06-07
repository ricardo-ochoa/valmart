"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/lib/products";

export default function CatalogClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Bienvenido a Valmart</h1>
        <p className="text-blue-100 text-lg">
          Los mejores productos al mejor precio, directamente a tu puerta.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, marca o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? "bg-blue-700 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

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
    </div>
  );
}
