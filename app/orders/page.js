"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  Package, CheckCircle, Truck, Clock, ShoppingBag, Lock, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

/* ── Helpers ──────────────────────────────────────────────────── */
const STATUS = {
  Procesando:  { icon: Clock,       cls: "bg-yellow-100 text-yellow-700" },
  "En camino": { icon: Truck,       cls: "bg-blue-100   text-blue-700"   },
  Entregado:   { icon: CheckCircle, cls: "bg-green-100  text-green-700"  },
};

const NUTRI_CLS = { A:"bg-green-600 text-white", B:"bg-lime-500 text-white",
                    C:"bg-yellow-400 text-gray-900", D:"bg-orange-500 text-white",
                    E:"bg-red-600 text-white" };
const NOVA_LABEL = { "1":"Mín.proc.","2":"Culinario","3":"Procesado","4":"Ultra-proc." };

const fmt = (n) => n?.toLocaleString("es-MX", { minimumFractionDigits: 2 }) ?? "—";

/* ── Product rows inside expanded order ───────────────────────── */
function ProductTable({ items }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-500 font-semibold uppercase tracking-wide">
            {[
              "Foto", "SKU", "Nombre", "Descripción", "Marca", "Categoría",
              "Cant. prod.", "Porción", "Nutri", "Eco", "NOVA",
              "Empaque", "Etiquetas", "Países", "Precio/u", "Unidades", "Subtotal",
            ].map((h) => (
              <th key={h} className="px-2 py-2 text-left whitespace-nowrap border-b border-gray-200 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(({ product: p, quantity }) => {
            const subtotal = p.price * quantity;
            return (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-blue-50/40 align-middle">
                <td className="px-2 py-2">
                  <div className="relative size-10 rounded overflow-hidden bg-gray-100 shrink-0">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                </td>
                <td className="px-2 py-2 font-mono text-gray-500 whitespace-nowrap select-all">{p.sku}</td>
                <td className="px-2 py-2 font-medium text-gray-900 min-w-[140px]">{p.name}</td>
                <td className="px-2 py-2 text-gray-500 max-w-[180px]">
                  <span className="line-clamp-2">{p.description || "—"}</span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-gray-700">{p.brand || "—"}</td>
                <td className="px-2 py-2 whitespace-nowrap capitalize text-gray-700">{p.category || "—"}</td>
                <td className="px-2 py-2 whitespace-nowrap text-gray-700">{p.productQuantity || "—"}</td>
                <td className="px-2 py-2 whitespace-nowrap text-gray-700">{p.servingSize || "—"}</td>
                <td className="px-2 py-2">
                  {p.nutriScore
                    ? <span className={`px-1.5 py-0.5 rounded font-bold ${NUTRI_CLS[p.nutriScore] ?? "bg-gray-300 text-white"}`}>{p.nutriScore}</span>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-2 py-2">
                  {p.ecoScore
                    ? <span className={`px-1.5 py-0.5 rounded font-bold ${NUTRI_CLS[p.ecoScore] ?? "bg-gray-300 text-white"}`}>{p.ecoScore}</span>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {p.novaGroup
                    ? <span className="text-gray-700">{p.novaGroup} · {NOVA_LABEL[p.novaGroup]}</span>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-gray-700">{p.packaging || "—"}</td>
                <td className="px-2 py-2 text-gray-700 max-w-[140px]">
                  <span className="line-clamp-2">{p.labels || "—"}</span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-gray-700">{p.countries || "—"}</td>
                <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-900">${fmt(p.price)}</td>
                <td className="px-2 py-2 text-center font-medium text-gray-900">{quantity}</td>
                <td className="px-2 py-2 whitespace-nowrap font-bold text-gray-900">${fmt(subtotal)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Order totals row ─────────────────────────────────────────── */
function OrderTotals({ total }) {
  const tax = total * 0.16;
  return (
    <div className="flex justify-end px-4 py-3 bg-gray-50 border-t border-gray-200 gap-6 text-sm">
      <span className="text-gray-500">Subtotal: <strong className="text-gray-900">${fmt(total)}</strong></span>
      <span className="text-gray-500">IVA 16%: <strong className="text-gray-900">${fmt(tax)}</strong></span>
      <span className="text-gray-700 font-semibold">Total: <strong className="text-blue-700 text-base">${fmt(total + tax)}</strong></span>
    </div>
  );
}

/* ── Main orders table ────────────────────────────────────────── */
function OrdersTable({ orders }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-700 text-white text-xs uppercase tracking-wide font-semibold">
              {["ID Pedido","Fecha","Estado","Productos","Unidades","Subtotal","Total (c/IVA)","Cliente","Dirección","Tarjeta",""].map((h) => (
                <th key={h} className="px-3 py-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const cfg = STATUS[order.status] ?? STATUS["Procesando"];
              const StatusIcon = cfg.icon;
              const date = new Date(order.createdAt);
              const tax = order.total * 0.16;
              const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);
              const isOpen = expandedId === order.id;

              return (
                <>
                  <tr
                    key={order.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isOpen ? "bg-blue-50/60" : ""}`}
                  >
                    <td className="px-3 py-3 font-mono text-xs text-gray-600 whitespace-nowrap select-all">
                      {order.id}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-xs">
                      {date.toLocaleDateString("es-MX", { day:"2-digit", month:"2-digit", year:"2-digit" })}
                      {" "}
                      <span className="text-gray-400">
                        {date.toLocaleTimeString("es-MX", { hour:"2-digit", minute:"2-digit" })}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
                        <StatusIcon className="size-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-700 font-medium">{order.items.length}</td>
                    <td className="px-3 py-3 text-center text-gray-700 font-medium">{totalUnits}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-700">${fmt(order.total)}</td>
                    <td className="px-3 py-3 whitespace-nowrap font-bold text-gray-900">${fmt(order.total + tax)}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-700">{order.customerName}</td>
                    <td className="px-3 py-3 text-gray-600 max-w-[160px]">
                      <span className="line-clamp-1">{order.address}</span>
                    </td>
                    <td className="px-3 py-3 font-mono text-gray-500 whitespace-nowrap">•••• {order.cardLast4}</td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => toggle(order.id)}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                      >
                        {isOpen ? <><ChevronUp className="size-3.5"/>Cerrar</> : <><ChevronDown className="size-3.5"/>Detalles</>}
                      </button>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr key={`${order.id}-detail`} className="bg-gray-50/80">
                      <td colSpan={11} className="p-0">
                        <div className="border-t border-blue-100">
                          <ProductTable items={order.items} />
                          <OrderTotals total={order.total} />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
function OrdersContent() {
  const { orders } = useStore();
  const { isAuthenticated, ready } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isNew = searchParams.get("new") === "true";

  useEffect(() => {
    if (ready && !isAuthenticated) router.replace("/login");
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Lock className="size-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Verificando sesión...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="size-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No tienes pedidos aún</h2>
        <p className="text-gray-500 mb-6">Realiza tu primera compra para verla aquí.</p>
        <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white">
          <Link href="/">Explorar productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {isNew && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-green-700">
          <CheckCircle className="size-5 shrink-0" />
          <div>
            <p className="font-semibold">¡Pedido confirmado!</p>
            <p className="text-sm">Tu pedido ha sido recibido y está siendo procesado.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="size-6 text-blue-700" />
          Mis Pedidos
        </h1>
        <span className="text-sm text-gray-500">
          {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      <OrdersTable orders={orders} />

      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/">Continuar comprando</Link>
        </Button>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
