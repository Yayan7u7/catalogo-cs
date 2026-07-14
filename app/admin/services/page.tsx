import PageHeader from "@/components/ui/page-header";
import ServicesTable from "@/components/services/services-table";

export default function ServicesPage() {
 return (
  <>
   <PageHeader
    title="Services"
    description="Manage active and completed services."
   />

   <ServicesTable />
  </>
 );
}