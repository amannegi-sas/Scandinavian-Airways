import { memo } from "react";
import { Link } from "react-router-dom";
import type { Destination } from "../../types";

interface Props { destination: Destination; }

const DestinationCard = memo(({ destination: d }: Props) => (
  <article className="bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col transition-all hover:shadow-xl hover:shadow-[#002f6c]/10 hover:-translate-y-0.5 group">
    <div className="h-44 overflow-hidden">
      <img src={d.imageUrl} alt={`${d.city}, ${d.country}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
    <div className="p-5 flex flex-col flex-1 gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{d.city}</h3>
          <span className="text-xs text-slate-500">{d.country}</span>
        </div>
        <span className="text-xs text-slate-600 text-right whitespace-nowrap">
          from <strong className="block text-base font-bold text-[#002f6c]">{d.priceFrom.toLocaleString()} {d.currency}</strong>
        </span>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed flex-1">{d.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {d.tags.map((t) => (
          <span key={t} className="px-2.5 py-0.5 bg-blue-50 text-[#002f6c] rounded-full text-[11px] font-semibold capitalize">{t}</span>
        ))}
      </div>
      <Link to={`/?destination=${d.airportCode}`} className="block text-center py-2.5 px-4 bg-[#002f6c] text-white rounded-lg text-sm font-bold no-underline transition-colors hover:bg-[#003d87] mt-auto">
        Book to {d.city}
      </Link>
    </div>
  </article>
));

DestinationCard.displayName = "DestinationCard";
export default DestinationCard;
