interface Props {
  sales: number;
  percentage: number;
  cards: number;
  extras: number;
  transport: number;
}

export default function LiquidationBreakdown({
  sales,
  percentage,
  cards,
  extras,
  transport,
}: Props) {
  const company =
    sales * (percentage / 100);

  const employeeTotal =
    company -
    cards -
    extras -
    transport;

  return (
    <div
      className="
      bg-zinc-950
      border border-zinc-800
      rounded-3xl
      p-8
      "
    >
      <h2 className="text-2xl font-bold">
        Liquidation
      </h2>

      <div className="mt-8 space-y-4">
        <Row
          label="Total Sales"
          value={sales}
        />

        <Row
          label={`Company (${percentage}%)`}
          value={company}
        />

        <Row
          label="Transport"
          value={-transport}
          red
        />

        <Row
          label="Cards"
          value={-cards}
          red
        />

        <Row
          label="Extras"
          value={-extras}
          red
        />
      </div>

      <div
        className="
        mt-8
        bg-red-500/10
        border border-red-500/20
        rounded-2xl
        p-6
        flex justify-between
        "
      >
        <span className="text-red-400">
          TO EMPLOYEE
        </span>

        <span
          className="
          text-red-400
          font-bold
          text-3xl
          "
        >
          $
          {employeeTotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  red,
}: {
  label: string;
  value: number;
  red?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>

      <span
        className={
          red ? "text-red-400" : ""
        }
      >
        ${value.toLocaleString()}
      </span>
    </div>
  );
}