import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div
      className="
      rounded-3xl
      border
      border-zinc-800
      bg-[#0f0f0f]
      p-7
      "
    >
      <div className="flex justify-between items-center">
        <span className="text-zinc-400">
          {title}
        </span>

        <Icon
          size={22}
          className="text-[#D4AF37]"
        />
      </div>

      <h2
        className="
        text-5xl
        font-bold
        mt-5
        text-white
        "
      >
        {value}
      </h2>
    </div>
  );
}