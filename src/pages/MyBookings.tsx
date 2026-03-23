import { format } from 'date-fns';
import { useBookings } from '../hooks/useCustomerData';

export default function MyBookings() {
  const { data: bookings, isLoading, isError, cancel } = useBookings();

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">My bookings</h1>
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => <div key={i} className="h-40 rounded-xl bg-slate-200 animate-pulse" />)}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">My bookings</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 text-sm">Could not load your bookings. Please try again.</div>
      </main>
    );
  }

  const statusStyles: Record<string, string> = {
    confirmed: 'bg-emerald-50 border-emerald-200',
    cancelled: 'bg-red-50 border-red-200 opacity-70',
    pending: 'bg-amber-50 border-amber-200',
  };
  const statusBadge: Record<string, string> = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">My bookings</h1>
      {!bookings?.length ? (
        <p className="text-slate-500">You have no bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {bookings.map((booking) => (
            <article key={booking.id} className={`border rounded-xl overflow-hidden ${statusStyles[booking.status] ?? 'bg-white border-slate-200'}`}>
              <div className="flex flex-wrap justify-between items-center gap-2 px-6 py-4 border-b border-inherit">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">PNR: {booking.pnr}</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${statusBadge[booking.status] ?? 'bg-slate-100 text-slate-700'}`}>
                    {booking.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400">Booked {format(new Date(booking.createdAt), 'dd MMM yyyy')}</span>
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-3xl font-black text-slate-900">{booking.flight.outbound.origin.code}</span>
                  <span className="text-xs text-slate-500">{booking.flight.outbound.origin.city}</span>
                  <span className="text-sm font-semibold text-slate-700">{format(new Date(booking.flight.outbound.departureTime), 'dd MMM, HH:mm')}</span>
                </div>
                <div className="text-2xl text-slate-300">✈</div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-3xl font-black text-slate-900">{booking.flight.outbound.destination.code}</span>
                  <span className="text-xs text-slate-500">{booking.flight.outbound.destination.city}</span>
                  <span className="text-sm font-semibold text-slate-700">{format(new Date(booking.flight.outbound.arrivalTime), 'dd MMM, HH:mm')}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3 px-6 py-4 border-t border-inherit">
                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>{booking.flight.outbound.flightNumber}</span>
                  <span>{booking.selectedFare.label}</span>
                  <span>{booking.passengers.length} passenger{booking.passengers.length > 1 ? 's' : ''}</span>
                  <strong className="text-slate-900">{booking.totalPrice.toLocaleString()} {booking.currency}</strong>
                </div>
                {booking.status === 'confirmed' && (
                  <button
                    className="px-4 py-2 rounded-lg border-2 border-red-400 text-red-600 text-sm font-semibold bg-transparent cursor-pointer hover:bg-red-50 transition-colors disabled:opacity-60"
                    disabled={cancel.isPending}
                    onClick={() => cancel.mutate(booking.id)}
                  >
                    {cancel.isPending && cancel.variables === booking.id ? 'Cancelling…' : 'Cancel booking'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
