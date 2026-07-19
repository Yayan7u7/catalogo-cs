import { formatCurrency, formatDateTime } from "@/lib/calculations";

interface Props {
  report: any;
  records: any[];
}

export default function CutComparison({ report, records }: Props) {
  if (!report) return null;

  const getSourceBadge = (rol: string) => {
    switch (rol) {
      case "jefe":
      case "admin":
      case "valeria":
        return <span className="bg-blue-900/30 text-blue-400 border border-blue-900/50 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold">Oficina</span>;
      case "empleada":
        return <span className="bg-pink-900/30 text-pink-400 border border-pink-900/50 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold">Empleada</span>;
      default:
        return <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold">Bot/Otro</span>;
    }
  };

  const hasMismatch = report.officeCut.result !== report.employeeCut.result;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-md">
      <div className="p-6 border-b border-zinc-800">
        <h3 className="text-lg font-semibold font-serif text-zinc-100">
          Comparativa de Cortes (Transparencia)
        </h3>
        <p className="text-sm text-zinc-500 mt-1">
          Compara los registros subidos por la oficina frente a los de la empleada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
        {/* Lado Oficina */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-semibold text-brand-gold">Registros Oficina</h4>
            <div className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full text-xs font-bold border border-brand-gold/20">
              {formatCurrency(report.officeCut.result)}
            </div>
          </div>
          
          <div className="space-y-3">
            {report.officeRecords.map((r: any, i: number) => (
              <div key={i} className={`p-3 rounded-xl border ${r.cancelado ? 'border-red-900/30 bg-red-900/5 opacity-50' : 'border-zinc-800 bg-zinc-900/50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">{formatDateTime(r.fecha)}</span>
                    {getSourceBadge(r.rol_registrador)}
                  </div>
                  <span className="font-bold text-sm text-zinc-200">
                    {r.cancelado ? 'Cancelado' : formatCurrency(r.total_servicio)}
                  </span>
                </div>
                <div className="text-sm text-zinc-400">
                  <span className="capitalize">{r.metodo_pago}</span> 
                  {r.metodo_pago === 'mixto' && ` (Ef: ${formatCurrency(r.monto_efectivo)} / Tj: ${formatCurrency(r.monto_tarjeta)})`}
                </div>
                {(r.gasto_transporte_empresa > 0 || r.excedente_transporte > 0) && (
                  <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    🚗 Uber: -{formatCurrency(Number(r.gasto_transporte_empresa) + Number(r.excedente_transporte))}
                  </div>
                )}
              </div>
            ))}
            {report.officeRecords.length === 0 && (
              <div className="text-sm text-zinc-600 italic text-center py-4">No hay registros de oficina</div>
            )}
          </div>
        </div>

        {/* Lado Empleada */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-semibold text-pink-400">Registros Empleada</h4>
            <div className="bg-pink-500/10 text-pink-400 px-3 py-1 rounded-full text-xs font-bold border border-pink-500/20">
              {formatCurrency(report.employeeCut.result)}
            </div>
          </div>
          
          <div className="space-y-3">
            {report.employeeRecords.map((r: any, i: number) => (
               <div key={i} className={`p-3 rounded-xl border ${r.cancelado ? 'border-red-900/30 bg-red-900/5 opacity-50' : 'border-zinc-800 bg-zinc-900/50'}`}>
               <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                   <span className="text-xs text-zinc-500">{formatDateTime(r.fecha)}</span>
                   {getSourceBadge(r.rol_registrador)}
                 </div>
                 <span className="font-bold text-sm text-zinc-200">
                   {r.cancelado ? 'Cancelado' : formatCurrency(r.total_servicio)}
                 </span>
               </div>
               <div className="text-sm text-zinc-400">
                 <span className="capitalize">{r.metodo_pago}</span> 
               </div>
               {(r.gasto_transporte_empresa > 0 || r.excedente_transporte > 0) && (
                 <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                   🚗 Uber: -{formatCurrency(Number(r.gasto_transporte_empresa) + Number(r.excedente_transporte))}
                 </div>
               )}
             </div>
            ))}
            {report.employeeRecords.length === 0 && (
              <div className="text-sm text-zinc-600 italic text-center py-4">No hay registros de empleada</div>
            )}
          </div>
        </div>
      </div>

      {hasMismatch && (
        <div className="bg-yellow-900/20 border-t border-yellow-900/50 p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h5 className="text-yellow-500 font-semibold text-sm">Discrepancia Detectada</h5>
            <p className="text-yellow-600/80 text-xs">Los registros de la oficina no coinciden con los de la empleada. Verifica los tickets faltantes.</p>
          </div>
        </div>
      )}
    </div>
  );
}
