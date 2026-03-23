import { memo, useMemo } from "react";
import type { Flight } from "../../types";
import { useAppStore } from "../../store/appStore";
import FareCard from "./FareCard";

interface Props {
  flight: Flight;
  onSelect?: () => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-SE", { hour: "2-digit", minute: "2-digit" });
}

const FlightCard = memo(({ flight, onSelect }: Props) => {
  const selectFlightAndFare = useAppStore((s) => s.selectFlightAndFare);
  const selectedFare = useAppStore((s) => s.bookingDraft.fare);
  const selectedFlight = useAppStore((s) => s.bookingDraft.flight);

  const lowestPrice = useMemo(() => Math.min(...flight.fares.map((f) => f.price)), [flight.fares]);
  const isSelected = selectedFlight?.id === flight.id;

  return (
    <div className={`bg-white rounded-xl overflow-hidden transition-all ${isSelected ? "border-2 border-[#002f6c] shadow-[0_0_0_2px_rgba(0,47,108,0.15)]" : "border border-slate-200 hover:shadow-md"}`}>
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-2xl font-bold text-slate-900 leading-none">{formatTime(flight.outbound.departureTime)}</span>
            <span className="text-xs font-semibold text-slate-500 tracking-wide">{flight.outbound.origin.code}</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-0.5 text-slate-400">
            <span className="text-xs font-semibold text-slate-600">{flight.outbound.duration}</span>
            <div className="w-full border-t-2 border-slate-200" />
            <span className="text-[10px] text-emerald-600 font-semibold">{flight.outbound.stops === 0 ? "Nonstop" : `${flight.outbound.stops} stop`}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-2xl font-bold text-slate-900 leading-none">{formatTime(flight.outbound.arrivalTime)}</span>
            <span className="text-xs font-semibold text-slate-500 tracking-wide">{flight.outbound.destination.code}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{flight.outbound.flightNumber}</span>
          <span>{flight.outbound.aircraft}</span>
          <span className="ml-auto text-sm text-slate-700">from <strong className="text-[#002f6c] text-base">{lowestPrice.toLocaleString()} SEK</strong></span>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${flight.fares.length}, 1fr)` }}>
        {flight.fares.map((fare) => (
          <FareCard
            key={fare.id}
            fare={fare}
            active={isSelected && selectedFare?.id === fare.id}
            onSelect={() => { selectFlightAndFare(flight, fare); onSelect?.(); }}
          />
        ))}
      </div>
    </div>
  );
});

FlightCard.displayName = "FlightCard";
export default FlightCard;
