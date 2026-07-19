import { redirect } from "next/navigation";
import ReportsDashboard from "@/components/employee-reports/reports-dashboard";
import {
  getEmployeeReportDashboard,
  getEmployeeReports,
} from "@/lib/actions/employee-reports";
import { getCurrentUser } from "@/lib/auth";

export default async function JefeReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin");
  if (user.rol === "admin") redirect("/admin/reports");
  if (user.rol !== "jefe") redirect("/admin");

  const [reports, dashboard] = await Promise.all([
    getEmployeeReports({ page: 1, limit: 20 }),
    getEmployeeReportDashboard(),
  ]);

  return (
    <ReportsDashboard
      role="jefe"
      initialReports={reports}
      initialSummary={dashboard.summary}
      initialTolerance={dashboard.tolerance}
    />
  );
}
