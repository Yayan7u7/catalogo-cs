"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import LoginForm from "@/components/admin/LoginForm";

const AdminDashboard = dynamic(
  () => import("@/components/admin/AdminDashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-[#C5A55A]/40 rounded-full animate-pulse" />
          <div className="w-2.5 h-2.5 bg-[#C5A55A]/40 rounded-full animate-pulse delay-75" />
          <div className="w-2.5 h-2.5 bg-[#C5A55A]/40 rounded-full animate-pulse delay-150" />
        </div>
      </div>
    ),
  }
);

// En lugar de Firebase Auth, comprobamos el estado leyendo una API
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checking, setChecking] = useState(true);

  // Verificamos si existe sesion via API (la cual lee la cookie HttpOnly)
  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      setIsAuthenticated(false);
    } catch (e) {
      console.error(e);
    }
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
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-[#050505]"
      >
        <AdminDashboard onSignOut={handleSignOut} userEmail="Admin" />
      </motion.div>
    </AnimatePresence>
  );
}
