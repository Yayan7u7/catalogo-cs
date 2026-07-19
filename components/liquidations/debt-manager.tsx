"use client";

import { useState, useEffect, useCallback } from "react";
import { getDeudas, createDeuda, deleteDeuda, addPagoToDeuda, deletePagoFromDeuda } from "@/app/admin/liquidations/actions";
import { formatCurrency, formatDateTime } from "@/lib/calculations";
import { Button } from "@/components/ui/button";

interface Props {
  employeeId: string;
  employeeName: string;
}

export default function DebtManager({ employeeId, employeeName }: Props) {
  const [deudas, setDeudas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [montoTotal, setMontoTotal] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [showPagoForm, setShowPagoForm] = useState<string | null>(null);
  const [pagoMonto, setPagoMonto] = useState("");
  const [pagoNota, setPagoNota] = useState("");

  const loadDeudas = useCallback(async () => {
    setLoading(true);
    const data = await getDeudas(employeeId);
    setDeudas(data);
    setLoading(false);
  }, [employeeId]);

  useEffect(() => {
    loadDeudas();
  }, [loadDeudas]);

  const handleCreate = async () => {
    if (!montoTotal || !descripcion) return;
    await createDeuda({
      uid_empleada: employeeId,
      monto_total: Number(montoTotal),
      descripcion,
    });
    setMontoTotal("");
    setDescripcion("");
    setShowForm(false);
    loadDeudas();
  };

  const handleAddPago = async (deudaId: string) => {
    if (!pagoMonto) return;
    await addPagoToDeuda(deudaId, {
      monto: Number(pagoMonto),
      nota: pagoNota,
    });
    setPagoMonto("");
    setPagoNota("");
    setShowPagoForm(null);
    loadDeudas();
  };

  const handleDeleteDeuda = async (id: string) => {
    if (confirm("¿Eliminar este préstamo/deuda permanentemente?")) {
      await deleteDeuda(id);
      loadDeudas();
    }
  };

  const handleDeletePago = async (deudaId: string, pagoId: string) => {
    if (confirm("¿Eliminar este pago?")) {
      await deletePagoFromDeuda(deudaId, pagoId);
      loadDeudas();
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-md">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold font-serif text-zinc-100">Préstamos y Deudas</h3>
          <p className="text-sm text-zinc-500 mt-1">Gestión de saldos a favor de la empresa para {employeeName}.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-brand-gold text-black hover:bg-brand-gold/80 rounded-full">
          + Nuevo Préstamo
        </Button>
      </div>

      {showForm && (
        <div className="p-6 bg-zinc-900/50 border-b border-zinc-800 flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs text-zinc-400 block mb-1">Monto Total ($)</label>
            <input
              type="number"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-brand-gold"
              value={montoTotal}
              onChange={(e) => setMontoTotal(e.target.value)}
              placeholder="Ej: 5000"
            />
          </div>
          <div className="flex-[2]">
            <label className="text-xs text-zinc-400 block mb-1">Concepto / Descripción</label>
            <input
              type="text"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:outline-none focus:border-brand-gold"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Préstamo para pasajes..."
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-zinc-700 hover:bg-zinc-800 text-zinc-300">
              Cancelar
            </Button>
            <Button onClick={handleCreate} className="bg-brand-gold text-black hover:bg-brand-gold/80">
              Guardar
            </Button>
          </div>
        </div>
      )}

      <div className="p-6">
        {loading ? (
          <p className="text-zinc-500 text-sm">Cargando...</p>
        ) : deudas.length === 0 ? (
          <p className="text-zinc-600 text-sm italic text-center py-4">No hay deudas activas para esta empleada.</p>
        ) : (
          <div className="space-y-6">
            {deudas.map((deuda) => {
              const totalPagado = (deuda.pagos || []).reduce((acc: number, p: any) => acc + (Number(p.monto) || 0), 0);
              const saldoRestante = Number(deuda.monto_total) - totalPagado;
              const isPagada = deuda.estado === "pagada" || saldoRestante <= 0;

              return (
                <div key={deuda._id} className={`border rounded-2xl p-6 ${isPagada ? "border-green-900/30 bg-green-900/5" : "border-zinc-800 bg-zinc-900/30"}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-zinc-200">{deuda.descripcion}</h4>
                      <p className="text-xs text-zinc-500">{formatDateTime(deuda.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-zinc-400">Total: {formatCurrency(deuda.monto_total)}</p>
                        <p className={`font-bold text-lg ${isPagada ? "text-green-400" : "text-brand-gold"}`}>
                          Resta: {formatCurrency(saldoRestante)}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteDeuda(deuda._id)} className="text-zinc-600 hover:text-red-400 text-xl">
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Lista de Pagos */}
                  <div className="space-y-2 mt-4 pl-4 border-l-2 border-zinc-800">
                    <h5 className="text-xs font-semibold text-zinc-500 uppercase">Historial de Pagos</h5>
                    {deuda.pagos?.length > 0 ? (
                      deuda.pagos.map((pago: any) => (
                        <div key={pago.id} className="flex justify-between items-center text-sm text-zinc-400 bg-zinc-950/50 p-2 rounded-lg">
                          <span>{formatDateTime(pago.fecha)} - {pago.nota || "Abono"}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-green-400">+{formatCurrency(pago.monto)}</span>
                            <button onClick={() => handleDeletePago(deuda._id, pago.id)} className="text-zinc-600 hover:text-red-400">×</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-600">No hay pagos registrados.</p>
                    )}
                  </div>

                  {!isPagada && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      {showPagoForm === deuda._id ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:border-brand-gold"
                            placeholder="Monto a abonar"
                            value={pagoMonto}
                            onChange={(e) => setPagoMonto(e.target.value)}
                          />
                          <input
                            type="text"
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:border-brand-gold"
                            placeholder="Nota (opcional)"
                            value={pagoNota}
                            onChange={(e) => setPagoNota(e.target.value)}
                          />
                          <Button size="sm" onClick={() => handleAddPago(deuda._id)} className="bg-green-600 text-white hover:bg-green-500">Abonar</Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowPagoForm(null)}>Cancelar</Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setShowPagoForm(deuda._id)} className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10">
                          + Registrar Abono
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
