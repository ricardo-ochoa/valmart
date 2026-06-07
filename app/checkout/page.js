"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CreditCard, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, placeOrder } = useStore();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const tax = cartTotal * 0.16;
  const total = cartTotal + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No hay productos en el carrito</h2>
        <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white mt-4">
          <Link href="/">Ir a la tienda</Link>
        </Button>
      </div>
    );
  }

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.email.includes("@")) newErrors.email = "Email inválido";
    if (!form.address.trim()) newErrors.address = "La dirección es requerida";
    if (!form.city.trim()) newErrors.city = "La ciudad es requerida";
    if (form.cardNumber.replace(/\s/g, "").length < 16)
      newErrors.cardNumber = "Número de tarjeta inválido";
    if (!form.expiry.match(/^\d{2}\/\d{2}$/))
      newErrors.expiry = "Formato MM/AA";
    if (form.cvv.length < 3) newErrors.cvv = "CVV inválido";
    return newErrors;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setProcessing(true);
    await new Promise((res) => setTimeout(res, 1500));

    placeOrder(form);
    router.push("/orders?new=true");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/cart">
            <ArrowLeft className="size-4" />
            Volver al carrito
          </Link>
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Lock className="size-5 text-green-600" />
        Pago seguro
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Información de entrega</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre completo" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Juan Pérez" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="juan@email.com" />
              <div className="sm:col-span-2">
                <Field label="Dirección" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="Calle Principal 123, Col. Centro" />
              </div>
              <Field label="Ciudad" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="Ciudad de México" />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <CreditCard className="size-4 text-blue-600" />
              Datos de pago
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Entorno de prueba — no se realizará ningún cargo real.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Número de tarjeta" name="cardNumber" value={form.cardNumber} onChange={handleChange} error={errors.cardNumber} placeholder="1234 5678 9012 3456" />
              </div>
              <Field label="Vencimiento (MM/AA)" name="expiry" value={form.expiry} onChange={handleChange} error={errors.expiry} placeholder="12/28" />
              <Field label="CVV" name="cvv" value={form.cvv} onChange={handleChange} error={errors.cvv} placeholder="123" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={processing}
            className="w-full h-12 text-base bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-70"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando pago...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="size-4" />
                Confirmar pedido · ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            )}
          </Button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Tu pedido ({cart.length} {cart.length === 1 ? "producto" : "productos"})</h2>
            <div className="space-y-3 mb-4">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 items-center">
                  <div className="relative size-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-400">x{quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-1.5 text-sm">
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
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
