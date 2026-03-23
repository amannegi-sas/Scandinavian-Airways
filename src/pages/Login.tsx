import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { mockMember } from '../api/mockData';

export default function Login() {
  const navigate = useNavigate();
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const setMember = useAppStore((s) => s.setMember);
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (memberId === mockMember.memberId && password === 'password') {
      setMember(mockMember);
      setAuthenticated(true);
      navigate('/eurobonus');
    } else {
      setError('Invalid member ID or password. Try EB123456789 / password');
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl shadow-[#002f6c]/5 p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Sign in to My SA</h1>
        <p className="text-sm text-slate-500 mb-6">Access your bookings, EuroBonus profile and more.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mid" className="text-[11px] font-bold uppercase tracking-widest text-slate-500">EuroBonus number or email</label>
            <input
              id="mid"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="EB123456789"
              required
              className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#002f6c] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pwd" className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Password</label>
            <input
              id="pwd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#002f6c] transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#002f6c] text-white py-3 rounded-lg font-bold text-sm cursor-pointer border-0 hover:bg-[#003d87] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-1"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-5">
          Demo credentials: <code className="bg-slate-100 px-1 rounded">EB123456789</code> / <code className="bg-slate-100 px-1 rounded">password</code>
        </p>
      </div>
    </main>
  );
}
