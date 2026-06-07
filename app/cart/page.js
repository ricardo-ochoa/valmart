"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useStore();
  const tax = cartTotal * 0.16;
  const total = cartTotal + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="size-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">Agrega productos para comenzar a comprar.</p>
        <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white">
          <Link href="/">Explorar productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4"
            >
              <div className="relative size-24 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-900 leading-snug mt-0.5">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  ${(product.price * quantity).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">${product.price} c/u</p>
              </div>

              <div className="flex flex-col items-end justify-between gap-2">
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Eliminar"
                >
                  <Trash2 className="size-4" />
                </button>

                <div className="flex items-center gap-1 border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Resumen del pedido</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IVA (16%)</span>
                <span>${tax.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <Button
              asChild
              className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white h-10"
            >
              <Link href="/checkout">
                Proceder al pago
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full mt-2 h-10">
              <Link href="/">Seguir comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
