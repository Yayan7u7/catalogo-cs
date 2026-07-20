"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { ButtonHTMLAttributes, Dispatch, SetStateAction } from "react";
import { Banknote, Car, Check, CircleDollarSign, Clock3, MapPin, MessageCircle, Pencil, Repeat2, Search, Send, Smartphone, Star, UserRoundCheck, UserRoundX, X } from "lucide-react";
import { toast } from "sonner";
import ServiceStatusBadge from "@/components/services/service-status-badge";
import {
  chooseReturnTransport,
  changeTripTransport,
  confirmUberFare,
  decidePendingService,
  getServiceMessages,
  getJefeCashObligations,
  closeJefeCashObligation,
  registerJefeCashPayment,
  refreshJefeServices,
  sendServiceMessage,
  setEmployeeAvailability,
} from "@/lib/actions/jefe-panel";
import type { CashObligationSummary, ConversationMessage, Employee, Service, Trip } from "@/lib/types";

export default function TeamOperations({ initialEmployees, initialServices, initialCashSummary }: { initialEmployees: Employee[]; initialServices: Service[]; initialCashSummary: CashObligationSummary }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [services, setServices] = useState(initialServices);
  const [query, setQuery] = useState("");
  const [historyEmployeeId, setHistoryEmployeeId] = useState("all");
  const [tab, setTab] = useState<"equipo" | "activos" | "historial" | "efectivo">("equipo");
  const [cashSummary, setCashSummary] = useState(initialCashSummary);
  const [chatService, setChatService] = useState<Service | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [pending, startTransition] = useTransition();

  const visibleEmployees = useMemo(() => employees.filter((employee) => employee.nombreArtistico.toLowerCase().includes(query.toLowerCase())), [employees, query]);
  const active = services.filter((service) => ["pendiente", "en_curso"].includes(service.estado) || (service.estado === "finalizado" && service.estadoLiquidacion === "transporte_pendiente"));
  const history = services.filter((service) => ["cancelado"].includes(service.estado) || (service.estado === "finalizado" && service.estadoLiquidacion === "cerrada"));
  const filteredHistory = historyEmployeeId === "all" ? history : history.filter((service) => service.empleadaId === historyEmployeeId);

  async function reloadServices() {
    try { setServices(await refreshJefeServices()); } catch { toast.error("No se pudieron actualizar los servicios"); }
  }

  useEffect(() => {
    const source = new EventSource("/api/realtime/sse");
    source.onopen = () => {
      void reloadServices();
    };
    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "heartbeat") return;
        if (payload.type === "chat_message") {
          const message = payload.data as ConversationMessage;
          if (chatService?.id === message.servicioId) setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
        } else {
          void reloadServices();
        }
      } catch { /* La siguiente actualización válida reconciliará el estado. */ }
    };
    source.onerror = () => {
      console.warn("La conexión en tiempo real se interrumpió; se intentará reconectar.");
    };
    return () => source.close();
  }, [chatService?.id]);

  function toggleAvailability(employee: Employee) {
    startTransition(async () => {
      const next = !employee.disponible;
      const result = await setEmployeeAvailability(employee.id, next);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setEmployees((current) => current.map((item) => item.id === employee.id ? { ...item, disponible: next } : item));
      toast.success(next ? "Empleada marcada como disponible" : "Empleada marcada como no disponible");
    });
  }

  function decide(service: Service, decision: "aceptar" | "rechazar", transport: "chofer" | "uber" = "chofer") {
    startTransition(async () => {
      const result = await decidePendingService(service.id, decision, transport);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      await reloadServices();
      toast.success(decision === "aceptar" ? "Servicio aceptado" : "Servicio rechazado");
    });
  }

  async function openChat(service: Service) {
    setChatService(service);
    try { setMessages(await getServiceMessages(service.id)); } catch (error) { toast.error(error instanceof Error ? error.message : "No se pudo cargar el chat"); }
  }

  return <>
    <header className="mb-7"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C5A55A]">Operación diaria</p><h1 className="font-heading text-4xl font-semibold sm:text-5xl">Mi equipo</h1><p className="mt-2 text-sm text-zinc-500">Disponibilidad, servicios, transporte y conversaciones de tu equipo.</p></header>
    <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 sm:grid-cols-4">{([['equipo', 'Disponibilidad'], ['activos', `Activos (${active.length})`], ['historial', 'Historial'], ['efectivo', 'Efectivo']] as const).map(([value, label]) => <button key={value} onClick={() => setTab(value)} className={`rounded-lg px-2 py-3 text-[10px] font-semibold uppercase tracking-wider ${tab === value ? "bg-[#C5A55A] text-black" : "text-zinc-500 hover:text-white"}`}>{label}</button>)}</div>
    {tab === "historial" && <label className="mb-5 block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A55A]">Filtrar por empleada</span><select value={historyEmployeeId} onChange={(event) => setHistoryEmployeeId(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-[#C5A55A] sm:max-w-sm"><option value="all">Todas las empleadas</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.nombreArtistico}</option>)}</select></label>}
    {tab === "equipo" ? <section><label className="mb-5 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 focus-within:border-[#C5A55A]/70"><Search size={18} className="text-[#C5A55A]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar empleada" className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-zinc-600" /></label><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleEmployees.map((employee) => <article key={employee.id} className={`overflow-hidden rounded-2xl border bg-zinc-950 ${employee.disponible ? "border-[#C5A55A]/55" : "border-zinc-800"}`}><div className="h-36 bg-cover bg-center" style={employee.fotoPerfilUrl ? { backgroundImage: `linear-gradient(to top, #090909, transparent), url(${employee.fotoPerfilUrl})` } : { background: "linear-gradient(135deg,#18181b,#050505)" }} /><div className="p-5"><div className="mb-4 flex items-start justify-between"><div><h2 className="font-heading text-2xl font-semibold">{employee.nombreArtistico}</h2><p className="mt-1 flex items-center gap-1 text-xs text-zinc-500"><MapPin size={12} />{employee.ubicacionLat ? "Ubicación recibida" : "Sin ubicación"}</p><EmployeeRatingSummary employee={employee} /></div><span className={`h-3 w-3 rounded-full ${employee.disponible ? "bg-emerald-400" : "bg-zinc-700"}`} /></div><button disabled={pending} onClick={() => toggleAvailability(employee)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C5A55A] py-4 text-xs font-bold uppercase tracking-wider text-[#C5A55A] disabled:opacity-50">{employee.disponible ? <UserRoundX size={18} /> : <UserRoundCheck size={18} />}{employee.disponible ? "Marcar no disponible" : "Marcar disponible"}</button></div></article>)}</div></section> : tab === "efectivo" ? <CashDeliveryPanel summary={cashSummary} pending={pending} run={(action) => startTransition(async () => { const result = await action(); if (!result.success) { toast.error(result.error); return; } setCashSummary(await getJefeCashObligations()); toast.success("Entrega de efectivo registrada"); })} /> : <ServiceList services={tab === "activos" ? active : filteredHistory} active={tab === "activos"} disabled={pending} onDecide={decide} onChat={openChat} onRefresh={reloadServices} />}
    {chatService && <ChatPanel service={chatService} messages={messages} setMessages={setMessages} onClose={() => setChatService(null)} />}
  </>;
}

function CashDeliveryPanel({ summary, pending, run }: { summary: CashObligationSummary; pending: boolean; run: (action: () => Promise<{ success: boolean; error?: string }>) => void }) {
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const money = (value: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
  const groups = Object.values(summary.obligations.filter((item) => item.status === "pending").reduce<Record<string, typeof summary.obligations>>((result, item) => { (result[item.employeeId] ??= []).push(item); return result; }, {}));
  if (!groups.length) return <div className="rounded-2xl border border-dashed border-zinc-800 py-20 text-center text-sm text-zinc-500">No hay entregas de efectivo pendientes.</div>;
  return <section><header className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A55A]">Control de efectivo</p><h2 className="mt-1 font-heading text-3xl">Pendiente por entregar: {money(summary.total)}</h2></header><div className="grid gap-4 lg:grid-cols-2">{groups.map((obligations) => { const employeeId = obligations[0].employeeId; const employeeName = summary.employees.find((item) => item.id === employeeId)?.name || "Empleada"; const balance = obligations.reduce((sum, item) => sum + Number(item.amount) - Number(item.paidAmount), 0); const hasProvisional = obligations.some((item) => item.calculationStatus === "provisional"); return <article key={employeeId} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><div className="flex items-center justify-between gap-4"><div><p className="font-heading text-2xl">{employeeName}</p><p className="mt-1 text-xs text-zinc-500">{obligations.length} servicios pendientes</p></div><div className="flex items-center gap-2 text-[#E8D5A3]"><Banknote size={19}/><span className="font-heading text-2xl">{money(balance)}</span></div></div><div className="mt-4 space-y-2">{obligations.map((item) => <div key={item.id} className="rounded-xl border border-zinc-900 p-3 text-xs"><div className="grid grid-cols-[1fr_auto_auto] items-center gap-3"><span>Servicio {item.serviceId.slice(-6).toUpperCase()}</span><span>{money(Number(item.amount) - Number(item.paidAmount))}</span><button disabled={pending || item.calculationStatus !== "ready"} onClick={() => run(() => closeJefeCashObligation(item.id))} className="font-semibold text-[#C5A55A] disabled:text-zinc-700">Entregado</button></div><div className="mt-2 flex justify-between text-zinc-500"><span>Total cobrado: {money(Number(item.customerTotal))}</span><span>Ubers: -{money(Number(item.uberDeduction))}</span></div>{item.calculationStatus === "provisional" && <p className="mt-2 text-amber-400">Provisional: {item.pendingReason}</p>}</div>)}</div><div className="mt-4 flex gap-2"><input disabled={hasProvisional} value={amounts[employeeId] || ""} onChange={(event) => setAmounts({...amounts, [employeeId]: event.target.value})} inputMode="decimal" placeholder={hasProvisional ? "Confirma los Ubers pendientes" : "Monto recibido"} className="min-w-0 flex-1 rounded-xl border border-zinc-800 bg-black px-3 py-3 text-sm outline-none focus:border-[#C5A55A] disabled:text-zinc-700"/><button disabled={pending || hasProvisional} onClick={() => { const amount = Number(amounts[employeeId]); if (!Number.isFinite(amount) || amount <= 0) return toast.error("Ingresa un monto válido"); run(() => registerJefeCashPayment(employeeId, amount)); }} className="rounded-xl border border-[#C5A55A] px-4 text-xs font-semibold text-[#C5A55A] disabled:opacity-50">Registrar abono</button></div></article>; })}</div></section>;
}

function ServiceList({ services, active, disabled, onDecide, onChat, onRefresh }: { services: Service[]; active: boolean; disabled: boolean; onDecide: (service: Service, decision: "aceptar" | "rechazar", transport?: "chofer" | "uber") => void; onChat: (service: Service) => void; onRefresh: () => Promise<void> }) {
  if (!services.length) return <div className="rounded-2xl border border-dashed border-zinc-800 py-20 text-center text-sm text-zinc-500">No hay servicios en esta sección.</div>;
  return <div className="space-y-4">{services.map((service) => <article key={service.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-widest text-[#C5A55A]">Servicio {service.id.slice(-6).toUpperCase()}</p><h2 className="mt-1 font-heading text-2xl">{service.empleada?.nombreArtistico || "Empleada asignada"}</h2>{!active && service.empleada && <EmployeeRatingSummary employee={service.empleada} />}<p className="mt-1 text-xs text-zinc-500">{service.cliente?.nombreTelegram || "Cliente"} · {service.duracionPactadaHoras} horas</p></div><ServiceStatusBadge status={service.estado} /></div>{!active && <ServiceRating service={service} />}<div className="mt-5 flex flex-wrap gap-2">{active && service.estado === "pendiente" && <><ActionButton disabled={disabled} onClick={() => onDecide(service, "aceptar", "chofer")}><Check size={15} />Aceptar con chofer</ActionButton><ActionButton disabled={disabled} outline onClick={() => onDecide(service, "aceptar", "uber")}><Smartphone size={15} />Aceptar con Uber</ActionButton><ActionButton disabled={disabled} outline onClick={() => onDecide(service, "rechazar")}><X size={15} />Rechazar</ActionButton></>}{!active && <span className="flex items-center gap-1 text-xs text-zinc-500"><Clock3 size={14} />{new Date(service.updatedAt).toLocaleString("es-MX")}</span>}<ActionButton outline onClick={() => onChat(service)}><MessageCircle size={15} />Abrir chat</ActionButton></div>{active && <TransportPanel service={service} onRefresh={onRefresh} />}</article>)}</div>;
}

function EmployeeRatingSummary({ employee }: { employee: Employee }) {
  if (employee.promedioCalificacion == null) return <p className="mt-2 text-xs text-zinc-500">Sin valoraciones</p>;
  return <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400"><Star size={13} className="fill-[#C5A55A] text-[#C5A55A]" /><span className="font-semibold text-[#E8D5A3]">{Number(employee.promedioCalificacion).toFixed(2)}</span><span>{employee.totalServiciosValorados} {employee.totalServiciosValorados === 1 ? "servicio valorado" : "servicios valorados"}</span></p>;
}

function ServiceRating({ service }: { service: Service }) {
  return <div className="mt-5 rounded-xl border border-zinc-800 bg-black/60 p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Valoración del cliente</p>{service.calificacion == null ? <p className="mt-2 text-sm text-zinc-500">Sin valoración</p> : <div className="mt-2 flex items-center gap-1" aria-label={`${service.calificacion} de 5 estrellas`}>{[1, 2, 3, 4, 5].map((value) => <Star key={value} size={18} className={value <= service.calificacion! ? "fill-[#C5A55A] text-[#C5A55A]" : "text-zinc-700"} />)}<span className="ml-2 text-sm font-semibold text-[#E8D5A3]">{service.calificacion}/5</span></div>}{service.comentariosCalificacion && <blockquote className="mt-3 border-l-2 border-[#C5A55A]/60 pl-3 text-sm leading-relaxed text-zinc-300">{service.comentariosCalificacion}</blockquote>}</div>;
}

function TransportPanel({ service, onRefresh }: { service: Service; onRefresh: () => Promise<void> }) {
  const trips = service.viajes || [];
  async function run(action: () => Promise<{ success: boolean; error?: string }>, success: string): Promise<void> { const result = await action(); if (!result.success) { toast.error(result.error); return; } toast.success(success); await onRefresh(); }
  return <section className="mt-6 space-y-4 border-t border-zinc-800 pt-6"><header><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A55A]">Transporte del servicio</p><p className="mt-1 text-sm text-zinc-500">Gestiona por separado los viajes de ida y regreso.</p></header><div className="grid gap-4 xl:grid-cols-2">{trips.map((trip) => <TripCard key={trip.id} trip={trip} onRefresh={onRefresh} onRun={run} />)}</div>{service.estadoLiquidacion === "transporte_pendiente" && !trips.some((trip) => trip.tipo === "regreso") && <div className="rounded-xl border border-[#C5A55A]/35 bg-[#C5A55A]/5 p-4"><p className="text-sm font-semibold text-[#E8D5A3]">Transporte de regreso pendiente</p><p className="mt-1 text-xs text-zinc-500">Selecciona cómo regresará la empleada al finalizar el servicio.</p><div className="mt-4 flex flex-wrap gap-2"><ActionButton onClick={() => run(() => chooseReturnTransport(service.id, "chofer"), "Chofer solicitado")}>Regreso con chofer</ActionButton><ActionButton outline onClick={() => run(() => chooseReturnTransport(service.id, "uber"), "Uber seleccionado")}>Regreso con Uber</ActionButton></div></div>}</section>;
}

function TripCard({ trip, onRefresh, onRun }: { trip: Trip; onRefresh: () => Promise<void>; onRun: (action: () => Promise<{ success: boolean; error?: string }>, success: string) => Promise<void> }) {
  const canChangeTransport = !trip.choferId && ["notificado", "aceptado", "llegado"].includes(trip.estado);
  const changeButton = canChangeTransport && <button type="button" onClick={() => onRun(() => changeTripTransport(trip.id, trip.proveedorTransporte === "uber" ? "chofer" : "uber"), "Método de transporte actualizado")} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#C5A55A] px-3 py-3 text-xs font-semibold text-[#C5A55A]"><Repeat2 size={15} />Cambiar a {trip.proveedorTransporte === "uber" ? "chofer" : "Uber"}</button>;
  return <article className="overflow-hidden rounded-xl border border-zinc-800 bg-black"><header className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3"><div className="flex items-center gap-2"><span className="rounded-lg bg-[#C5A55A]/10 p-2 text-[#C5A55A]"><Car size={17} /></span><div><p className="text-sm font-semibold capitalize">Viaje de {trip.tipo}</p><p className="text-[10px] uppercase tracking-wider text-zinc-600">{trip.proveedorTransporte}</p></div></div><span className="rounded-full border border-zinc-800 px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-400">{trip.estado}</span></header>{trip.proveedorTransporte === "uber" ? <div className="space-y-5 p-4"><div className={`rounded-lg border p-3 text-xs ${trip.telegramUberFileId ? "border-[#C5A55A]/40 bg-[#C5A55A]/5 text-[#E8D5A3]" : "border-zinc-800 text-zinc-500"}`}>{trip.telegramUberFileId ? "Captura de la empleada recibida" : "Esperando la captura del resumen del viaje"}</div><UberFareEditor trip={trip} onRefresh={onRefresh} />{changeButton}</div> : <div className="space-y-4 p-4"><p className="text-sm text-zinc-500">El viaje será gestionado por un chofer interno.</p>{changeButton}</div>}</article>;
}

function UberFareEditor({ trip, onRefresh }: { trip: Trip; onRefresh: () => Promise<void> }) {
  const storedFare = Number(trip.tarifa);
  const hasFare = Number.isFinite(storedFare) && storedFare > 0;
  const canEditFare = trip.estado !== "cancelado" && Boolean(trip.telegramUberFileId);
  const [editing, setEditing] = useState(!hasFare && canEditFare);
  const [fare, setFare] = useState(hasFare ? String(storedFare) : "");
  const [saving, setSaving] = useState(false);

  async function saveFare() {
    const amount = Number(fare);
    if (!Number.isFinite(amount) || amount <= 0) return toast.error("Ingresa una tarifa válida");
    setSaving(true);
    const result = await confirmUberFare(trip.id, amount);
    setSaving(false);
    if (!result.success) return toast.error(result.error);
    setEditing(false);
    toast.success(hasFare ? "Tarifa actualizada" : "Tarifa registrada");
    await onRefresh();
  }

  if (!editing && hasFare) return <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3"><div className="flex items-center gap-2"><CircleDollarSign size={18} className="text-[#C5A55A]" /><div><p className="text-[10px] uppercase tracking-wider text-zinc-500">Tarifa final</p><p className="font-heading text-xl text-[#E8D5A3]">${storedFare.toFixed(2)}</p></div></div>{canEditFare && <button type="button" onClick={() => { setFare(String(storedFare)); setEditing(true); }} className="inline-flex items-center gap-1 rounded-lg border border-[#C5A55A] px-3 py-2 text-xs font-semibold text-[#C5A55A]"><Pencil size={13} />Cambiar tarifa</button>}</div>;

  return <div className="space-y-2 border-t border-zinc-900 pt-4"><label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500" htmlFor={`fare-${trip.id}`}>Tarifa final del viaje de {trip.tipo}</label><div className="flex gap-2"><input id={`fare-${trip.id}`} value={fare} onChange={(event) => setFare(event.target.value)} inputMode="decimal" placeholder="0.00" className="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm outline-none focus:border-[#C5A55A]" /><button type="button" disabled={saving} onClick={saveFare} className="rounded-lg bg-[#C5A55A] px-4 py-3 text-xs font-semibold text-black disabled:opacity-50">{saving ? "Guardando" : "Guardar"}</button>{hasFare && <button type="button" disabled={saving} onClick={() => { setFare(String(storedFare)); setEditing(false); }} className="rounded-lg border border-zinc-800 px-3 py-3 text-xs text-zinc-400 disabled:opacity-50">Cancelar</button>}</div></div>;
}

function ChatPanel({ service, messages, setMessages, onClose }: { service: Service; messages: ConversationMessage[]; setMessages: Dispatch<SetStateAction<ConversationMessage[]>>; onClose: () => void }) {
  const [text, setText] = useState("");
  async function send() { const value = text.trim(); if (!value) return; const result = await sendServiceMessage(service.id, value); if (!result.success || !result.data) return toast.error(result.error); setMessages((current) => current.some((item) => item.id === result.data!.id) ? current : [...current, result.data!]); setText(""); }
  return <aside className="fixed inset-x-3 bottom-3 z-50 flex max-h-[75vh] flex-col rounded-2xl border border-[#C5A55A]/60 bg-[#050505] shadow-2xl md:left-auto md:right-6 md:w-[420px]"><header className="flex items-center justify-between border-b border-zinc-800 p-4"><div><p className="font-heading text-xl">Conversación</p><p className="text-xs text-zinc-500">{service.cliente?.nombreTelegram || "Cliente"}</p></div><button onClick={onClose} aria-label="Cerrar"><X size={19} /></button></header><div className="flex-1 space-y-3 overflow-y-auto p-4">{messages.length === 0 && <p className="py-10 text-center text-sm text-zinc-600">Todavía no hay mensajes.</p>}{messages.map((message) => <div key={message.id} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${message.emisor === "cliente" ? "bg-zinc-900 text-zinc-200" : "ml-auto bg-[#C5A55A] text-black"}`}><p>{message.mensaje}</p><time className="mt-1 block text-[10px] opacity-60">{new Date(message.enviadoAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</time></div>)}</div><div className="flex gap-2 border-t border-zinc-800 p-3"><textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }} maxLength={4000} placeholder="Escribe un mensaje" className="min-h-11 flex-1 resize-none rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm outline-none focus:border-[#C5A55A]" /><button onClick={send} className="rounded-xl bg-[#C5A55A] px-4 text-black" aria-label="Enviar"><Send size={18} /></button></div></aside>;
}

function ActionButton({ children, outline = false, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { outline?: boolean }) { return <button {...props} className={`inline-flex items-center gap-1 rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-50 ${outline ? "border border-[#C5A55A] text-[#C5A55A]" : "bg-[#C5A55A] text-black"}`}>{children}</button>; }
