import { useState } from 'react';
import { useFlightStatus } from '../hooks/useFlightStatus';
import StatusBadge from '../components/ui/StatusBadge';

export default function FlightStatus() {
  const [flightNumber, setFlightNumber] = useState('');
  const [date, setDate] = useState('');
  const [query, setQuery] = useState<{ flightNumber: string; date: string } | null>(null);

  const { data, isLoading, isError, error } = useFlightStatus(
    query?.flightNumber ?? '',
    query?.date ?? ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flightNumber && date) setQuery({ flightNumber, date });
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Flight status</h1>
      <p className="text-slate-500 mb-8">Real-time updates for Airways flights</p>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fn" className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Flight number</label>
            <input
              id="fn"
              placeholder="e.g. SK 503"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              required
              className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#002f6c] transition-colors w-44"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fd" className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Date</label>
            <input
              id="fd"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#002f6c] transition-colors"
            />
          </div>
          <button type="submit" className="bg-[#002f6c] text-white px-6 py-2.5 rounded-lg font-bold text-sm border-0 cursor-pointer hover:bg-[#003d87] transition-colors">
            Check status
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="flex items-center gap-3 py-6 text-slate-500">
          <div className="w-5 h-5 border-2 border-[#002f6c] border-t-transparent rounded-full animate-spin" />
          <span>Fetching flight data…</span>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 text-sm">
          {(error as Error).message}
        </div>
      )}

      {data && (
        <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">{data.flightNumber}</h2>
            <StatusBadge status={data.status} />
            {data.delay && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                +{data.delay} min delay
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-4xl font-black text-slate-900">{data.origin.code}</span>
              <span className="text-sm text-slate-500">{data.origin.city}</span>
              <span className="text-base font-semibold text-slate-700">{formatTime(data.scheduledDeparture)}</span>
              {data.estimatedDeparture !== data.scheduledDeparture && (
                <span className="text-xs text-amber-600">Est. {formatTime(data.estimatedDeparture)}</span>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center text-2xl text-slate-300">✈</div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-4xl font-black text-slate-900">{data.destination.code}</span>
              <span className="text-sm text-slate-500">{data.destination.city}</span>
              <span className="text-base font-semibold text-slate-700">{formatTime(data.scheduledArrival)}</span>
              {data.estimatedArrival !== data.scheduledArrival && (
                <span className="text-xs text-amber-600">Est. {formatTime(data.estimatedArrival)}</span>
              )}
            </div>
          </div>

          {(data.gate || data.terminal) && (
            <div className="flex flex-wrap gap-4">
              {data.terminal && (
                <div className="flex flex-col gap-0.5 bg-slate-50 rounded-lg px-5 py-3">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Terminal</span>
                  <span className="text-xl font-black text-slate-900">{data.terminal}</span>
                </div>
              )}
              {data.gate && (
                <div className="flex flex-col gap-0.5 bg-slate-50 rounded-lg px-5 py-3">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Gate</span>
                  <span className="text-xl font-black text-slate-900">{data.gate}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-sm text-slate-500">
        <p>Try:{ }
          <button className="bg-transparent border-0 text-[#002f6c] cursor-pointer underline text-sm p-0" onClick={() => { setFlightNumber('SK 503'); setDate('2026-04-10'); }}>SK 503 on Apr 10</button>
          {' or '}
          <button className="bg-transparent border-0 text-[#002f6c] cursor-pointer underline text-sm p-0" onClick={() => { setFlightNumber('SK 507'); setDate('2026-04-10'); }}>SK 507 on Apr 10</button>
        </p>
      </div>
    </main>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-SE', { hour: '2-digit', minute: '2-digit' });
}
