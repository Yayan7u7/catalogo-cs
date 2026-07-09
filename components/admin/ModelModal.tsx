"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import type { Modelo, ModeloPayload } from "@/lib/api";

const inputClass =
  "w-full bg-black border border-zinc-800 text-white text-sm font-medium px-4 py-3 transition-all duration-200 focus:border-[#C5A55A] placeholder:text-zinc-600 focus:outline-none";

interface ModelModalProps {
  modelo: Modelo | null;
  onClose: () => void;
  onSave: (payload: ModeloPayload, id?: string) => Promise<void>;
  showNotification: (msg: string, type: "success" | "error") => void;
}

export default function ModelModal({
  modelo,
  onClose,
  onSave,
  showNotification,
}: ModelModalProps) {
  const [form, setForm] = useState<ModeloPayload>(
    modelo
      ? {
          nombre: modelo.nombre,
          descripcion: modelo.descripcion,
          fotoPrincipal: modelo.fotoPrincipal,
          fotos: [...modelo.fotos],
          linkX: modelo.linkX,
          contactLink: modelo.contactLink,
          contactLabel: modelo.contactLabel,
          disponible: modelo.disponible,
        }
      : {
          nombre: "",
          descripcion: "",
          fotoPrincipal: "",
          fotos: [],
          linkX: "",
          contactLink: "",
          contactLabel: "Contacto",
          disponible: true,
        }
  );

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Helper para comprimir imagen
  const compressImage = async (file: File) => {
    return imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1080,
      useWebWorker: true,
    });
  };

  // Helper para subir a R2 a traves de la API route
  const uploadToR2 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Error al subir la imagen");
    }

    const data = await res.json();
    return data.url;
  };

  // Helper para eliminar de R2 a traves de la API route
  const deleteFromR2 = async (url: string) => {
    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch (error) {
      console.error("Error al eliminar imagen antigua:", error);
    }
  };

  const handleUploadPrincipal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const url = await uploadToR2(compressed);
      
      // Si habia una foto principal anterior y no esta en la galeria, intentar borrarla
      // Para simplificar, en este ejemplo asumimos que R2 maneja la basura o que no se borran automaticamente 
      // desde el UI para evitar romper fotos compartidas. Opcional: invocar deleteFromR2.

      setForm((prev) => ({ ...prev, fotoPrincipal: url }));
      showNotification("Foto principal subida con exito", "success");
    } catch (error: any) {
      showNotification(error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadGaleria = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (form.fotos.length + files.length > 5) {
      showNotification("No puedes subir mas de 5 fotos a la galeria", "error");
      return;
    }

    setUploading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i]);
        const url = await uploadToR2(compressed);
        urls.push(url);
      }
      setForm((prev) => ({ ...prev, fotos: [...prev.fotos, ...urls] }));
      showNotification(`${urls.length} foto(s) subida(s) con exito`, "success");
    } catch (error: any) {
      showNotification(error.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const removeFotoGaleria = (index: number) => {
    const fotoToRemove = form.fotos[index];
    // Opcional: deleteFromR2(fotoToRemove);
    setForm((prev) => {
      const newFotos = [...prev.fotos];
      newFotos.splice(index, 1);
      return { ...prev, fotos: newFotos };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      showNotification("El nombre es obligatorio.", "error");
      return;
    }
    if (!form.fotoPrincipal) {
      showNotification("La foto principal es obligatoria.", "error");
      return;
    }

    setSaving(true);
    try {
      await onSave(form, modelo?._id);
      onClose();
    } catch (error: any) {
      // El error ya se maneja en onSave
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && !saving && !uploading && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl bg-black border border-zinc-800 shadow-2xl my-auto"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/30">
          <div>
            <h2 className="text-xl font-heading font-semibold text-white tracking-wide">
              {modelo ? "Editar Modelo" : "Nueva Modelo"}
            </h2>
            <p className="text-xs text-zinc-500 font-light mt-1">
              Configura los datos del perfil y fotos (maximo 5 en galeria).
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving || uploading}
            className="text-zinc-600 hover:text-[#C5A55A] transition-colors disabled:opacity-40"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda: Datos */}
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[#C5A55A] uppercase mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Sofia Velez"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[#C5A55A] uppercase mb-2">
                  Descripcion
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Breve bio o descripcion del perfil..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#C5A55A] uppercase mb-2">
                    Link de Contacto
                  </label>
                  <input
                    type="url"
                    value={form.contactLink}
                    onChange={(e) => setForm({ ...form, contactLink: e.target.value })}
                    placeholder="https://wa.me/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#C5A55A] uppercase mb-2">
                    Etiqueta Boton
                  </label>
                  <input
                    type="text"
                    value={form.contactLabel}
                    onChange={(e) => setForm({ ...form, contactLabel: e.target.value })}
                    placeholder="WhatsApp"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[#C5A55A] uppercase mb-2">
                  Link de X (Twitter)
                </label>
                <input
                  type="url"
                  value={form.linkX}
                  onChange={(e) => setForm({ ...form, linkX: e.target.value })}
                  placeholder="https://x.com/..."
                  className={inputClass}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold tracking-widest text-[#C5A55A] uppercase mb-2">
                    Visibilidad
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, disponible: !form.disponible })}
                    className={`relative w-12 h-6 transition-colors duration-300 rounded-full ${
                      form.disponible ? "bg-[#C5A55A]" : "bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full transition-all duration-300 ${
                        form.disponible ? "left-7 bg-black" : "left-1 bg-zinc-500"
                      }`}
                    />
                  </button>
                  <span className="ml-3 text-xs text-zinc-400">
                    {form.disponible ? "Visible en catalogo" : "Oculta"}
                  </span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Fotos */}
            <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-zinc-800 pt-6 lg:pt-0 lg:pl-8">
              {/* Foto Principal */}
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[#C5A55A] uppercase mb-2">
                  Foto Principal *
                </label>
                <div className="flex gap-4 items-start">
                  <div className="w-28 h-36 bg-zinc-900 border border-zinc-800 relative flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {form.fotoPrincipal ? (
                      <Image src={form.fotoPrincipal} alt="Principal" fill className="object-cover" unoptimized />
                    ) : (
                      <span className="text-[10px] text-zinc-600 font-bold uppercase">Vacia</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="relative overflow-hidden inline-block">
                      <button type="button" className="bg-zinc-900 border border-zinc-700 hover:border-[#C5A55A] text-xs font-semibold px-4 py-2 uppercase tracking-wider transition-colors disabled:opacity-50">
                        {uploading ? "Subiendo..." : "Cambiar Foto"}
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleUploadPrincipal}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                      Esta foto se muestra en el catalogo y como la primera de la galeria. Recomendado: formato vertical.
                    </p>
                  </div>
                </div>
              </div>

              {/* Galeria (Max 5) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold tracking-widest text-[#C5A55A] uppercase">
                    Galeria ({form.fotos.length}/5)
                  </label>
                  {form.fotos.length < 5 && (
                    <div className="relative overflow-hidden">
                      <button type="button" className="text-[10px] text-white hover:text-[#C5A55A] font-bold uppercase tracking-wider transition-colors disabled:opacity-50">
                        + Anadir Fotos
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploading || form.fotos.length >= 5}
                        onChange={handleUploadGaleria}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {form.fotos.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    <AnimatePresence>
                      {form.fotos.map((url, i) => (
                        <motion.div
                          key={url}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="aspect-[3/4] relative border border-zinc-800 group"
                        >
                          <Image src={url} alt={`Galeria ${i}`} fill className="object-cover" unoptimized />
                          <button
                            type="button"
                            onClick={() => removeFotoGaleria(i)}
                            className="absolute top-1 right-1 bg-black/80 text-white p-1 rounded hover:bg-red-900/80 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="border border-dashed border-zinc-800 p-6 text-center">
                    <p className="text-xs text-zinc-500">Sin fotos adicionales en la galeria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-8 mt-8 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || uploading}
              className="flex-1 border border-zinc-800 text-zinc-400 font-bold text-xs tracking-[0.2em] uppercase py-4 hover:border-zinc-600 hover:text-white transition-all duration-300 disabled:opacity-40 bg-zinc-900/50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-[#C5A55A] text-black font-black text-xs tracking-[0.2em] uppercase py-4 hover:bg-[#D4AF37] transition-colors duration-300 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Perfil"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
