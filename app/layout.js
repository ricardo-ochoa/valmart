import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Valmart — Tu tienda en línea",
  description: "Compra los mejores productos al mejor precio en Valmart.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <AuthProvider>
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-blue-900 text-blue-200 text-center text-sm py-4 mt-8">
            © 2026 Valmart. Todos los derechos reservados.
          </footer>
        </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
