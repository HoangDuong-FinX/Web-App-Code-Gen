import React from 'react';
import { t } from '../i18n';
import type { AppState, FareClass } from '../types/state';
import { Text } from './ui/Text';
import { Divider } from './ui/Divider';

interface BookingSummaryBarProps {
  state: AppState;
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

function calcTotal(state: AppState): number {
  const { searchCriteria, selectedOutboundOffer, selectedReturnOffer, services } = state;
  const paxCount = searchCriteria.adults + searchCriteria.children;
  let fare = 0;
  if (selectedOutboundOffer) fare += selectedOutboundOffer.fareClass.priceAmount;
  if (selectedReturnOffer) fare += selectedReturnOffer.fareClass.priceAmount;
  fare *= paxCount;
  if (searchCriteria.infants > 0) fare += Math.round(fare * 0.1);

  let services = 0;
  // Meals
  // (would need meal catalog prices — approximate from state)
  // Seats
  // For summary bar we just show fare
  return fare;
}

export function BookingSummaryBar({ state }: BookingSummaryBarProps) {
  const { searchCriteria, selectedOutboundOffer, selectedReturnOffer } = state;
  if (!selectedOutboundOffer) return null;

  const paxCount = searchCriteria.adults + searchCriteria.children;
  let fare = selectedOutboundOffer.fareClass.priceAmount;
  if (selectedReturnOffer) fare += selectedReturnOffer.fareClass.priceAmount;
  fare *= paxCount;
  if (searchCriteria.infants > 0) fare += Math.round(fare * 0.1);

  return (
    <aside
      aria-label="Tóm tắt đặt chỗ"
      className="hidden lg:flex flex-col gap-3 w-[330px] shrink-0 p-4 rounded-2xl bg-[var(--gray-50)] border border-[var(--gray-200)] sticky top-4 self-start"
    >
      <Text variant="headline" as="h2">Tóm tắt đặt chỗ</Text>
      <Divider />
      {selectedOutboundOffer && (
        <div className="flex flex-col gap-1">
          <Text variant="body-semibold" as="span">Chuyến đi</Text>
          <Text variant="body" as="span">
            {state.searchCriteria.origin?.code} → {state.searchCriteria.destination?.code}
          </Text>
          <Text variant="body" as="span">
            {selectedOutboundOffer.fareClass.fareClass} · {formatPrice(selectedOutboundOffer.fareClass.priceAmount)}/khách
          </Text>
        </div>
      )}
      {selectedReturnOffer && (
        <div className="flex flex-col gap-1">
          <Text variant="body-semibold" as="span">Chuyến về</Text>
          <Text variant="body" as="span">
            {state.searchCriteria.destination?.code} → {state.searchCriteria.origin?.code}
          </Text>
          <Text variant="body" as="span">
            {selectedReturnOffer.fareClass.fareClass} · {formatPrice(selectedReturnOffer.fareClass.priceAmount)}/khách
          </Text>
        </div>
      )}
      <Divider />
      <div className="flex justify-between">
        <Text variant="body-semibold" as="span">Tổng cộng</Text>
        <Text variant="headline" as="span">{formatPrice(fare)}</Text>
      </div>
    </aside>
  );
}
