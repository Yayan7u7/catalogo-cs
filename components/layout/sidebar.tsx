"use client";
import { DollarSign } from "lucide-react";
import Link from "next/link";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  Car,
  Map,
  Bell,
  BarChart3,
  BookImage,
  UserPlus
} from "lucide-react";
import AssistantWidget from "@/components/ai/assistant-widget";

const menu = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Services",
    icon: BriefcaseBusiness,
    href: "/services",
  },
  {
    label: "Employees",
    icon: Users,
    href: "/employees",
  },
  {
    label: "Drivers",
    icon: Car,
    href: "/drivers",
  },
  {
    label: "Live Map",
    icon: Map,
    href: "/map",
  },
  {
    label: "Alerts",
    icon: Bell,
    href: "/alerts",
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
  },
  {
    label: "Catalog",
    icon: BookImage,
    href: "/catalog",
  },
  {
    label: "Registry",
    icon: UserPlus,
    href: "/registro",
  },
  {
    label: "Liquidations",
    href: "/liquidations",
    icon: DollarSign,
  }
];

export default function Sidebar() {
  return (
    <aside
      className="
      w-[280px]
      h-screen
      bg-[#111111]
      border-r
      border-zinc-800
      flex
      flex-col
      "
    >
      <div className="p-8">
        <h1
          className="
          text-2xl
          font-bold
          text-[#D4AF37]
          "
        >
          ServicePro
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-zinc-400
              hover:bg-zinc-900
              hover:text-white
              transition-all
              "
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <AssistantWidget />
    </aside>
  );
}
