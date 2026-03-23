import SearchForm from "../components/flights/SearchForm";
import { useDestinations } from "../hooks/useDestinations";
import { useCountdown } from "../hooks/useCountdown";
import { Link } from "react-router-dom";
import DestinationCard from "../components/destinations/DestinationCard";

const DEAL_EXPIRY = "2026-04-01T23:59:59";

export default function Home() {
  const { data: popularDests, isLoading } = useDestinations(true);
  const countdown = useCountdown(DEAL_EXPIRY);

  return (
    <main>
      <section className="relative min-h-[460px] bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600')] bg-center bg-cover flex flex-col items-center justify-center px-6 pb-16 pt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#002f6c]/60 to-[#002f6c]/20" />
        <div className="relative z-10 text-center text-white mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">Fly Scandinavian</h1>
          <p className="text-lg opacity-90">Explore Scandinavia and the world with Airways</p>
        </div>
        <div className="relative z-10 w-full max-w-[900px]">
          <SearchForm />
        </div>
      </section>

      {!countdown.expired && (
        <section className="bg-gradient-to-r from-[#002f6c] to-[#0052b4] text-white px-6 py-5">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col">
              <strong>Spring Sale</strong>
              <span className="text-sm opacity-85">Up to 40% off selected routes</span>
            </div>
            <div className="flex gap-4">
              {([["days", countdown.days], ["hours", countdown.hours], ["minutes", countdown.minutes], ["seconds", countdown.seconds]] as [string, number][]).map(([label, val]) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-2xl font-black leading-none">{String(val).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-75">{label}</span>
                </div>
              ))}
            </div>
            <Link to="/destinations" className="bg-white text-[#002f6c] px-5 py-2 rounded-lg text-sm font-bold no-underline hover:bg-slate-100 transition-colors">Explore deals</Link>
          </div>
        </section>
      )}

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Popular destinations</h2>
          <p className="text-slate-500 mb-8">Handpicked routes departing from Scandinavia</p>
          {isLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[300px] rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
                {popularDests?.map((dest) => <DestinationCard key={dest.id} destination={dest} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/destinations" className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-[#002f6c] text-[#002f6c] rounded-lg text-sm font-bold no-underline hover:bg-blue-50 transition-colors">See all destinations</Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
          {([["✈", "120+ destinations", "Direct and connecting flights across Europe, and beyond."],
            ["⭐", "EuroBonus rewards", "Earn points on every flight and redeem for free travel."],
            ["🛡", "Travel flexibility", "Change or cancel eligible tickets with ease."],
            ["🌿", "Sustainable travel", "Committed to net-zero emissions by 2050."]] as [string, string, string][]).map(([icon, title, desc]) => (
            <div key={title} className="text-center">
              <span className="text-3xl block mb-3">{icon}</span>
              <h3 className="text-base font-bold mb-2 text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
