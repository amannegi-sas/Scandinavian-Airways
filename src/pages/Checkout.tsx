import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useForm } from '../hooks/useForm';

const required = (v: string) => (!v.trim() ? 'This field is required' : null);
const validEmail = (v: string) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email' : null);

export default function Checkout() {
  const navigate = useNavigate();
  const bookingDraft = useAppStore((s) => s.bookingDraft);
  const clearBookingDraft = useAppStore((s) => s.clearBookingDraft);
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm({
    firstName: { initialValue: '', rules: [required] },
    lastName: { initialValue: '', rules: [required] },
    email: { initialValue: '', rules: [required, validEmail] },
    dateOfBirth: { initialValue: '', rules: [required] },
    passport: { initialValue: '' },
  });

  if (!bookingDraft.flight || !bookingDraft.fare) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Checkout</h1>
          <p className="text-slate-500">No flight selected. <button className="bg-transparent border-0 text-[#002f6c] cursor-pointer underline text-base p-0" onClick={() => navigate('/')}>Go back to search</button></p>
        </div>
      </main>
    );
  }

  if (submitted) {
    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xl shadow-[#002f6c]/5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 text-2xl font-bold flex items-center justify-center mx-auto mb-5">✓</div>
          <h1 className="text-2xl font-extrabold mb-4 text-slate-900">Booking confirmed!</h1>
          <p className="text-xs uppercase tracking-widest text-slate-500">Booking reference</p>
          <p className="text-4xl font-black text-[#002f6c] tracking-widest mb-3">{pnr}</p>
          <p className="text-sm text-slate-500 mb-8">A confirmation email has been sent to <strong>{form.values.email}</strong></p>
          <div className="flex flex-col gap-3">
            <button className="bg-[#002f6c] text-white px-6 py-3 rounded-lg font-bold cursor-pointer border-0 hover:bg-[#003d87] transition-colors" onClick={() => navigate('/my-bookings')}>View my bookings</button>
            <button className="border-2 border-[#002f6c] text-[#002f6c] px-6 py-3 rounded-lg font-bold cursor-pointer bg-transparent hover:bg-blue-50 transition-colors" onClick={() => { clearBookingDraft(); navigate('/'); }}>Book another flight</button>
          </div>
        </div>
      </main>
    );
  }

  const { flight, fare } = bookingDraft;

  const handleSubmit = form.handleSubmit(async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    setSubmitted(true);
  });

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Complete your booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div>
          <section className="bg-white border border-slate-200 rounded-xl p-7">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Passenger details</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="First name" id="firstName" value={form.values.firstName}
                  error={form.touched.firstName ? form.errors.firstName : undefined}
                  onChange={(v) => form.setValue('firstName', v)} />
                <FormField label="Last name" id="lastName" value={form.values.lastName}
                  error={form.touched.lastName ? form.errors.lastName : undefined}
                  onChange={(v) => form.setValue('lastName', v)} />
              </div>
              <FormField label="Email" id="email" type="email" value={form.values.email}
                error={form.touched.email ? form.errors.email : undefined}
                onChange={(v) => form.setValue('email', v)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Date of birth" id="dateOfBirth" type="date" value={form.values.dateOfBirth}
                  error={form.touched.dateOfBirth ? form.errors.dateOfBirth : undefined}
                  onChange={(v) => form.setValue('dateOfBirth', v)} />
                <FormField label="Passport number (optional)" id="passport" value={form.values.passport}
                  onChange={(v) => form.setValue('passport', v)} />
              </div>
              <button type="submit"
                className="mt-2 w-full bg-[#002f6c] text-white py-3.5 px-6 rounded-lg text-base font-bold cursor-pointer border-0 hover:bg-[#003d87] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isProcessing}>
                {isProcessing ? 'Processing…' : `Pay ${fare.price.toLocaleString()} ${fare.currency}`}
              </button>
            </form>
          </section>
        </div>

        <aside className="bg-white border border-slate-200 rounded-xl p-6 lg:sticky lg:top-20">
          <h2 className="text-base font-bold text-slate-900 mb-5">Order summary</h2>
          <div className="flex flex-col gap-3">
            {[['Flight', flight.outbound.flightNumber], ['Route', `${flight.outbound.origin.code} → ${flight.outbound.destination.code}`], ['Cabin', fare.label], ['Baggage', fare.baggage], ['EuroBonus', `+${fare.pointsEarned.toLocaleString()} pts`]].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-700">{val}</span>
              </div>
            ))}
            <hr className="border-slate-200" />
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Total</span>
              <strong className="text-[#002f6c] text-lg">{fare.price.toLocaleString()} {fare.currency}</strong>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  error?: string | null;
  onChange: (v: string) => void;
}

function FormField({ label, id, type = 'text', value, error, onChange }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 outline-none transition-colors ${error ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-[#002f6c]'}`}
        autoComplete="off"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
