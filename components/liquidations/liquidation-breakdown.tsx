import { formatCurrency } from "@/lib/calculations";

interface Props {
  cut: any;
}

export default function LiquidationBreakdown({ cut }: Props) {
  if (!cut) return null;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-md">
      <h3 className="text-lg font-semibold font-serif text-zinc-100 mb-6">
        Desglose de Liquidación
      </h3>

      <div className="space-y-4">
        <Row label="Venta Total" value={cut.ventaTotal} />
        
        {cut.promocionTotal > 0 && (
          <Row label="Promociones (+$300)" value={cut.promocionTotal} green />
        )}

        <div className="h-px bg-zinc-800 my-2" />

        <Row label="Comisión Empresa" value={-cut.baseComision} red />
        <Row label="Pagos con Tarjeta" value={-cut.ventaTarjetaTotal} red />
        <Row label="Extras (Porcentaje)" value={-cut.extrasCalculados} red />
        <Row label="Membresías Usadas" value={-cut.membresiaTotal} red />
        
        {cut.descuentoTransporteTotal > 0 && (
          <Row label="Transporte / Uber" value={-cut.descuentoTransporteTotal} red />
        )}
        
        {cut.multasTotal > 0 && (
          <Row label="Multas" value={-cut.multasTotal} red />
        )}
      </div>

      <div
        className={`mt-8 border rounded-2xl p-6 flex justify-between items-center ${
          cut.isPositive
            ? "bg-brand-gold/10 border-brand-gold/20"
            : "bg-red-500/10 border-red-500/20"
        }`}
      >
        <span
          className={`font-semibold uppercase tracking-wider text-sm ${
            cut.isPositive ? "text-brand-gold" : "text-red-400"
          }`}
        >
          {cut.isPositive ? "PAGAR A EMPLEADA" : "DEBE A OFICINA"}
        </span>

        <span
          className={`font-bold text-3xl ${
            cut.isPositive ? "text-brand-gold" : "text-red-400"
          }`}
        >
          {formatCurrency(Math.abs(cut.result))}
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  red,
  green,
}: {
  label: string;
  value: number;
  red?: boolean;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-zinc-400">{label}</span>
      <span
        className={`font-medium ${
          red ? "text-red-400" : green ? "text-green-400" : "text-zinc-100"
        }`}
      >
        {value < 0 ? "-" : ""}
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}