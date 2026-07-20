import TeamOperations from "@/components/jefe/TeamOperations";
import { getJefeCashObligations, getJefeEmployees, getJefeServices } from "@/lib/actions/jefe-panel";

export default async function JefePage() {
  const [employees, services, cashSummary] = await Promise.all([getJefeEmployees(), getJefeServices(), getJefeCashObligations()]);
  return <TeamOperations initialEmployees={employees} initialServices={services} initialCashSummary={cashSummary} />;
}
