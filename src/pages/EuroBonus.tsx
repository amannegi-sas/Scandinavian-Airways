import { useEuroBonus } from '../hooks/useCustomerData';
import { useAppStore } from '../store/appStore';

const TIER_NEXT: Record<string, { next: string; needed: number }> = {
  member: { next: 'Silver', needed: 10_000 },
  silver: { next: 'Gold', needed: 30_000 },
  gold: { next: 'Diamond', needed: 60_000 },
  diamond: { next: 'Diamond', needed: 60_000 },
};

export default function EuroBonus() {
  const member = useAppStore((s) => s.member);
  const { data, isLoading, isError } = useEuroBonus();

  if (!member) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">EuroBonus</h1>
        <div className="flex flex-col items-start gap-4">
          <p className="text-slate-500">Sign in to view your EuroBonus account.</p>
          <a href="/login" className="bg-[#002f6c] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#003d87] transition-colors no-underline inline-block">Sign in</a>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">EuroBonus</h1>
        <div className="h-40 rounded-xl bg-slate-200 animate-pulse" />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">EuroBonus</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 text-sm">Could not load your EuroBonus data.</div>
      </main>
    );
  }

  const progress = TIER_NEXT[data.tier];
  const pct = Math.min((data.tierPoints / progress.needed) * 100, 100);

  const tierBadgeStyle: Record<string, string> = {
    member: 'bg-slate-100 text-slate-700',
    silver: 'bg-slate-200 text-slate-800',
    gold: 'bg-yellow-100 text-yellow-800',
    diamond: 'bg-sky-100 text-sky-800',
  };
  const tierTextStyle: Record<string, string> = {
    member: 'text-slate-700',
    silver: 'text-slate-500',
    gold: 'text-yellow-600',
    diamond: 'text-sky-600',
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">EuroBonus</h1>

      {/* Profile card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#002f6c] to-[#004a9f] text-white p-7 mb-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${tierBadgeStyle[data.tier] ?? 'bg-slate-100 text-slate-700'}`}>
            {data.tier.charAt(0).toUpperCase() + data.tier.slice(1)}
          </span>
          <div>
            <h2 className="text-xl font-extrabold">{data.firstName} {data.lastName}</h2>
            <span className="text-blue-200 text-sm">Member ID: {data.memberId}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-black">{data.points.toLocaleString()}</span>
          <span className="text-blue-200 text-xs uppercase tracking-widest">available points</span>
        </div>
      </div>

      {/* Progress to next tier */}
      {data.tier !== 'diamond' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-slate-900 mb-4">Progress to {progress.next}</h3>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#002f6c] rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{data.tierPoints.toLocaleString()} tier points</span>
            <span>{progress.needed.toLocaleString()} needed</span>
          </div>
        </div>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 rounded-xl px-5 py-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Points expiry</span>
          <span className="text-base font-bold text-slate-900">{data.expiryDate}</span>
        </div>
        <div className="bg-slate-50 rounded-xl px-5 py-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Tier status</span>
          <span className={`text-base font-bold capitalize ${tierTextStyle[data.tier] ?? 'text-slate-700'}`}>{data.tier}</span>
        </div>
      </div>

      {/* Benefits */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-bold text-slate-900 mb-4 capitalize">{data.tier} benefits</h3>
        <ul className="flex flex-col gap-2">
          {tierBenefits[data.tier].map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-emerald-500">✓</span>
              {b}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const tierBenefits: Record<string, string[]> = {
  member: ['Earn points on Airways flights', 'Redeem points for award travel', 'Member-only offers'],
  silver: ['Bonus points on all flights', 'Priority check-in', 'Extra baggage allowance', 'Lounge access on long-haul'],
  gold: ['All Silver benefits', 'Priority boarding', 'Complimentary upgrades (subject to availability)', 'More lounge access'],
  diamond: ['All Gold benefits', 'Dedicated service line', 'Most generous upgrade priority', 'Highest points multiplier'],
};
