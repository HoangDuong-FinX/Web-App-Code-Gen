import type {
  FareClass,
  AncillarySelection,
  SeatSelection,
} from '../types';

export interface BookingTotals {
  fareTotal: number;
  servicesTotal: number;
  seatsTotal: number;
  grandTotal: number;
}

export function computeBookingTotals(
  outboundOffer: FareClass | null,
  returnOffer: FareClass | null,
  adults: number,
  children: number,
  outboundAncillaries: AncillarySelection[],
  returnAncillaries: AncillarySelection[],
  outboundSeat: SeatSelection | null,
  returnSeat: SeatSelection | null
): BookingTotals {
  const outboundPrice = outboundOffer?.priceAmount ?? 0;
  const returnPrice = returnOffer?.priceAmount ?? 0;
  const fareTotal = (outboundPrice + returnPrice) * (adults + children);

  let servicesTotal = 0;
  for (const sel of outboundAncillaries) {
    servicesTotal += sel.priceAmount * sel.quantity;
  }
  for (const sel of returnAncillaries) {
    servicesTotal += sel.priceAmount * sel.quantity;
  }

  let seatsTotal = 0;
  if (outboundSeat) seatsTotal += outboundSeat.priceAmount;
  if (returnSeat) seatsTotal += returnSeat.priceAmount;

  return {
    fareTotal,
    servicesTotal,
    seatsTotal,
    grandTotal: fareTotal + servicesTotal + seatsTotal,
  };
}
