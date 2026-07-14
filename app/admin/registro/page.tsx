"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  DollarSign, 
  Link as LinkIcon, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  Car, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  FileText,
  ToggleLeft,
  ToggleRight,
  ArrowRight
} from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createEmployeeAction, createDriverAction } from "./actions";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function RegistroPage() {
  const [activeTab, setActiveTab] = useState<"chofer" | "empleada">("empleada");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [createdInfo, setCreatedInfo] = useState<{ id: string; name: string } | null>(null);

  // Form states - Employee
  const [empEmail, setEmpEmail] = useState("");
  const [empPassword, setEmpPassword] = useState("");
  const [empTelegram, setEmpTelegram] = useState("");
  const [empNombreReal, setEmpNombreReal] = useState("");
  const [empNombreArt, setEmpNombreArt] = useState("");
  const [empSlug, setEmpSlug] = useState("");
  const [empFotoUrl, setEmpFotoUrl] = useState("");
  const [empDesc, setEmpDesc] = useState("");
  const [empPrecio, setEmpPrecio] = useState("");
  const [empDisponible, setEmpDisponible] = useState(true);
  const [empCatActivo, setEmpCatActivo] = useState(true);
  const [empLat, setEmpLat] = useState("");
  const [empLng, setEmpLng] = useState("");

  // Form states - Driver
  const [drvEmail, setDrvEmail] = useState("");
  const [drvPassword, setDrvPassword] = useState("");
  const [drvTelegram, setDrvTelegram] = useState("");
  const [drvNombre, setDrvNombre] = useState("");
  const [drvTelefono, setDrvTelefono] = useState("");
  const [drvDisponible, setDrvDisponible] = useState(true);
  const [drvLat, setDrvLat] = useState("");
  const [drvLng, setDrvLng] = useState("");

  // Auto-generate slug from artistic name
  useEffect(() => {
    if (activeTab === "empleada") {
      const generated = empNombreArt
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric except spaces/hyphens
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Collapse consecutive hyphens
      setEmpSlug(generated);
    }
  }, [empNombreArt, activeTab]);

  const resetForm = () => {
    setError(null);
    setSuccess(false);
    setCreatedInfo(null);
    if (activeTab === "empleada") {
      setEmpEmail("");
      setEmpPassword("");
      setEmpTelegram("");
      setEmpNombreReal("");
      setEmpNombreArt("");
      setEmpSlug("");
      setEmpFotoUrl("");
      setEmpDesc("");
      setEmpPrecio("");
      setEmpDisponible(true);
      setEmpCatActivo(true);
      setEmpLat("");
      setEmpLng("");
    } else {
      setDrvEmail("");
      setDrvPassword("");
      setDrvTelegram("");
      setDrvNombre("");
      setDrvTelefono("");
      setDrvDisponible(true);
      setDrvLat("");
      setDrvLng("");
    }
  };

  const handleRegisterEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!empEmail || !empPassword || !empNombreReal || !empNombreArt || !empSlug || !empPrecio) {
      setError("Por favor completa todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    const payload = {
      email: empEmail,
      password: empPassword,
      telegramChatId: empTelegram,
      nombreReal: empNombreReal,
      nombreArtistico: empNombreArt,
      slugCatalogo: empSlug,
      fotoPerfilUrl: empFotoUrl,
      descripcion: empDesc,
      precioBaseHora: Number(empPrecio),
      disponible: empDisponible,
      catalogoActivo: empCatActivo,
      ubicacionLat: empLat,
      ubicacionLng: empLng,
    };

    const res = await createEmployeeAction(payload);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setCreatedInfo({ id: res.data.id, name: empNombreArt });
    } else {
      setError(res.error);
    }
  };

  const handleRegisterDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!drvEmail || !drvPassword || !drvNombre || !drvTelefono) {
      setError("Por favor completa todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    const payload = {
      email: drvEmail,
      password: drvPassword,
      telegramChatId: drvTelegram,
      nombre: drvNombre,
      telefono: drvTelefono,
      disponible: drvDisponible,
      ubicacionLat: drvLat,
      ubicacionLng: drvLng,
    };

    const res = await createDriverAction(payload);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setCreatedInfo({ id: res.data.id, name: drvNombre });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Registro de Personal"
        description="Agrega nuevos choferes o empleadas al sistema y regístralos en la base de datos."
      />

      {/* Tabs */}
      <div className="flex gap-4 p-1.5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl w-fit">
        <button
          onClick={() => {
            if (!loading) {
              setActiveTab("empleada");
              setError(null);
              setSuccess(false);
            }
          }}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeTab === "empleada"
              ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
          }`}
        >
          <Sparkles size={16} />
          Empleada / Repostería
        </button>
        <button
          onClick={() => {
            if (!loading) {
              setActiveTab("chofer");
              setError(null);
              setSuccess(false);
            }
          }}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeTab === "chofer"
              ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
          }`}
        >
          <Car size={16} />
          Chofer / Reparto
        </button>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <Card className="border-[#D4AF37]/30 bg-zinc-950/40 backdrop-blur-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
              <CardContent className="flex flex-col items-center justify-center text-center p-12">
                <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mb-6 ring-4 ring-[#D4AF37]/5">
                  <CheckCircle2 size={32} />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  ¡Registro Exitoso!
                </CardTitle>
                <CardDescription className="text-zinc-400 max-w-md mb-8">
                  El perfil de <strong className="text-[#D4AF37]">{createdInfo?.name}</strong> con rol de{" "}
                  <strong>{activeTab === "empleada" ? "empleada" : "chofer"}</strong> ha sido agregado
                  correctamente en la base de datos.
                </CardDescription>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={resetForm}
                    className="bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold h-10 px-6"
                  >
                    Registrar otro
                  </Button>
                  <Link href={activeTab === "empleada" ? "/employees" : "/drivers"}>
                    <Button
                      variant="outline"
                      className="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white h-10 px-6"
                    >
                      Ver todos los {activeTab === "empleada" ? "empleados" : "choferes"}
                      <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === "empleada" ? (
              // Formulario Empleada
              <form onSubmit={handleRegisterEmployee}>
                <Card className="border-zinc-800 bg-zinc-950/40 backdrop-blur-md">
                  <CardHeader className="border-b border-zinc-800/80 pb-6">
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles size={20} className="text-[#D4AF37]" />
                      Detalles de la Empleada
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Crea un perfil profesional para el catálogo y sistema de reservación.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {error && (
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm">
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Columna 1: Credenciales y Telegram */}
                      <div className="space-y-5">
                        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">
                          1. Cuenta e Identificación
                        </h3>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-email">
                            Correo Electrónico <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <Mail size={16} className="text-zinc-500" />
                            <input
                              id="emp-email"
                              type="email"
                              placeholder="nombre@pasteleria.com"
                              value={empEmail}
                              onChange={(e) => setEmpEmail(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-password">
                            Contraseña <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <Lock size={16} className="text-zinc-500" />
                            <input
                              id="emp-password"
                              type="password"
                              placeholder="Mínimo 6 caracteres"
                              value={empPassword}
                              onChange={(e) => setEmpPassword(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-telegram">
                            Chat ID Telegram <span className="text-zinc-500 text-[10px]">(Opcional)</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <Send size={16} className="text-zinc-500" />
                            <input
                              id="emp-telegram"
                              type="text"
                              placeholder="Ej. 123456789"
                              value={empTelegram}
                              onChange={(e) => setEmpTelegram(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                            />
                          </div>
                        </div>

                        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider pt-3">
                          2. Ubicación y Estado
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-lat">
                              Latitud
                            </label>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                              <MapPin size={16} className="text-zinc-500" />
                              <input
                                id="emp-lat"
                                type="text"
                                placeholder="19.4326"
                                value={empLat}
                                onChange={(e) => setEmpLat(e.target.value)}
                                className="bg-transparent text-sm text-white outline-none w-full h-8"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-lng">
                              Longitud
                            </label>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                              <MapPin size={16} className="text-zinc-500" />
                              <input
                                id="emp-lng"
                                type="text"
                                placeholder="-99.1332"
                                value={empLng}
                                onChange={(e) => setEmpLng(e.target.value)}
                                className="bg-transparent text-sm text-white outline-none w-full h-8"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Switches */}
                        <div className="flex gap-6 pt-2">
                          <button
                            type="button"
                            onClick={() => setEmpDisponible(!empDisponible)}
                            className="flex items-center gap-2.5 text-sm text-zinc-300 hover:text-white transition-colors"
                          >
                            {empDisponible ? (
                              <ToggleRight size={28} className="text-[#D4AF37]" />
                            ) : (
                              <ToggleLeft size={28} className="text-zinc-600" />
                            )}
                            Disponible
                          </button>

                          <button
                            type="button"
                            onClick={() => setEmpCatActivo(!empCatActivo)}
                            className="flex items-center gap-2.5 text-sm text-zinc-300 hover:text-white transition-colors"
                          >
                            {empCatActivo ? (
                              <ToggleRight size={28} className="text-[#D4AF37]" />
                            ) : (
                              <ToggleLeft size={28} className="text-zinc-600" />
                            )}
                            Catálogo Activo
                          </button>
                        </div>
                      </div>

                      {/* Columna 2: Detalles Personales/Catálogo */}
                      <div className="space-y-5">
                        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">
                          3. Datos del Perfil
                        </h3>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-nombreReal">
                            Nombre Completo <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <User size={16} className="text-zinc-500" />
                            <input
                              id="emp-nombreReal"
                              type="text"
                              placeholder="Ej. Ana María Gómez"
                              value={empNombreReal}
                              onChange={(e) => setEmpNombreReal(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-nombreArt">
                            Nombre Artístico <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <Sparkles size={16} className="text-zinc-500" />
                            <input
                              id="emp-nombreArt"
                              type="text"
                              placeholder="Ej. Chef Ana"
                              value={empNombreArt}
                              onChange={(e) => setEmpNombreArt(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-slug">
                            Slug Catálogo <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <LinkIcon size={16} className="text-zinc-500" />
                            <input
                              id="emp-slug"
                              type="text"
                              placeholder="ej-chef-ana"
                              value={empSlug}
                              onChange={(e) => setEmpSlug(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8 font-mono text-zinc-300"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-precio">
                            Precio Base por Hora <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <DollarSign size={16} className="text-zinc-500" />
                            <input
                              id="emp-precio"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Ej. 150.00"
                              value={empPrecio}
                              onChange={(e) => setEmpPrecio(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-foto">
                            URL Foto de Perfil <span className="text-zinc-500 text-[10px]">(Opcional)</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <ImageIcon size={16} className="text-zinc-500" />
                            <input
                              id="emp-foto"
                              type="url"
                              placeholder="https://..."
                              value={empFotoUrl}
                              onChange={(e) => setEmpFotoUrl(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="emp-desc">
                        Descripción <span className="text-zinc-500 text-[10px]">(Opcional)</span>
                      </label>
                      <div className="flex gap-2 px-3 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                        <FileText size={16} className="text-zinc-500 mt-0.5 shrink-0" />
                        <textarea
                          id="emp-desc"
                          placeholder="Breve reseña sobre la especialidad de la empleada..."
                          value={empDesc}
                          onChange={(e) => setEmpDesc(e.target.value)}
                          className="bg-transparent text-sm text-white outline-none w-full min-h-[100px] resize-y"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-zinc-800/80 bg-zinc-900/20 p-6 flex justify-end gap-3 rounded-b-xl">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={loading}
                      className="border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    >
                      Limpiar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold min-w-[140px]"
                    >
                      {loading ? (
                        <span className="flex items-center gap-1.5">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Guardando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <UserPlus size={16} />
                          Guardar Empleada
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            ) : (
              // Formulario Chofer
              <form onSubmit={handleRegisterDriver}>
                <Card className="border-zinc-800 bg-zinc-950/40 backdrop-blur-md">
                  <CardHeader className="border-b border-zinc-800/80 pb-6">
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                      <Car size={20} className="text-[#D4AF37]" />
                      Detalles del Chofer
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Crea un perfil de chofer para coordinar repartos y entregas del local.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {error && (
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm">
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Columna 1: Cuenta y Seguridad */}
                      <div className="space-y-5">
                        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">
                          1. Cuenta de Acceso
                        </h3>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="drv-email">
                            Correo Electrónico <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <Mail size={16} className="text-zinc-500" />
                            <input
                              id="drv-email"
                              type="email"
                              placeholder="chofer@pasteleria.com"
                              value={drvEmail}
                              onChange={(e) => setDrvEmail(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="drv-password">
                            Contraseña <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <Lock size={16} className="text-zinc-500" />
                            <input
                              id="drv-password"
                              type="password"
                              placeholder="Mínimo 6 caracteres"
                              value={drvPassword}
                              onChange={(e) => setDrvPassword(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="drv-telegram">
                            Chat ID Telegram <span className="text-zinc-500 text-[10px]">(Opcional)</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <Send size={16} className="text-zinc-500" />
                            <input
                              id="drv-telegram"
                              type="text"
                              placeholder="Ej. 987654321"
                              value={drvTelegram}
                              onChange={(e) => setDrvTelegram(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Columna 2: Datos Personales */}
                      <div className="space-y-5">
                        <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider">
                          2. Información Personal
                        </h3>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="drv-nombre">
                            Nombre Completo <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <User size={16} className="text-zinc-500" />
                            <input
                              id="drv-nombre"
                              type="text"
                              placeholder="Ej. Carlos Medina"
                              value={drvNombre}
                              onChange={(e) => setDrvNombre(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="drv-telefono">
                            Número de Teléfono <span className="text-[#D4AF37]">*</span>
                          </label>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                            <Phone size={16} className="text-zinc-500" />
                            <input
                              id="drv-telefono"
                              type="tel"
                              placeholder="Ej. +52 55 1234 5678"
                              value={drvTelefono}
                              onChange={(e) => setDrvTelefono(e.target.value)}
                              className="bg-transparent text-sm text-white outline-none w-full h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="drv-lat">
                              Latitud
                            </label>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                              <MapPin size={16} className="text-zinc-500" />
                              <input
                                id="drv-lat"
                                type="text"
                                placeholder="19.4326"
                                value={drvLat}
                                onChange={(e) => setDrvLat(e.target.value)}
                                className="bg-transparent text-sm text-white outline-none w-full h-8"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider" htmlFor="drv-lng">
                              Longitud
                            </label>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/20 transition-all duration-300">
                              <MapPin size={16} className="text-zinc-500" />
                              <input
                                id="drv-lng"
                                type="text"
                                placeholder="-99.1332"
                                value={drvLng}
                                onChange={(e) => setDrvLng(e.target.value)}
                                className="bg-transparent text-sm text-white outline-none w-full h-8"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setDrvDisponible(!drvDisponible)}
                            className="flex items-center gap-2.5 text-sm text-zinc-300 hover:text-white transition-colors"
                          >
                            {drvDisponible ? (
                              <ToggleRight size={28} className="text-[#D4AF37]" />
                            ) : (
                              <ToggleLeft size={28} className="text-zinc-600" />
                            )}
                            Disponible para Entregas
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-zinc-800/80 bg-zinc-900/20 p-6 flex justify-end gap-3 rounded-b-xl">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={loading}
                      className="border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    >
                      Limpiar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#D4AF37] hover:bg-[#b8952b] text-black font-semibold min-w-[140px]"
                    >
                      {loading ? (
                        <span className="flex items-center gap-1.5">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Guardando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <UserPlus size={16} />
                          Guardar Chofer
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
