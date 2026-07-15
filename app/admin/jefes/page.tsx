import JefesDashboard from "@/components/admin/JefesDashboard";
import { getJefesAction } from "@/app/actions/jefes";

export const dynamic = "force-dynamic";

export default async function JefesPage() {
  const initialJefes = await getJefesAction();

  return <JefesDashboard initialJefes={initialJefes} />;
}

