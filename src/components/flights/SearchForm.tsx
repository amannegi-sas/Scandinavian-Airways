import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import { useFlightSearch } from "../../hooks/useFlightSearch";
import type { TripType, CabinClass } from "../../types";

const airports = [
  { code: "ARN", label: "Stockholm (ARN)" },
  { code: "CPH", label: "Copenhagen (CPH)" },
  { code: "OSL", label: "Oslo (OSL)" },
  { code: "HEL", label: "Helsinki (HEL)" },
  { code: "LHR", label: "London (LHR)" },
  { code: "JFK", label: "New York (JFK)" },
];

const cabinOptions: { value: CabinClass; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "plus", label: "Airways Plus" },
  { value: "business", label: "Business" },
];

const fieldCls = "flex flex-col gap-1.5 flex-1 min-w-[140px]";
const labelCls = "text-[11px] font-bold uppercase tracking-widest text-slate-500";
const inputCls = "px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white outline-none transition-colors focus:border-[#002f6c] w-full";

export default function SearchForm() {
  const navigate = useNavigate();
  const searchParams = useAppStore((s) => s.searchParams);
  const { search, isLoading, setSearchParams } = useFlightSearch();
  const [tripType, setTripType] = useState<TripType>(searchParams.tripType);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    await search();
    navigate("/results");
  }

  function swapAirports() {
    setSearchParams({ origin: searchParams.destination, destination: searchParams.origin });
  }

  return (
    <form className="bg-white rounded-2xl p-7 shadow-2xl shadow-[#002f6c]/20" onSubmit={handleSearch}>
      <div className="flex gap-1 mb-6 border-b-2 border-slate-200 pb-0">
        {(["roundtrip", "oneway", "multicity"] as TripType[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`px-5 py-2 bg-transparent border-0 border-b-2 -mb-0.5 text-sm font-medium cursor-pointer transition-colors ${tripType === t ? "border-[#002f6c] text-[#002f6c] font-bold" : "border-transparent text-slate-500 hover:text-[#002f6c]"}`}
            onClick={() => { setTripType(t); setSearchParams({ tripType: t }); }}
          >
            {t === "roundtrip" ? "Round trip" : t === "oneway" ? "One way" : "Multi-city"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className={fieldCls}>
          <label htmlFor="origin" className={labelCls}>From</label>
          <select id="origin" className={inputCls} value={searchParams.origin} onChange={(e) => setSearchParams({ origin: e.target.value })}>
            {airports.map((a) => <option key={a.code} value={a.code}>{a.label}</option>)}
          </select>
        </div>

        <button type="button" onClick={swapAirports} aria-label="Swap airports"
          className="flex-shrink-0 self-end w-10 h-10 rounded-full bg-blue-50 border border-slate-300 text-[#002f6c] text-xl cursor-pointer hover:bg-blue-100 transition-colors flex items-center justify-center">
          &#8646;
        </button>

        <div className={fieldCls}>
          <label htmlFor="destination" className={labelCls}>To</label>
          <select id="destination" className={inputCls} value={searchParams.destination} onChange={(e) => setSearchParams({ destination: e.target.value })}>
            {airports.map((a) => <option key={a.code} value={a.code}>{a.label}</option>)}
          </select>
        </div>

        <div className={fieldCls}>
          <label htmlFor="departure" className={labelCls}>Departure</label>
          <input id="departure" type="date" className={inputCls} value={searchParams.departureDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSearchParams({ departureDate: e.target.value })} required />
        </div>

        {tripType === "roundtrip" && (
          <div className={fieldCls}>
            <label htmlFor="return" className={labelCls}>Return</label>
            <input id="return" type="date" className={inputCls} value={searchParams.returnDate ?? ""}
              min={searchParams.departureDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setSearchParams({ returnDate: e.target.value })} />
          </div>
        )}

        <div className={fieldCls}>
          <label htmlFor="cabin" className={labelCls}>Cabin</label>
          <select id="cabin" className={inputCls} value={searchParams.cabinClass} onChange={(e) => setSearchParams({ cabinClass: e.target.value as CabinClass })}>
            {cabinOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className={fieldCls}>
          <label htmlFor="passengers" className={labelCls}>Passengers</label>
          <select id="passengers" className={inputCls} value={searchParams.passengers.adults}
            onChange={(e) => setSearchParams({ passengers: { ...searchParams.passengers, adults: Number(e.target.value) } })}>
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>)}
          </select>
        </div>

        <button type="submit" disabled={isLoading}
          className="self-end bg-[#002f6c] text-white px-8 py-2.5 rounded-lg text-base font-bold cursor-pointer whitespace-nowrap transition-colors hover:bg-[#003d87] disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px]">
          {isLoading ? "Searching…" : "Search flights"}
        </button>
      </div>
    </form>
  );
}
