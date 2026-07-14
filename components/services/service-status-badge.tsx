type Props = {
 status: string;
};

export default function ServiceStatusBadge({
 status,
}: Props) {

 const colors: Record<string, string> = {
  Pending:
   "bg-yellow-500/20 text-yellow-400",

  Accepted:
   "bg-blue-500/20 text-blue-400",

  Assigned:
   "bg-purple-500/20 text-purple-400",

  "In Route":
   "bg-cyan-500/20 text-cyan-400",

  Completed:
   "bg-green-500/20 text-green-400",

  Cancelled:
   "bg-red-500/20 text-red-400",
 };

 return (
  <span
   className={`
   px-3
   py-1
   rounded-full
   text-xs
   font-medium
   ${colors[status]}
   `}
  >
   {status}
  </span>
 );
}