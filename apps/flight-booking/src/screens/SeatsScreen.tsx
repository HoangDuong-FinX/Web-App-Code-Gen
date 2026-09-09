import { useEffect, useState } from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId, SeatInfo, SeatSelection, PassengerForm } from '../types';
import type { NavigationState } from '../App';
import { HoldTimerBadge } from '../components/HoldTimerBadge';
import { sdk } from '../sdk';
import { formatPrice } from '../utils';

interface SeatsScreenProps { navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void; }

export function SeatsScreen({ navigate }: SeatsScreenProps) {
  const t = useT(); const state = useAppState(); const dispatch = useAppDispatch();
  const [seatMap, setSeatMap] = useState<SeatInfo[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const [seatsEmpty, setSeatsEmpty] = useState(false); const [activeLeg, setActiveLeg] = useState<'outbound' | 'return'>('outbound');
  const [activePassenger, setActivePassenger] = useState(0); const [localSeats, setLocalSeats] = useState<SeatSelection[]>([]);

  if (!state.outboundSession) { navigate('search'); return null; }

  useEffect(() => { loadSeatMap(); const existing = activeLeg === 'outbound' ? state.outboundSeats : state.returnSeats; setLocalSeats([...existing]); setActivePassenger(0); }, [activeLeg]);

  async function loadSeatMap() {
    setLoading(true); setError(null); setSeatsEmpty(false);
    const sessionId = activeLeg === 'outbound' ? state.outboundSession!.sessionId : state.returnSession?.sessionId ?? state.outboundSession!.sessionId;
    const res = await sdk.http.get<SeatInfo[]>(`/sessions/${sessionId}/seat-options`);
    if (res.isSuccess && res.data) { if (res.data.length === 0) { setSeatsEmpty(true); } else { setSeatMap(res.data); } } else { setError(t.seats.loadError); }
    setLoading(false);
  }

  function handleSeatClick(seat: SeatInfo) {
    if (!seat.available || seat.priceAmount === null) return;
    const existing = localSeats.find((s: SeatSelection) => s.passengerIndex === activePassenger + 1);
    let updated: SeatSelection[];
    if (existing) { updated = localSeats.map((s: SeatSelection) => s.passengerIndex === activePassenger + 1 ? { ...s, seatId: seat.seatId, seatLabel: seat.seatId, price: seat.priceAmount! } : s); } else { updated = [...localSeats, { passengerIndex: activePassenger + 1, seatId: seat.seatId, seatLabel: seat.seatId, price: seat.priceAmount! }]; }
    setLocalSeats(updated);
    const nextUnassigned = state.passengerForms.findIndex((_: PassengerForm, i: number) => i !== activePassenger && !updated.some((s: SeatSelection) => s.passengerIndex === i + 1));
    if (nextUnassigned >= 0) { setActivePassenger(nextUnassigned); }
  }

  function handleDone() {
    if (activeLeg === 'outbound') { dispatch({ type: 'SET_OUTBOUND_SEATS', payload: localSeats }); } else { dispatch({ type: 'SET_RETURN_SEATS', payload: localSeats }); }
    navigate('services');
  }

  const rows = seatMap.reduce<Record<number, SeatInfo[]>>((acc, seat) => { if (!acc[seat.row]) acc[seat.row] = []; acc[seat.row].push(seat); return acc; }, {});
  const legend = Array.from(new Set(seatMap.map((s: SeatInfo) => s.fareTier))).map((tier: string) => { const sample = seatMap.find((s: SeatInfo) => s.fareTier === tier && s.priceAmount !== null); return { tier, price: sample?.priceAmount ?? 0 }; });
  const selectedSeatIds = new Set(localSeats.map((s: SeatSelection) => s.seatId));

  return (
    <div className="p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-bold text-gray-900">{t.seats.heading}</h1>
      <HoldTimerBadge navigate={navigate} />
      {state.tripType === 'roundTrip' && (<div className="flex gap-2" data-testid="leg-tab-selector"><button className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeLeg === 'outbound' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setActiveLeg('outbound')} aria-label={t.seats.outbound} aria-pressed={activeLeg === 'outbound'}>{t.seats.outbound}</button><button className={`flex-1 py-2 rounded-lg text-sm font-medium ${activeLeg === 'return' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setActiveLeg('return')} aria-label={t.seats.return} aria-pressed={activeLeg === 'return'}>{t.seats.return}</button></div>)}
      <div className="flex gap-2 overflow-x-auto pb-2">{state.passengerForms.map((pax: PassengerForm, idx: number) => { const assigned = localSeats.find((s: SeatSelection) => s.passengerIndex === idx + 1); return (<button key={idx} className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium ${idx === activePassenger ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600'}`} onClick={() => setActivePassenger(idx)} aria-label={`${pax.firstName || `Pax ${idx + 1}`}, ${assigned ? t.seats.seatLabel.replace('{seat}', assigned.seatLabel) : ''}`} data-testid="passenger-chip">{pax.firstName || `Pax ${idx + 1}`}{assigned && <span className="ml-1 text-[10px]">({assigned.seatLabel})</span>}</button>); })}</div>
      {loading && <p className="text-sm text-gray-500">{t.common.loading}</p>}
      {seatsEmpty && <p className="text-red-600 text-sm" data-testid="seats-empty-message">{t.seats.notAvailable}</p>}
      {error && (<div className="bg-red-50 border border-red-200 rounded-lg p-3" data-testid="seats-error-message"><p className="text-red-700 text-sm">{error}</p><button className="text-sm text-red-600 font-medium underline mt-1" onClick={loadSeatMap} aria-label={t.common.retry}>{t.common.retry}</button></div>)}
      {!loading && !seatsEmpty && !error && (<div className="overflow-x-auto" data-testid="seat-map-visualization"><div className="min-w-[280px]">{Object.entries(rows).sort(([a], [b]) => Number(a) - Number(b)).map(([rowNum, seats]) => (<div key={rowNum} className="flex items-center gap-1 mb-1"><span className="w-6 text-[10px] text-gray-400 text-right">{rowNum}</span>{seats.map((seat: SeatInfo) => { const isSelected = selectedSeatIds.has(seat.seatId); const isSelectable = seat.available && seat.priceAmount !== null; let bgColor = 'bg-green-100 text-green-800 hover:bg-green-200'; if (!seat.available || seat.priceAmount === null) { bgColor = 'bg-gray-200 text-gray-400 cursor-not-allowed'; } else if (isSelected) { bgColor = 'bg-red-600 text-white'; } else if (seat.fareTier === 'Hot Seat') { bgColor = 'bg-orange-100 text-orange-800 hover:bg-orange-200'; } else if (seat.fareTier === 'Exit Row') { bgColor = 'bg-blue-100 text-blue-800 hover:bg-blue-200'; } return (<button key={seat.seatId} className={`w-9 h-9 rounded text-[10px] font-medium flex items-center justify-center transition-colors ${bgColor} ${seat.column === 'C' ? 'mr-4' : ''}`} disabled={!isSelectable} onClick={() => handleSeatClick(seat)} aria-label={t.seats.seatLabel.replace('{seat}', seat.seatId)}>{!seat.available ? String.fromCharCode(10005) : seat.column}</button>); })}</div>))}</div></div>)}
      {legend.length > 0 && (<div className="flex flex-col gap-1 mt-2">{legend.map((l: { tier: string; price: number }) => (<div key={l.tier} className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${l.tier === 'Hot Seat' ? 'bg-orange-400' : l.tier === 'Exit Row' ? 'bg-blue-400' : 'bg-green-400'}`} aria-hidden="true" /><span className="text-xs text-gray-600">{l.tier}</span><span className="text-xs text-gray-500">{formatPrice(l.price)}</span></div>))}</div>)}
      <button className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors" onClick={handleDone} aria-label={t.seats.done} data-testid="seats-done">{t.seats.done}</button>
    </div>
  );
}
