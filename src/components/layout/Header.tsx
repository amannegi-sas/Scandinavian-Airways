import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/appStore";

const navItems = [
  { label: "Book", to: "/" },
  { label: "Flight Status", to: "/flight-status" },
  { label: "Destinations", to: "/destinations" },
  { label: "My Bookings", to: "/my-bookings" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const member = useAppStore((s) => s.member);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const setMember = useAppStore((s) => s.setMember);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setAuthenticated(false);
    setMember(null);
    navigate("/");
  };

  return (
    <header className="bg-[#002f6c] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 text-white no-underline shrink-0" aria-label="Airways Home">
          <svg viewBox="0 0 80 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-[60px] h-6">
            <rect width="80" height="32" rx="4" fill="#002f6c" />
            <text x="12" y="22" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="white">Airways</text>
          </svg>
          <span className="text-sm tracking-wide opacity-90 hidden sm:inline">Scandinavian Airways</span>
        </Link>

        <nav className={`${menuOpen ? "flex" : "hidden"} md:flex md:flex-row flex-col absolute md:static top-16 left-0 right-0 bg-[#002f6c] md:bg-transparent px-6 md:px-0 py-4 md:py-0 border-t border-white/10 md:border-0 gap-1 flex-1`} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-md text-sm font-medium transition-colors no-underline w-full md:w-auto ${isActive ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10 hover:text-white"}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          {isAuthenticated && member ? (
            <div className="flex items-center gap-3">
              <Link to="/eurobonus" className="flex items-center gap-1.5 text-white no-underline text-sm font-medium">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${member.tier === "gold" ? "bg-yellow-400" : member.tier === "diamond" ? "bg-sky-300" : "bg-white/50"}`} />
                {member.firstName}
              </Link>
              <button className="bg-transparent border-0 cursor-pointer text-white/80 text-sm hover:text-white" onClick={handleSignOut}>Sign out</button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-[#002f6c] px-4 py-1.5 rounded-md text-sm font-bold no-underline hover:bg-slate-100 transition-colors">Sign in</Link>
          )}
          <button
            className="md:hidden flex flex-col gap-1.5 bg-transparent border-0 cursor-pointer p-1"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="block w-5.5 h-0.5 bg-white rounded" />
            <span className="block w-5.5 h-0.5 bg-white rounded" />
            <span className="block w-5.5 h-0.5 bg-white rounded" />
          </button>
        </div>
      </div>
    </header>
  );
}
