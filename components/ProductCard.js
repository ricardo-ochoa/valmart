"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";

export default function ProductCard({ product }) {
  const { addToCart, cart } = useStore();
  const inCart = cart.find((item) => item.product.id === product.id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow group">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
          {product.category}
        </span>

        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-gray-700">{product.rating}</span>
          <span>({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toLocaleString()}
          </span>

          <Button
            size="sm"
            onClick={() => addToCart(product)}
            className={
              inCart
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-700 hover:bg-blue-800 text-white"
            }
          >
            <ShoppingCart className="size-3.5" />
            {inCart ? `En carrito (${inCart.quantity})` : "Agregar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
