import TeamOperations from "@/components/jefe/TeamOperations";
import { getJefeEmployees, getJefeServices } from "@/lib/actions/jefe-panel";

export default async function JefePage() {
  const [employees, services] = await Promise.all([getJefeEmployees(), getJefeServices()]);
  return <TeamOperations initialEmployees={employees} initialServices={services} />;
}
