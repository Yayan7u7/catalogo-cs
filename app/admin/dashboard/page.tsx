import { Bell, BriefcaseBusiness, Car, Users } from "lucide-react";

import ActivityFeed from "@/components/dashboard/activity-feed";
import AlertsCenter from "@/components/dashboard/alerts-center";
import LiveMapDynamic from "@/components/dashboard/LiveMapDynamic";
import RevenueChart from "@/components/dashboard/revenue-chart";
import PageHeader from "@/components/ui/page-header";
import StatCard from "@/components/ui/stat-card";
import { getDrivers } from "@/lib/drivers";
import { getEmployees } from "@/lib/employees";
import { getServices, isActiveService } from "@/lib/services";

export default async function DashboardPage() {
  const [employees, drivers, servicesResult] = await Promise.all([
    getEmployees(),
    getDrivers(),
    getServices().then(
      (services) => ({ ok: true as const, services }),
      (error: unknown) => ({ ok: false as const, error }),
    ),
  ]);
  const services = servicesResult.ok ? servicesResult.services : [];
  const activeServices = services.filter(isActiveService);

  return (
    <>
      <PageHeader
        title="Executive Overview"
        description="Real-time metrics and global fleet status."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Jobs"
          value={servicesResult.ok ? activeServices.length : "—"}
          icon={BriefcaseBusiness}
        />
        <StatCard title="Employees" value={employees.length} icon={Users} />
        <StatCard title="Drivers" value={drivers.length} icon={Car} />
        <StatCard title="Alerts" value={7} icon={Bell} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <RevenueChart />
        </div>

        <div className="xl:col-span-4">
          <ActivityFeed
            services={services}
            error={
              servicesResult.ok
                ? undefined
                : "No se pudieron cargar servicios. Revisa que haya sesión admin/jefe."
            }
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <LiveMapDynamic employees={employees} drivers={drivers} />
        </div>

        <div className="xl:col-span-4">
          <AlertsCenter />
        </div>
      </div>
    </>
  );
}
