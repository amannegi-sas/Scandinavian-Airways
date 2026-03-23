import { memo } from "react";
import type { Fare } from "../../types";

interface Props {
  fare: Fare;
  active: boolean;
  onSelect: () => void;
}

const FareCard = memo(({ fare, active, onSelect }: Props) => (
  <button
    className={`flex flex-col items-start gap-1.5 p-4 border-0 border-r border-slate-100 last:border-r-0 cursor-pointer transition-colors w-full text-left ${active ? "bg-[#002f6c] text-white" : "bg-transparent hover:bg-blue-50"}`}
    onClick={onSelect}
    type="button"
  >
    <span className="text-xs font-bold tracking-wide">{fare.label}</span>
    <span className="text-lg font-bold">
      {fare.price.toLocaleString()} <small className="text-xs font-normal opacity-70">{fare.currency}</small>
    </span>
    <ul className="list-none p-0 m-0 text-[11px] opacity-75 space-y-0.5">
      <li className="before:content-['✓_'] before:font-bold">{fare.baggage}</li>
      {fare.changeable && <li className="before:content-['✓_'] before:font-bold">Changeable</li>}
      {fare.refundable && <li className="before:content-['✓_'] before:font-bold">Refundable</li>}
    </ul>
    <span className={`text-[11px] font-semibold ${active ? "text-blue-300" : "text-blue-600"}`}>
      +{fare.pointsEarned.toLocaleString()} pts
    </span>
  </button>
));

FareCard.displayName = "FareCard";
export default FareCard;
