"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, Store, User, LogOut, ChevronDown, LogIn } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { cartCount } = useStore();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
        >
          <Store className="size-6" />
          <span>Valmart</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/orders"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Package className="size-4" />
            <span className="hidden sm:inline">Mis Pedidos</span>
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-900 text-xs font-bold rounded-full size-5 flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <span className="size-7 rounded-full bg-yellow-400 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0">
                  {user.initials}
                </span>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
                <ChevronDown
                  className={`size-3.5 hidden sm:block transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Sesión iniciada como</p>
                    <p className="text-sm font-semibold truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/15 hover:bg-white/25 transition-colors ml-1"
            >
              <LogIn className="size-4" />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
