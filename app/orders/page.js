"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  Package, CheckCircle, Truck, Clock, ShoppingBag,
  Lock, ChevronDown, ChevronUp, Leaf, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

/* ── Status config ─────────────────────────────────────────── */
const STATUS = {
  Procesando: { icon: Clock,        cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  "En camino":{ icon: Truck,        cls: "bg-blue-100   text-blue-700   border-blue-200"  },
  Entregado:  { icon: CheckCircle,  cls: "bg-green-100  text-green-700  border-green-200" },
};

/* ── Score badges ───────────────────────────────────────────── */
const NUTRI_COLOR = { A:"bg-green-600", B:"bg-lime-500", C:"bg-yellow-400 text-gray-900",
                       D:"bg-orange-500", E:"bg-red-600" };
const ECO_COLOR   = { A:"bg-green-600", B:"bg-lime-500", C:"bg-yellow-400 text-gray-900",
                       D:"bg-orange-500", E:"bg-red-600" };
const NOVA_COLOR  = { "1":"bg-green-600","2":"bg-lime-500","3":"bg-orange-400","4":"bg-red-600" };
const NOVA_LABEL  = { "1":"Mín. procesado","2":"Ing. culinarios","3":"Procesado","4":"Ultra-procesado" };

function ScoreBadge({ label, value, colorMap }) {
  if (!value) return null;
  const color = colorMap[value] ?? "bg-gray-400";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white ${color}`}>
      {label} {value}
    </span>
  );
}

/* ── Detail row ─────────────────────────────────────────────── */
function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-36 shrink-0">{label}</span>
      <span className="text-xs text-gray-800 break-words min-w-0">{value}</span>
    </div>
  );
}

/* ── Single order item expanded ─────────────────────────────── */
function OrderItemDetail({ product, quantity }) {
  const [showIngredients, setShowIngredients] = useState(false);
  const subtotal = product.price * quantity;
  const ing = product.ingredients || "";

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
      {/* Header row */}
      <div className="flex gap-4 p-4 bg-white border-b border-gray-100">
        <div className="relative size-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 leading-snug">{product.name}</p>
          {product.brand && <p className="text-xs text-blue-600 mt-0.5">{product.brand}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <ScoreBadge label="Nutri" value={product.nutriScore} colorMap={NUTRI_COLOR} />
            <ScoreBadge label="Eco"   value={product.ecoScore}   colorMap={ECO_COLOR}   />
            {product.novaGroup && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white ${NOVA_COLOR[product.novaGroup] ?? "bg-gray-400"}`}>
                NOVA {product.novaGroup} · {NOVA_LABEL[product.novaGroup]}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm text-gray-500">x{quantity}</p>
          <p className="text-base font-bold text-gray-900">
            ${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400">${product.price}/u</p>
        </div>
      </div>

      {/* 15-field detail grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        <Row label="SKU / Código"       value={product.sku} />
        <Row label="ID"                  value={product.id} />
        <Row label="Nombre"              value={product.name} />
        <Row label="Descripción"         value={product.description} />
        <Row label="Marca"               value={product.brand} />
        <Row label="Categoría"           value={product.category} />
        <Row label="Cantidad del prod."  value={product.productQuantity} />
        <Row label="Porción recomendada" value={product.servingSize} />
        <Row label="Nutri-Score"         value={product.nutriScore ? `${product.nutriScore} (A=mejor, E=peor)` : null} />
        <Row label="Eco-Score"           value={product.ecoScore   ? `${product.ecoScore} (A=mejor, E=peor)` : null} />
        <Row label="Grupo NOVA"          value={product.novaGroup  ? `${product.novaGroup} – ${NOVA_LABEL[product.novaGroup]}` : null} />
        <Row label="Empaque"             value={product.packaging} />
        <Row label="Etiquetas"           value={product.labels} />
        <Row label="Países de venta"     value={product.countries} />
        <Row label="Tiendas"             value={product.stores} />

        {/* Ingredientes con toggle */}
        {ing && (
          <div className="sm:col-span-2 py-1.5 border-b border-gray-50">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-gray-400 w-36 shrink-0">Ingredientes</span>
              {ing.length > 180 && (
                <button
                  onClick={() => setShowIngredients((v) => !v)}
                  className="text-xs text-blue-500 hover:underline flex items-center gap-0.5"
                >
                  {showIngredients ? <><ChevronUp className="size-3"/>Ver menos</> : <><ChevronDown className="size-3"/>Ver más</>}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-800 break-words">
              {showIngredients || ing.length <= 180 ? ing : ing.slice(0, 180) + "…"}
            </p>
          </div>
        )}

        {/* Precios */}
        <div className="sm:col-span-2 mt-2 pt-2 flex flex-wrap gap-x-6 gap-y-1">
          <span className="text-xs text-gray-500">Unidades: <strong>{quantity}</strong></span>
          <span className="text-xs text-gray-500">Precio unitario: <strong>${product.price.toLocaleString("es-MX",{minimumFractionDigits:2})}</strong></span>
          <span className="text-xs text-gray-500">Subtotal línea: <strong>${subtotal.toLocaleString("es-MX",{minimumFractionDigits:2})}</strong></span>
        </div>
      </div>
    </div>
  );
}

/* ── Order card ─────────────────────────────────────────────── */
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS[order.status] ?? STATUS["Procesando"];
  const StatusIcon = cfg.icon;
  const date = new Date(order.createdAt);
  const tax = order.total * 0.16;
  const totalWithTax = order.total + tax;
  const totalUnits = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Order header */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold text-gray-900">{order.id}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {date.toLocaleDateString("es-MX", {
              year: "numeric", month: "long", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${cfg.cls}`}>
            <StatusIcon className="size-3.5" />{order.status}
          </span>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              ${totalWithTax.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400">IVA incluido</p>
          </div>
        </div>
      </div>

      {/* Compact item thumbnails */}
      <div className="px-6 py-3 flex items-center justify-between gap-4 border-b border-gray-50">
        <div className="flex gap-2 flex-wrap">
          {order.items.map(({ product, quantity }) => (
            <div key={product.id} className="relative size-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
              {quantity > 1 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
                  {quantity}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 shrink-0">
          <span>{order.items.length} prod. · {totalUnits} unid.</span>
          <span>•••• {order.cardLast4}</span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-blue-600 font-medium text-sm hover:underline"
          >
            {expanded ? <><ChevronUp className="size-4"/>Ocultar</> : <><ChevronDown className="size-4"/>Ver detalles</>}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 py-4 space-y-4">
          {/* Delivery info */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 bg-blue-50 rounded-lg px-4 py-3">
            <span>Destinatario: <strong>{order.customerName}</strong></span>
            <span>Dirección: <strong>{order.address}</strong></span>
            <span>Tarjeta: <strong>•••• {order.cardLast4}</strong></span>
          </div>

          {/* Product detail cards */}
          <div className="space-y-3">
            {order.items.map(({ product, quantity }) => (
              <OrderItemDetail key={product.id} product={product} quantity={quantity} />
            ))}
          </div>

          {/* Order totals */}
          <div className="bg-gray-50 rounded-xl p-4 max-w-xs ml-auto text-sm space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.total.toLocaleString("es-MX",{minimumFractionDigits:2})}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>IVA (16%)</span>
              <span>${tax.toLocaleString("es-MX",{minimumFractionDigits:2})}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span className="text-green-600 font-medium">Gratis</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t pt-1.5 text-base">
              <span>Total</span>
              <span>${totalWithTax.toLocaleString("es-MX",{minimumFractionDigits:2})}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main content ───────────────────────────────────────────── */
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isNew && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-green-700">
          <CheckCircle className="size-5 shrink-0" />
          <div>
            <p className="font-semibold">¡Pedido confirmado!</p>
            <p className="text-sm">Tu pedido ha sido recibido y está siendo procesado.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="size-6 text-blue-700" />
          Mis Pedidos
        </h1>
        <span className="text-sm text-gray-500">
          {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

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
