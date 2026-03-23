import { memo } from "react";
import { Link } from "react-router-dom";

const Footer = memo(() => (
  <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-12">
      <div>
        <svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-[70px] h-7 mb-3">
          <rect width="80" height="32" rx="4" fill="#002f6c" />
          <text x="12" y="22" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="white">Airways</text>
        </svg>
        <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">Scandinavian Airways — the flag carrier of Denmark, Norway and Sweden.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#002f6c] mb-3">Travel</h4>
          <Link to="/" className="block text-sm text-slate-600 mb-1.5 no-underline hover:text-[#002f6c] transition-colors">Book a flight</Link>
          <Link to="/destinations" className="block text-sm text-slate-600 mb-1.5 no-underline hover:text-[#002f6c] transition-colors">Destinations</Link>
          <Link to="/flight-status" className="block text-sm text-slate-600 mb-1.5 no-underline hover:text-[#002f6c] transition-colors">Flight status</Link>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#002f6c] mb-3">My Airways</h4>
          <Link to="/my-bookings" className="block text-sm text-slate-600 mb-1.5 no-underline hover:text-[#002f6c] transition-colors">My bookings</Link>
          <Link to="/eurobonus" className="block text-sm text-slate-600 mb-1.5 no-underline hover:text-[#002f6c] transition-colors">EuroBonus</Link>
          <Link to="/login" className="block text-sm text-slate-600 mb-1.5 no-underline hover:text-[#002f6c] transition-colors">Sign in</Link>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#002f6c] mb-3">Help</h4>
          <a href="#" className="block text-sm text-slate-600 mb-1.5 no-underline hover:text-[#002f6c] transition-colors">Travel info</a>
          <a href="#" className="block text-sm text-slate-600 mb-1.5 no-underline hover:text-[#002f6c] transition-colors">Baggage</a>
          <a href="#" className="block text-sm text-slate-600 mb-1.5 no-underline hover:text-[#002f6c] transition-colors">Contact us</a>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-200 px-6 py-4 max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
      <span>© {new Date().getFullYear()} Scandinavian Airways</span>
      <span>Privacy Policy · Cookie Settings · Accessibility</span>
    </div>
  </footer>
));

Footer.displayName = "Footer";
export default Footer;
