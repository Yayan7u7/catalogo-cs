import PageHeader from "@/components/ui/page-header";

import AlertCard from "@/components/alerts/alert-card";
import AlertsStats from "@/components/alerts/alerts-stats";

const alerts = [
 {
  title: "Driver Offline",
  description:
   "Carlos Medina disconnected unexpectedly.",
  priority: "critical",
 },

 {
  title: "Delayed Service",
  description:
   "Service S-1052 exceeded ETA.",
  priority: "high",
 },

 {
  title: "New Assignment",
  description:
   "Driver assigned automatically.",
  priority: "medium",
 },

 {
  title: "GPS Lost",
  description:
   "Vehicle signal lost for 2 minutes.",
  priority: "critical",
 },
] as const;

export default function AlertsPage() {
 return (
  <>
   <PageHeader
    title="Alert Center"
    description="Monitor incidents and operational events."
   />

   <AlertsStats />

   <div className="space-y-4">
    {alerts.map((alert, index) => (
     <AlertCard
      key={index}
      {...alert}
     />
    ))}
   </div>
  </>
 );
}