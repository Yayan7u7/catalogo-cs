"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Modelo } from "@/types";

// Componente para particulas doradas flotantes
function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(25)].map((_, i) => {
        // Valores fijos para la generacion inicial (evita desajustes de hidratacion)
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 15 + 15;
        const delay = Math.random() * 5;
        const yOffset = -(Math.random() * 150 + 50);
        const xOffset = (Math.random() - 0.5) * 100;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#C5A55A]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: "0 0 10px rgba(197, 165, 90, 0.5)",
            }}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              y: [0, yOffset],
              x: [0, xOffset],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "linear",
              delay,
            }}
          />
        );
      })}
    </div>
  );
}

interface HeroProps {
  onViewCatalog: () => void;
  modelos?: Modelo[];
  onSelectModelo?: (m: Modelo) => void;
}

export default function Hero({ onViewCatalog, modelos, onSelectModelo }: HeroProps) {
  return (
    <section
      id="hero"
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-black"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          src="/Colombia-Slider-1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Capas de oscurecimiento y gradientes */}
      <div className="absolute inset-0 z-0 bg-black/30 sm:bg-black/50" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/30 sm:via-black/40 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-black/10 sm:via-black/20 to-transparent opacity-80" />
      <div
        className="absolute inset-0 z-0 opacity-20 sm:opacity-30 mix-blend-overlay"
        style={{
          background: "radial-gradient(circle at center, rgba(197, 165, 90, 0.2) 0%, transparent 60%)",
        }}
      />

      {/* Particulas animadas */}
      <GoldParticles />

      {/* Contenido Central */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center px-4 sm:px-8 max-w-4xl mx-auto w-full mt-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] lg:w-[550px] lg:h-[550px] relative">
            <Image
              src="/logo-vertical.webp"
              alt="Colombia Sexys"
              fill
              sizes="(max-width: 640px) 320px, (max-width: 1024px) 450px, 550px"
              className="object-contain scale-[1.6] md:scale-[1.8] drop-shadow-[0_0_25px_rgba(0,0,0,0.8)]"
              priority
            />
          </div>
        </motion.div>

        {/* Separador elegante */}
        <div className="flex items-center gap-4 w-full max-w-[200px] mb-8 opacity-60">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C5A55A]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#E8D5A3]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C5A55A]" />
        </div>

        {/* Subtitulo animado letra por letra (opcional, o fade simple) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-body text-sm sm:text-base lg:text-lg font-light text-zinc-300 leading-relaxed tracking-[0.2em] uppercase max-w-2xl mb-12 drop-shadow-lg"
        >
          El pináculo de la belleza colombiana
        </motion.p>

        {/* Boton Ultra-Premium Elegante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative group mt-4"
        >
          {/* Brillo sutil de fondo */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C5A55A]/40 to-[#E8D5A3]/40 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500" />
          
          <button
            onClick={onViewCatalog}
            className="relative flex items-center justify-center gap-3 bg-black/60 backdrop-blur-md border border-[#C5A55A]/50 text-white px-10 sm:px-14 py-4 rounded-full overflow-hidden transition-all duration-300 hover:border-[#C5A55A] hover:bg-black/80 shadow-lg shadow-black/50"
          >
            {/* Resplandor interior animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A55A]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <span className="relative z-10 text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-zinc-100 group-hover:text-[#E8D5A3] transition-colors duration-300 drop-shadow-md">
              Ver Catálogo
            </span>

            {/* Icono minimalista */}
            <svg
              className="relative z-10 w-4 h-4 text-zinc-300 group-hover:text-[#E8D5A3] transition-all duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>

        {/* Carrusel de Preview de Modelos */}
        {modelos && modelos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="w-full mt-12 sm:mt-16 mb-4"
          >
            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory customized-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 justify-start sm:justify-center">
              {modelos.slice(0, 5).map((m) => (
                <button
                  key={m._id}
                  onClick={() => onSelectModelo?.(m)}
                  className="relative flex-shrink-0 w-36 h-48 sm:w-48 sm:h-64 lg:w-56 lg:h-[300px] snap-center overflow-hidden rounded-xl border border-zinc-800 hover:border-[#C5A55A] transition-all duration-500 group cursor-pointer shadow-xl shadow-black/60"
                  aria-label={`Ver perfil de ${m.nombre}`}
                >
                  <Image
                    src={m.fotoPrincipal}
                    alt={m.nombre}
                    fill
                    sizes="(max-width: 640px) 144px, (max-width: 1024px) 192px, 224px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute bottom-4 inset-x-0 text-center text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-zinc-300 group-hover:text-[#E8D5A3] drop-shadow-md transition-colors duration-500">
                    {m.nombre}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Gradiente inferior para fusionar con el fondo negro del catalogo */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}
