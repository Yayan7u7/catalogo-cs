import LiquidationCard from "@/components/liquidations/liquidation-card";
import PageHeader from "@/components/ui/page-header";
import { liquidations } from "@/data/liquidations";

export default function LiquidationsPage() {
  return (
    <>
      <PageHeader
        title="Liquidations"
        description="Employee settlements and payouts."
      />

      <div
        className="
        grid
        grid-cols-3
        gap-6
        "
      >
        {liquidations.map((item) => (
          <LiquidationCard
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </>
  );
}