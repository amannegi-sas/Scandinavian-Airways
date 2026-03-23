import { useState } from 'react';
import { useDestinations } from '../hooks/useDestinations';
import DestinationCard from '../components/destinations/DestinationCard';

const ALL = 'All';

export default function Destinations() {
  const { data: destinations, isLoading } = useDestinations(false);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState(ALL);

  const allTags = (() => {
    if (!destinations) return [];
    const tags = new Set(destinations.flatMap((d) => d.tags));
    return [ALL, ...Array.from(tags)];
  })();

  const filtered = (() => {
    if (!destinations) return [];
    return destinations.filter((d) => {
      const matchesSearch =
        !search ||
        d.city.toLowerCase().includes(search.toLowerCase()) ||
        d.country.toLowerCase().includes(search.toLowerCase());
      const matchesTag = activeTag === ALL || d.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  })();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Destinations</h1>
      <p className="text-slate-500 mb-6">Explore {destinations?.length ?? '…'} destinations served by Airways</p>

      <div className="flex flex-col gap-3 mb-8">
        <input
          type="search"
          placeholder="Search city or country…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#002f6c] transition-colors"
        />
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${
                activeTag === tag
                  ? 'bg-[#002f6c] text-white border-[#002f6c]'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-[#002f6c] hover:text-[#002f6c]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : !filtered.length ? (
        <p className="text-center text-slate-400 py-16 text-base">No destinations match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d) => <DestinationCard key={d.id} destination={d} />)}
        </div>
      )}
    </main>
  );
}
