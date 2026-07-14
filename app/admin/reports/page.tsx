import PageHeader from "@/components/ui/page-header";

import RevenueChart from "@/components/dashboard/revenue-chart";

import ReportKPI from "@/components/reports/report-kpi";
import ServicesChart from "@/components/reports/services-chart";
import ExportActions from "@/components/reports/export-actions";

export default function ReportsPage() {
 return (
  <>
   <PageHeader
    title="Reports & Analytics"
    description="Business intelligence and operational metrics."
   />

   <div
    className="
    grid
    md:grid-cols-2
    xl:grid-cols-4
    gap-6
    "
   >
    <ReportKPI
     title="Revenue"
     value="$95,200"
    />

    <ReportKPI
     title="Services"
     value="648"
    />

    <ReportKPI
     title="Drivers"
     value="24"
    />

    <ReportKPI
     title="Employees"
     value="58"
    />
   </div>

   <div
    className="
    mt-8
    grid
    xl:grid-cols-2
    gap-6
    "
   >
    <RevenueChart />

    <ServicesChart />
   </div>

   <ExportActions />
  </>
 );
}