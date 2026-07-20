"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Filter, Megaphone, Send, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import {
  previewPromotion,
  sendPromotion,
} from "@/lib/actions/promotions";
import {
  PROMOTION_TONES,
  type PromotionFilters,
  type PromotionTone,
} from "@/lib/promotions";

const field = "w-full rounded-xl border border-zinc-800 bg-black px-3 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#C5A55A]";

export default function PromotionStudio() {
  const [offer, setOffer] = useState("");
  const [tone, setTone] = useState<PromotionTone>("coqueta");
  const [filters, setFilters] = useState<PromotionFilters>({ onlyWithTelegram: true });
  const [matched, setMatched] = useState<number | null>(null);
  const [sample, setSample] = useState<Array<{ id: string; name: string; membershipLevel?: string; servicesCount?: number }>>([]);
  const [isPending, startTransition] = useTransition();
  const payload = { offer: offer.trim(), tone, filters };

  function updateFilter<K extends keyof PromotionFilters>(key: K, value: PromotionFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function preview() {
    if (!offer.trim()) return toast.error("Escribe primero la oferta.");
    startTransition(async () => {
      try { const result = await previewPromotion(payload); setMatched(result.matched); setSample(result.sample); }
      catch (error) { toast.error(error instanceof Error ? error.message : "No se pudo calcular la audiencia."); }
    });
  }

  function send() {
    if (!offer.trim()) return toast.error("Escribe la oferta que quieres enviar.");
    startTransition(async () => {
      try { const result = await sendPromotion(payload); toast.success(`Oferta programada para ${result.queued} clientes.`); setMatched(result.queued); }
      catch (error) { toast.error(error instanceof Error ? error.message : "No se pudo enviar la oferta."); }
    });
  }

  return <div className="space-y-6">
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-[#C5A55A]/10 p-3 text-[#C5A55A]"><Megaphone size={21} /></span><div><h2 className="font-heading text-2xl">Define tu oferta</h2><p className="text-xs text-zinc-500">La promoción original se conservará en cada mensaje.</p></div></div>
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Oferta</label>
        <textarea value={offer} onChange={(e) => setOffer(e.target.value)} className={`${field} mt-2 min-h-32 resize-y`} maxLength={500} placeholder="Ejemplo: 2x1 el viernes de 3 a 6pm" />
        <div className="mt-5"><label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Estilo del mensaje</label><div className="mt-2 grid grid-cols-3 gap-2">{PROMOTION_TONES.map((item) => <button key={item} onClick={() => setTone(item)} className={`rounded-xl border px-3 py-3 text-xs capitalize transition-colors ${tone === item ? "border-[#C5A55A] bg-[#C5A55A]/10 text-[#E8D5A3]" : "border-zinc-800 text-zinc-500 hover:border-zinc-600"}`}>{item}</button>)}</div></div>
      </section>
      <section className="rounded-2xl border border-zinc-800 bg-[#0A0A0A] p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-[#C5A55A]/10 p-3 text-[#C5A55A]"><Filter size={21} /></span><div><h2 className="font-heading text-2xl">Elige la audiencia</h2><p className="text-xs text-zinc-500">Los filtros se combinan para afinar el envío.</p></div></div>
        <div className="space-y-4">
          <label className="block text-xs text-zinc-400">Nivel de membresía<select value={filters.membershipLevel ?? ""} onChange={(e) => updateFilter("membershipLevel", e.target.value || undefined)} className={`${field} mt-2`}><option value="">Todos los niveles</option><option value="vip">VIP</option><option value="premium">Premium</option><option value="regular">Regular</option></select></label>
          <label className="block text-xs text-zinc-400">Mínimo de servicios previos<input type="number" min="0" value={filters.minimumServices ?? ""} onChange={(e) => updateFilter("minimumServices", e.target.value === "" ? undefined : Number(e.target.value))} className={`${field} mt-2`} placeholder="Sin mínimo" /></label>
          <label className="block text-xs text-zinc-400">Días sin solicitar servicio<input type="number" min="0" value={filters.inactiveDays ?? ""} onChange={(e) => updateFilter("inactiveDays", e.target.value === "" ? undefined : Number(e.target.value))} className={`${field} mt-2`} placeholder="Ejemplo: 30" /></label>
          <label className="flex items-center gap-3 text-sm text-zinc-300"><input type="checkbox" checked={filters.onlyWithTelegram ?? false} onChange={(e) => updateFilter("onlyWithTelegram", e.target.checked)} className="h-4 w-4 accent-[#C5A55A]" />Solo clientes contactables por Telegram</label>
        </div>
      </section>
    </div>
    <section className="rounded-2xl border border-[#C5A55A]/30 bg-[#C5A55A]/5 p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A55A]"><Sparkles size={15} /> Mensajes personalizados con IA</p><p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">La IA redactará una versión única para cada cliente, manteniendo intacta la oferta que escribiste y el tono seleccionado.</p></div><div className="text-right"><p className="text-xs text-zinc-500">Audiencia estimada</p><p className="mt-1 flex items-center justify-end gap-2 font-heading text-3xl text-white"><Users size={20} className="text-[#C5A55A]" />{matched ?? "—"}</p></div></div>{sample.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{sample.map((client) => <span key={client.id} className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">{client.name}</span>)}</div>}<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={preview} disabled={isPending} className="rounded-xl border border-[#C5A55A] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#C5A55A] hover:bg-[#C5A55A]/10 disabled:opacity-50">{isPending ? "Calculando..." : "Ver audiencia"}</button><button onClick={send} disabled={isPending || !offer.trim()} className="flex items-center justify-center gap-2 rounded-xl bg-[#C5A55A] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"><Send size={16} />Enviar oferta</button></div></section>
    {matched !== null && <p className="flex items-center gap-2 text-xs text-zinc-500"><CheckCircle2 size={15} className="text-[#C5A55A]" />La audiencia se actualizará automáticamente al momento de enviar.</p>}
  </div>;
}
