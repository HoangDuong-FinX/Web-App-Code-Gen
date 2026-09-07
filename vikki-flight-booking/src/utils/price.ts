// Price calculation utilities per BRD BR-04, BR-05
import type { AppState } from '../types/state';

export function calculateTotal(state: AppState): number {
  const { selectedOutboundOffer, selectedReturnOffer, tripType, adults, children, infants,
    outboundServices, returnServices } = state;

  if (!selectedOutboundOffer) return 0;

  // BR-03: price_amount is per seat, not differentiated by adult/child
  const outboundPrice = selectedOutboundOffer.priceAmount;
  const returnPrice = tripType === 'round-trip' && selectedReturnOffer
    ? selectedReturnOffer.priceAmount
    : 0;

  // BR-05: tiền vé = (outbound + return) × (adults + children)
  let ticketTotal = (outboundPrice + returnPrice) * (adults + children);

  // BR-04: infants add flat +10% if any
  if (infants >= 1) {
    ticketTotal += (outboundPrice + returnPrice) * 0.1;
  }

  // Services
  let servicesTotal = 0;
  function sumServices(svc: typeof outboundServices): number {
    let s = 0;
    svc.meals.forEach(m => { s += m.priceAmount * m.quantity; });
    if (svc.baggage) s += svc.baggage.priceAmount;
    svc.seats.forEach(seat => { s += seat.priceAmount; });
    return s;
  }
  servicesTotal += sumServices(outboundServices);
  if (tripType === 'round-trip') servicesTotal += sumServices(returnServices);

  return Math.round(ticketTotal + servicesTotal);
}

export function calculateSubtotal(state: AppState): number {
  const { selectedOutboundOffer, selectedReturnOffer, tripType, adults, children, infants } = state;
  if (!selectedOutboundOffer) return 0;
  const outboundPrice = selectedOutboundOffer.priceAmount;
  const returnPrice = tripType === 'round-trip' && selectedReturnOffer ? selectedReturnOffer.priceAmount : 0;
  let ticketTotal = (outboundPrice + returnPrice) * (adults + children);
  if (infants >= 1) ticketTotal += (outboundPrice + returnPrice) * 0.1;
  return Math.round(ticketTotal);
}

export function calculateServiceFee(state: AppState): number {
  const { outboundServices, returnServices, tripType } = state;
  function sumServices(svc: typeof outboundServices): number {
    let s = 0;
    svc.meals.forEach(m => { s += m.priceAmount * m.quantity; });
    if (svc.baggage) s += svc.baggage.priceAmount;
    svc.seats.forEach(seat => { s += seat.priceAmount; });
    return s;
  }
  let total = sumServices(outboundServices);
  if (tripType === 'round-trip') total += sumServices(returnServices);
  return Math.round(total);
}
