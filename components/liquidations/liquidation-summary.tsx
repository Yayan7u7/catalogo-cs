import { DollarSign, Wallet, CreditCard, Activity, ArrowRightLeft } from "lucide-react";
import StatCard from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/calculations";

interface Props {
  cut: any;
  employeeName: string;
}

export default function LiquidationSummary({ cut, employeeName }: Props) {
  if (!cut) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-gold font-serif">
        Resumen: {employeeName}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Venta Total"
          value={formatCurrency(cut.ventaTotal)}
          icon={DollarSign}
        />
        <StatCard
          title={cut.isPositive ? "A Favor (Empleada)" : "Deuda (Oficina)"}
          value={formatCurrency(Math.abs(cut.result))}
          icon={Activity}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Efectivo"
          value={formatCurrency(cut.efectivoTotal)}
          icon={Wallet}
        />
        <StatCard
          title="Tarjeta"
          value={formatCurrency(cut.ventaTarjetaTotal)}
          icon={CreditCard}
        />
        <StatCard
          title="Membresía"
          value={formatCurrency(cut.membresiaTotal)}
          icon={ArrowRightLeft}
        />
      </div>
    </div>
  );
}

