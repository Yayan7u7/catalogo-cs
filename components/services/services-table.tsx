import ServiceStatusBadge from "./service-status-badge";

const services = [
 {
  id: "S-1024",
  client: "Laura Torres",
  service: "VIP Service",
  employee: "Andrea",
  driver: "Carlos",
  status: "Completed",
 },

 {
  id: "S-1025",
  client: "María López",
  service: "Massage",
  employee: "Fernanda",
  driver: "Luis",
  status: "Assigned",
 },

 {
  id: "S-1026",
  client: "Patricia Ruiz",
  service: "Escort Premium",
  employee: "Valeria",
  driver: "Miguel",
  status: "Pending",
 },
];

export default function ServicesTable() {
 return (
  <div
   className="
   rounded-3xl
   border
   border-zinc-800
   bg-zinc-950
   overflow-hidden
   "
  >
   <table className="w-full">
    <thead>
     <tr
      className="
      border-b
      border-zinc-800
      text-left
      "
     >
      <th className="p-4">ID</th>
      <th className="p-4">Client</th>
      <th className="p-4">Service</th>
      <th className="p-4">Employee</th>
      <th className="p-4">Driver</th>
      <th className="p-4">Status</th>
     </tr>
    </thead>

    <tbody>
     {services.map((service) => (
      <tr
       key={service.id}
       className="
       border-b
       border-zinc-900
       hover:bg-zinc-900/50
       "
      >
       <td className="p-4">{service.id}</td>

       <td className="p-4">
        {service.client}
       </td>

       <td className="p-4">
        {service.service}
       </td>

       <td className="p-4">
        {service.employee}
       </td>

       <td className="p-4">
        {service.driver}
       </td>

       <td className="p-4">
        <ServiceStatusBadge
         status={service.status}
        />
       </td>
      </tr>
     ))}
    </tbody>
   </table>
  </div>
 );
}