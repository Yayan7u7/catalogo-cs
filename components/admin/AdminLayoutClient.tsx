"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/admin/LoginForm";
import { checkSessionAction, logoutAction } from "@/app/actions/auth";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const checkSession = async () => {
    try {
      const isAuth = await checkSessionAction();
      setIsAuthenticated(isAuth);
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await logoutAction();
      setIsAuthenticated(false);
      router.push("/admin");
    } catch (e) {
      console.error(e);
    }
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex gap-2">
          <div
            className="w-2.5 h-2.5 bg-[#C5A55A]/40 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2.5 h-2.5 bg-[#C5A55A]/40 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2.5 h-2.5 bg-[#C5A55A]/40 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-black text-white font-body overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="w-72 border-r border-zinc-800 bg-[#050505] flex flex-col hidden md:flex shrink-0">
        <div className="p-8 border-b border-zinc-800 flex flex-col items-center">
          <div className="w-16 h-16 relative mb-4">
            <Image src="/logo-icono.webp" alt="Logo" fill className="object-contain" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#C5A55A] uppercase">
            Panel Admin
          </p>
        </div>
        <nav className="flex-1 py-8 flex flex-col gap-2 px-4">
          <Link
            href="/admin/modelos"
            className={`flex items-center gap-4 px-6 py-4 text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${
              isActive("/admin/modelos")
                ? "text-black bg-[#C5A55A]"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            Modelos
          </Link>
          <Link
            href="/admin/jefes"
            className={`flex items-center gap-4 px-6 py-4 text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${
              isActive("/admin/jefes")
                ? "text-black bg-[#C5A55A]"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            Jefes
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <p className="text-[10px] text-zinc-500 mb-3 px-2 truncate text-center">
            admin@colombiasexys.com
          </p>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-none bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300"
          >
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400">
              Salir
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 border-b border-zinc-800 bg-[#050505]/95 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <div className="w-8 h-8 relative">
          <Image src="/logo-icono.webp" alt="Logo" fill className="object-contain" />
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#C5A55A] p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 inset-x-0 bg-[#050505] border-b border-zinc-800 z-30 py-4 px-4 flex flex-col gap-2 shadow-2xl"
          >
            <Link
              href="/admin/modelos"
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 text-left text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
                isActive("/admin/modelos")
                  ? "text-[#C5A55A] bg-zinc-900/50"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Modelos
            </Link>
            <Link
              href="/admin/jefes"
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 text-left text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
                isActive("/admin/jefes")
                  ? "text-[#C5A55A] bg-zinc-900/50"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Jefes
            </Link>
            <div className="mt-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full px-4 py-3 text-left text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white"
              >
                Cerrar Sesion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-black pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
