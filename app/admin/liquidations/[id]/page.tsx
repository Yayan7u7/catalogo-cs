import { liquidations } from "@/data/liquidations";
import LiquidationBreakdown from "@/components/liquidations/liquidation-breakdown";
import PercentageSelector from "@/components/liquidations/percentage-selector";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const liquidation =
    liquidations.find(
      (x) => x.id === Number(id)
    );

  if (!liquidation) {
    return <div>Not found</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="
          text-5xl
          font-bold
          "
        >
          {liquidation.employee}
        </h1>

        <p className="text-zinc-500 mt-2">
          {liquidation.services} servicios
        </p>
      </div>

      <PercentageSelector
        selected={
          liquidation.percentage
        }
      />

      <LiquidationBreakdown
        sales={liquidation.sales}
        percentage={
          liquidation.percentage
        }
        cards={liquidation.cards}
        extras={liquidation.extras}
        transport={
          liquidation.transport
        }
      />
    </div>
  );
}