"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  getModelos,
  createModelo,
  updateModelo,
  deleteModelo,
  type Modelo,
  type ModeloPayload,
} from "@/lib/api";
import ModelModal from "./ModelModal";

// ==============================================================
// ConfirmDialog — dialogo de confirmacion nativo
// ==============================================================

interface ConfirmDialogProps {
  title: string;
  description: string;
  labelConfirm?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  title,
  description,
  labelConfirm = "Eliminar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm bg-black border border-zinc-800 shadow-2xl"
      >
        <div className="px-8 pt-8 pb-6 border-b border-zinc-800/60">
          <p className="text-[10px] font-bold tracking-[0.2em] text-red-500 uppercase mb-3">Accion irreversible</p>
          <h3 className="font-heading text-xl font-semibold text-white tracking-tight leading-snug">{title}</h3>
          <p className="text-xs text-zinc-500 font-light mt-2 leading-relaxed">{description}</p>
        </div>
        <div className="flex">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 hover:text-white border-r border-zinc-800 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-red-500 hover:text-red-400 hover:bg-red-950/20 transition-colors duration-200"
          >
            {labelConfirm}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==============================================================
// AdminDashboard — componente principal con Sidebar
// ==============================================================

interface AdminDashboardProps {
  onSignOut?: () => void;
  userEmail?: string | null;
}

export default function AdminDashboard({ onSignOut, userEmail }: AdminDashboardProps) {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingModelo, setEditingModelo] = useState<Modelo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Modelo | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getModelos(false); // Obtener todas (visibles y ocultas)
      setModelos(data);
    } catch (err: any) {
      showNotification(`Error: ${err.message || "Error al cargar modelos"}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  };

  // ---- Handlers ----

  const handleSaveModelo = async (payload: ModeloPayload, id?: string) => {
    try {
      if (id) {
        await updateModelo(id, payload);
        showNotification("Modelo actualizada correctamente.", "success");
      } else {
        await createModelo(payload);
        showNotification("Modelo creada correctamente.", "success");
      }
      await fetchData();
    } catch (err: any) {
      showNotification(`Error: ${err.message || "No se pudo guardar."}`, "error");
      throw err;
    }
  };

  const confirmDeleteHandler = async (modelo: Modelo) => {
    setConfirmDelete(null);
    try {
      await deleteModelo(modelo._id);
      showNotification("Modelo eliminada.", "success");
      await fetchData();
    } catch (err: any) {
      showNotification(`Error: ${err.message || "No se pudo eliminar."}`, "error");
    }
  };

  const filtered = modelos.filter((m) =>
    m.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-black text-white font-body overflow-hidden">
      {/* Dialogo de confirmacion */}
      <AnimatePresence>
        {confirmDelete && (
          <ConfirmDialog
            key="confirm-delete"
            title={`Eliminar a "${confirmDelete.nombre}"`}
            description="Esta accion es permanente. El perfil y sus datos seran removidos del catalogo de inmediato. Las fotos en el storage deben borrarse manualmente si asi se desea."
            labelConfirm="Si, eliminar"
            onConfirm={() => confirmDeleteHandler(confirmDelete)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>

      {/* Modal de Modelo */}
      <AnimatePresence>
        {showModal && (
          <ModelModal
            modelo={editingModelo}
            onClose={() => {
              setShowModal(false);
              setEditingModelo(null);
            }}
            onSave={handleSaveModelo}
            showNotification={showNotification}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside className="w-72 border-r border-zinc-800 bg-[#050505] flex-col hidden md:flex shrink-0">
        <div className="p-8 border-b border-zinc-800 flex flex-col items-center">
          <div className="w-16 h-16 relative mb-4">
            <Image src="/logo-icono.webp" alt="Logo" fill className="object-contain" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#C5A55A] uppercase">
            Panel Admin
          </p>
        </div>
        <nav className="flex-1 py-8 flex flex-col gap-2 px-4">
          <div className="flex items-center gap-4 px-6 py-4 text-xs font-bold tracking-[0.15em] uppercase text-black bg-[#C5A55A]">
            Modelos
          </div>
        </nav>
        {onSignOut && (
          <div className="p-4 border-t border-zinc-800">
            {userEmail && (
              <p className="text-[10px] text-zinc-500 mb-3 px-2 truncate text-center">
                {userEmail}
              </p>
            )}
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-none bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300"
            >
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-400">
                Salir
              </span>
            </button>
          </div>
        )}
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
            <div className="px-4 py-3 text-left text-xs font-bold tracking-widest uppercase text-[#C5A55A] bg-zinc-900/50">
              Modelos
            </div>
            {onSignOut && (
              <div className="mt-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full px-4 py-3 text-left text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white"
                >
                  Cerrar Sesion
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-black pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
            <div>
              <h2 className="font-heading text-3xl font-semibold text-white tracking-wide">
                Directorio
              </h2>
              <p className="text-sm text-[#C5A55A]/80 font-light mt-1">
                Gestiona los perfiles y fotos de las modelos
              </p>
            </div>
            <button
              onClick={() => {
                setEditingModelo(null);
                setShowModal(true);
              }}
              className="bg-[#C5A55A] text-black font-bold text-[10px] tracking-[0.2em] uppercase px-6 py-3 transition-colors hover:bg-[#D4AF37]"
            >
              + Nueva Modelo
            </button>
          </div>

          <div className="relative mb-8 max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-700 text-white text-base py-3 pl-10 focus:border-[#C5A55A] focus:outline-none transition-colors placeholder:text-zinc-600"
            />
            <svg
              className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-500"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {loading ? (
            <div className="flex gap-2 py-24 justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#C5A55A]/50 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-zinc-800 border-dashed py-24 text-center">
              <p className="text-sm text-zinc-500 font-light">
                No hay modelos registradas o no coinciden con la busqueda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((modelo) => (
                <div
                  key={modelo._id}
                  className="bg-zinc-900/30 border border-zinc-800 group hover:border-zinc-700 transition-colors flex flex-col"
                >
                  <div className="aspect-[3/4] relative bg-black border-b border-zinc-800">
                    {modelo.fotoPrincipal ? (
                      <Image
                        src={modelo.fotoPrincipal}
                        alt={modelo.nombre}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                          Sin Foto
                        </span>
                      </div>
                    )}
                    {!modelo.disponible && (
                      <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 border border-zinc-700">
                        <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">
                          Oculta
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 border border-[#C5A55A]/30">
                      <span className="text-[9px] text-[#C5A55A] font-bold">
                        #{modelo.orden}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-heading text-lg font-semibold text-white mb-3">
                      {modelo.nombre}
                    </h3>
                    <div className="mt-auto flex gap-3 pt-3 border-t border-zinc-800/60">
                      <button
                        onClick={() => {
                          setEditingModelo(modelo);
                          setShowModal(true);
                        }}
                        className="text-[10px] font-bold tracking-widest text-[#E8D5A3] uppercase hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(modelo)}
                        className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase hover:text-red-400 transition-colors ml-auto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
