"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle, Truck, Clock, ShoppingBag, Lock,
  CreditCard, MapPin, User, Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

/* ── Helpers ─────────────────────────────────────────────────── */
const STATUS = {
  Procesando:  { icon: Clock,       cls: "bg-yellow-100 text-yellow-700" },
  "En camino": { icon: Truck,       cls: "bg-blue-100   text-blue-700"   },
  Entregado:   { icon: CheckCircle, cls: "bg-green-100  text-green-700"  },
};

const NUTRI_CLS = {
  A: "bg-green-600 text-white", B: "bg-lime-500 text-white",
  C: "bg-yellow-400 text-gray-900", D: "bg-orange-500 text-white",
  E: "bg-red-600 text-white",
};
const NOVA_LABEL = { "1":"Min","2":"Cul","3":"Proc","4":"Ultra" };

const fmt = (n) => n?.toLocaleString("es-MX", { minimumFractionDigits: 2 }) ?? "—";

/* ── Badge helper ────────────────────────────────────────────── */
function ScoreBadge({ label, value, cls }) {
  if (!value) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <span className="inline-flex flex-col items-center leading-none">
      <span className="text-[9px] text-gray-400 uppercase mb-0.5">{label}</span>
      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${cls ?? "bg-gray-200 text-gray-700"}`}>
        {value}
      </span>
    </span>
  );
}

/* ── Product table — columnas combinadas para no hacer scroll ── */
function ProductTable({ items }) {
  return (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wide">
          <th className="px-3 py-2 text-left font-medium border-b border-gray-100">Producto</th>
          <th className="px-3 py-2 text-left font-medium border-b border-gray-100">Marca / Cat.</th>
          <th className="px-3 py-2 text-left font-medium border-b border-gray-100">Tamaño</th>
          <th className="px-3 py-2 text-left font-medium border-b border-gray-100">Scores</th>
          <th className="px-3 py-2 text-left font-medium border-b border-gray-100">Empaque / Etiquetas</th>
          <th className="px-3 py-2 text-left font-medium border-b border-gray-100">Países</th>
          <th className="px-3 py-2 text-right font-medium border-b border-gray-100">Precio/u</th>
          <th className="px-3 py-2 text-right font-medium border-b border-gray-100">Cant. / Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ product: p, quantity }) => {
          const subtotal = p.price * quantity;
          return (
            <tr key={p.id || p.sku} className="border-b border-gray-100 hover:bg-blue-50/30 align-top">

              {/* Producto: imagen + nombre + sku */}
              <td className="px-3 py-2">
                <div className="flex items-start gap-2">
                  <div className="relative size-9 rounded overflow-hidden bg-gray-100 shrink-0 mt-0.5">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="36px" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 leading-tight">{p.name}</p>
                    <p className="font-mono text-gray-400 text-[10px] select-all mt-0.5">{p.sku}</p>
                    {p.description && (
                      <p className="text-gray-400 text-[10px] mt-0.5 line-clamp-2 max-w-[180px]">{p.description}</p>
                    )}
                  </div>
                </div>
              </td>

              {/* Marca / Categoría */}
              <td className="px-3 py-2">
                <p className="font-medium text-gray-800">{p.brand || "—"}</p>
                <p className="text-gray-400 capitalize mt-0.5">{p.category || "—"}</p>
              </td>

              {/* Tamaño */}
              <td className="px-3 py-2">
                <p className="text-gray-700">{p.productQuantity || "—"}</p>
                <p className="text-gray-400 mt-0.5">por {p.servingSize || "—"}</p>
              </td>

              {/* Scores: Nutri + Eco + NOVA */}
              <td className="px-3 py-2">
                <div className="flex gap-2 flex-wrap">
                  <ScoreBadge label="Nutri" value={p.nutriScore} cls={NUTRI_CLS[p.nutriScore]} />
                  <ScoreBadge label="Eco" value={p.ecoScore} cls={NUTRI_CLS[p.ecoScore]} />
                  {p.novaGroup && (
                    <span className="inline-flex flex-col items-center leading-none">
                      <span className="text-[9px] text-gray-400 uppercase mb-0.5">NOVA</span>
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-gray-200 text-gray-700">
                        {p.novaGroup}·{NOVA_LABEL[p.novaGroup]}
                      </span>
                    </span>
                  )}
                </div>
              </td>

              {/* Empaque / Etiquetas */}
              <td className="px-3 py-2 max-w-[140px]">
                <p className="text-gray-700 line-clamp-1">{p.packaging || "—"}</p>
                <p className="text-gray-400 line-clamp-2 mt-0.5">{p.labels || "—"}</p>
              </td>

              {/* Países */}
              <td className="px-3 py-2 max-w-[120px]">
                <p className="text-gray-600 line-clamp-2">{p.countries || "—"}</p>
              </td>

              {/* Precio/u */}
              <td className="px-3 py-2 text-right whitespace-nowrap font-medium text-gray-800">
                ${fmt(p.price)}
              </td>

              {/* Cant + Subtotal */}
              <td className="px-3 py-2 text-right">
                <p className="text-gray-500">{quantity} u</p>
                <p className="font-bold text-gray-900 whitespace-nowrap">${fmt(subtotal)}</p>
              </td>

            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ── Order totals footer ─────────────────────────────────────── */
function OrderTotals({ total }) {
  const tax = total * 0.16;
  return (
    <div className="flex justify-end gap-6 px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-xs">
      <span className="text-gray-500">Subtotal <strong className="text-gray-800 ml-1">${fmt(total)}</strong></span>
      <span className="text-gray-500">IVA 16% <strong className="text-gray-800 ml-1">${fmt(tax)}</strong></span>
      <span className="font-semibold text-gray-700">Total <strong className="text-blue-700 text-sm ml-1">${fmt(total + tax)}</strong></span>
    </div>
  );
}

/* ── Order card ──────────────────────────────────────────────── */
function OrderCard({ order }) {
  const cfg = STATUS[order.status] ?? STATUS["Procesando"];
  const StatusIcon = cfg.icon;
  const date = new Date(order.createdAt);
  const tax = order.total * 0.16;
  const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">

      {/* ── Header ── */}
      <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-2">

        {/* Status + ID */}
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
          <StatusIcon className="size-3" />
          {order.status}
        </span>

        <span className="font-mono text-xs text-gray-500 select-all">{order.id}</span>

        <span className="text-xs text-gray-400">
          {date.toLocaleDateString("es-MX", { day:"2-digit", month:"2-digit", year:"2-digit" })}
          {" "}
          {date.toLocaleTimeString("es-MX", { hour:"2-digit", minute:"2-digit", hour12: true })}
        </span>

        {/* Push right */}
        <div className="ml-auto flex items-center gap-4 text-xs text-gray-500">
          <span><Package className="size-3 inline mr-1" />{order.items.length} prod · {totalUnits} u</span>
          <span className="font-bold text-gray-900">Total: ${fmt(order.total + tax)}</span>
        </div>
      </div>

      {/* ── Customer / address / card ── */}
      <div className="px-4 py-2 flex flex-wrap gap-x-6 gap-y-1 bg-gray-50/60 border-b border-gray-100 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <User className="size-3 text-gray-400" />{order.customerName}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3 text-gray-400" />{order.address}
        </span>
        <span className="flex items-center gap-1">
          <CreditCard className="size-3 text-gray-400" />•••• {order.cardLast4}
        </span>
      </div>

      {/* ── Products ── */}
      <ProductTable items={order.items} />
      <OrderTotals total={order.total} />
    </div>
  );
}

/* ── Main client component ───────────────────────────────────── */
export default function OrdersClient({ seedOrders }) {
  const { orders } = useStore();
  const { isAuthenticated, ready } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isNew = searchParams.get("new") === "true";

  const allOrders = [...orders, ...seedOrders];

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {isNew && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-green-700">
          <CheckCircle className="size-5 shrink-0" />
          <div>
            <p className="font-semibold">¡Pedido confirmado!</p>
            <p className="text-sm">Tu pedido ha sido recibido y está siendo procesado.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="size-6 text-blue-700" />
          Mis Pedidos
        </h1>
        <span className="text-sm text-gray-400">
          {allOrders.length} {allOrders.length === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {allOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/">Continuar comprando</Link>
        </Button>
      </div>
    </div>
  );
}
