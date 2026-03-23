import { memo } from "react";
import type { FlightStatus } from "../../types";

const config: Record<FlightStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700" },
  boarding:  { label: "Boarding",  className: "bg-emerald-100 text-emerald-700" },
  departed:  { label: "Departed",  className: "bg-violet-100 text-violet-700" },
  landed:    { label: "Landed",    className: "bg-green-100 text-green-800" },
  delayed:   { label: "Delayed",   className: "bg-amber-100 text-amber-800" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
};

interface Props { status: FlightStatus; }

const StatusBadge = memo(({ status }: Props) => {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
});

StatusBadge.displayName = "StatusBadge";
export default StatusBadge;
