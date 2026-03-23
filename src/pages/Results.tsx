import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import FlightCard from '../components/flights/FlightCard';
import SearchForm from '../components/flights/SearchForm';
import type { CabinClass } from '../types';

const cabinOrder: CabinClass[] = ['economy', 'plus', 'business'];

type SortKey = 'price' | 'departure' | 'duration';

export default function Results() {
  const navigate = useNavigate();
  const flights = useAppStore((s) => s.searchResults);
  const bookingDraft = useAppStore((s) => s.bookingDraft);
  const searchParams = useAppStore((s) => s.searchParams);

  const [sortBy, setSortBy] = useState<SortKey>('price');
  const [filterCabin, setFilterCabin] = useState<CabinClass | 'all'>('all');

  let filtered = [...flights];
  if (filterCabin !== 'all') {
    filtered = filtered.filter((f) => f.fares.some((fare) => fare.cabinClass === filterCabin));
  }
  filtered.sort((a, b) => {
    if (sortBy === 'price') {
      return Math.min(...a.fares.map((f) => f.price)) - Math.min(...b.fares.map((f) => f.price));
    }
    if (sortBy === 'departure') {
      return new Date(a.outbound.departureTime).getTime() - new Date(b.outbound.departureTime).getTime();
    }
    return a.outbound.duration.localeCompare(b.outbound.duration);
  });

  const handleContinue = () => {
    if (bookingDraft.flight && bookingDraft.fare) navigate('/checkout');
  };

  if (!flights.length) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10 pb-20">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Search results</h1>
        <div className="max-w-3xl">
          <p className="text-slate-500 mb-6">No results yet — enter your route and date below.</p>
          <SearchForm />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 pb-28">
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {searchParams.origin} → {searchParams.destination}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} flight{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">
        <aside className="bg-white border border-slate-200 rounded-xl p-5 md:sticky md:top-20">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Filters</h3>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cabin class</label>
            <div className="flex flex-col gap-1.5">
              {(['all', ...cabinOrder] as const).map((c) => (
                <button
                  key={c}
                  className={`px-3 py-2 rounded-lg border text-sm text-left cursor-pointer transition-colors ${filterCabin === c ? 'bg-[#002f6c] text-white border-[#002f6c]' : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-[#002f6c]'}`}
                  onClick={() => setFilterCabin(c)}
                >
                  {c === 'all' ? 'All' : c === 'economy' ? 'Economy' : c === 'plus' ? 'Airways Plus' : 'Business'}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sort by</label>
            <div className="flex flex-col gap-1.5">
              {(['price', 'departure', 'duration'] as SortKey[]).map((s) => (
                <button
                  key={s}
                  className={`px-3 py-2 rounded-lg border text-sm text-left cursor-pointer transition-colors ${sortBy === s ? 'bg-[#002f6c] text-white border-[#002f6c]' : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-[#002f6c]'}`}
                  onClick={() => setSortBy(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          {filtered.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      </div>

      {bookingDraft.flight && bookingDraft.fare && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#002f6c] text-white z-50 shadow-2xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <strong>{bookingDraft.flight.outbound.flightNumber}</strong>
              <span className="text-white/80"> · {bookingDraft.fare.label} · {bookingDraft.fare.price.toLocaleString()} {bookingDraft.fare.currency}</span>
            </div>
            <button className="bg-white text-[#002f6c] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer border-0" onClick={handleContinue}>
              Continue to checkout →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
