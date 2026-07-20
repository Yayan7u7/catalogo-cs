import { redirect } from "next/navigation";
import ReportsDashboard from "@/components/employee-reports/reports-dashboard";
import {
  getEmployeeReportDashboard,
  getEmployeeReports,
  getReportAdmins,
} from "@/lib/actions/employee-reports";
import { getCurrentUser } from "@/lib/auth";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin");
  if (user.rol === "jefe") redirect("/jefe/reportes");
  if (user.rol !== "admin") redirect("/admin");

  const [reports, dashboard, admins] = await Promise.all([
    getEmployeeReports({ page: 1, limit: 20 }),
    getEmployeeReportDashboard(),
    getReportAdmins(),
  ]);

  return (
    <ReportsDashboard
      role="admin"
      initialReports={reports}
      initialSummary={dashboard.summary}
      initialTolerance={dashboard.tolerance}
      admins={admins}
    />
  );
}
