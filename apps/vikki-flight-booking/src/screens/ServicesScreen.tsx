import React, { useState, useEffect, useCallback } from 'react';
import { useBooking, useHoldTimer } from '../context/BookingContext';
import { useI18n } from '../i18n';
import { TopBar } from '../components/TopBar';
import { ButtonBig } from '../components/ButtonBig';
import { InlineError } from '../components/InlineError';
import { ServiceTile } from '../components/ServiceTile';
import { Spinner } from '../components/Spinner';
import { fetchAncillaryOptions, submitAncillarySelections, submitSeatSelections } from '../api/services';
import type { AncillaryOption, AncillarySelectionPayload, SeatSelectionPayload } from '../api/services';
import type { ScreenId, ServiceSelection } from '../types';

interface ServicesScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

interface ServiceCategory {
  category: string;
  icon: string;
  title: string;
  description: string;
  options: AncillaryOption[];
  selectionCount: number;
}

export function ServicesScreen({ onNavigate }: ServicesScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();

  const [ancillaryOptions, setAncillaryOptions] = useState<AncillaryOption[]>([]);
  const [returnAncillaryOptions, setReturnAncillaryOptions] = useState<AncillaryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Local selection state: map of optionId -> count per passenger
  const [selections, setSelections] = useState<Map<string, number>>(new Map());
  const [returnSelections, setReturnSelections] = useState<Map<string, number>>(new Map());

  const isRoundTrip = state.tripType === 'round';

  // Hold timer
  const earliestExpiry = isRoundTrip && state.returnSession
    ? (new Date(state.outboundSession?.expiresAt ?? '').getTime() < new Date(state.returnSession.expiresAt).getTime()
      ? state.outboundSession?.expiresAt ?? null
      : state.returnSession.expiresAt)
    : state.outboundSession?.expiresAt ?? null;

  const handleExpire = useCallback(() => {
    onNavigate('hold-expired');
  }, [onNavigate]);

  useHoldTimer(earliestExpiry, handleExpire);

  // Load ancillary options on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const sessionId = state.outboundSession?.sessionId;
        if (!sessionId) {
          onNavigate('search');
          return;
        }

        const outboundResult = await fetchAncillaryOptions(sessionId);
        if (cancelled) return;
        setAncillaryOptions(outboundResult.options);

        if (isRoundTrip && state.returnSession) {
          const returnResult = await fetchAncillaryOptions(state.returnSession.sessionId);
          if (cancelled) return;
          setReturnAncillaryOptions(returnResult.options);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const httpErr = err as { status?: number };
        if (httpErr.status === 500) {
          onNavigate('hold-expired');
          return;
        }
        setError(t('services.loadFailed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [state.outboundSession, state.returnSession, isRoundTrip, onNavigate, t]);

  // Group options into categories for tile display
  const categories: ServiceCategory[] = React.useMemo(() => {
    const catMap = new Map<string, AncillaryOption[]>();
    for (const opt of ancillaryOptions) {
      const existing = catMap.get(opt.category) ?? [];
      existing.push(opt);
      catMap.set(opt.category, existing);
    }

    const iconMap: Record<string, string> = {
      seat: '💺',
      meal: '🍽️',
      baggage: '🧳',
      insurance: '🛡️',
    };

    const titleMap: Record<string, string> = {
      seat: 'Chọn ghế',
      meal: 'Suất ăn',
      baggage: 'Hành lý',
      insurance: 'Bảo hiểm',
    };

    const descMap: Record<string, string> = {
      seat: 'Chọn chỗ ngồi yêu thích',
      meal: 'Đặt suất ăn trên máy bay',
      baggage: 'Thêm hành lý ký gửi',
      insurance: 'Bảo hiểm chuyến bay',
    };

    return Array.from(catMap.entries()).map(([cat, opts]) => {
      const count = opts.reduce((sum, opt) => sum + (selections.get(opt.option_id) ?? 0), 0);
      return {
        category: cat,
        icon: iconMap[cat] ?? '📦',
        title: titleMap[cat] ?? cat,
        description: descMap[cat] ?? '',
        options: opts,
        selectionCount: count,
      };
    });
  }, [ancillaryOptions, selections]);

  // Handle tile tap — for simplicity in this batch, toggle one selection per category
  const handleTileTap = useCallback((category: string) => {
    const opts = ancillaryOptions.filter(o => o.category === category);
    if (opts.length === 0) return;

    // Simple toggle: if nothing selected, select first option qty 1; if selected, deselect
    const firstOpt = opts[0];
    setSelections(prev => {
      const next = new Map(prev);
      const current = next.get(firstOpt.option_id) ?? 0;
      if (current > 0) {
        next.delete(firstOpt.option_id);
      } else {
        next.set(firstOpt.option_id, 1);
      }
      return next;
    });
  }, [ancillaryOptions]);

  // Submit selections and navigate to review
  const handleContinue = useCallback(async () => {
    setSubmitting(true);
    setError('');

    try {
      const sessionId = state.outboundSession?.sessionId;
      if (!sessionId) {
        onNavigate('search');
        return;
      }

      // Build ancillary selections payload (BR-09: qty as repeated elements)
      const ancillaryPayload: AncillarySelectionPayload[] = [];
      const passengerIds = state.passengerIds;

      selections.forEach((qty, optionId) => {
        for (let i = 0; i < qty; i++) {
          // Assign to first passenger for simplicity; full modal would assign per-passenger
          const passengerId = passengerIds[0] ?? 'pax_1';
          ancillaryPayload.push({ passenger_id: passengerId, option_id: optionId });
        }
      });

      // Submit outbound ancillary selections (even if empty — server accepts empty array)
      await submitAncillarySelections(sessionId, ancillaryPayload);

      // Submit outbound seat selections (empty for now; seat modal deferred)
      const seatPayload: SeatSelectionPayload[] = state.selectedSeats.map(s => ({
        passenger_index: s.passengerIndex,
        seat_id: s.seatId,
      }));
      if (seatPayload.length > 0) {
        await submitSeatSelections(sessionId, seatPayload);
      }

      // Round-trip: submit return leg
      if (isRoundTrip && state.returnSession) {
        const returnAncillaryPayload: AncillarySelectionPayload[] = [];
        const returnPassengerIds = state.returnPassengerIds;

        returnSelections.forEach((qty, optionId) => {
          for (let i = 0; i < qty; i++) {
            const passengerId = returnPassengerIds[0] ?? 'pax_1';
            returnAncillaryPayload.push({ passenger_id: passengerId, option_id: optionId });
          }
        });

        await submitAncillarySelections(state.returnSession.sessionId, returnAncillaryPayload);

        const returnSeatPayload: SeatSelectionPayload[] = state.returnSelectedSeats.map(s => ({
          passenger_index: s.passengerIndex,
          seat_id: s.seatId,
        }));
        if (returnSeatPayload.length > 0) {
          await submitSeatSelections(state.returnSession.sessionId, returnSeatPayload);
        }
      }

      // Store selections in context
      const serviceSelections: ServiceSelection[] = [];
      selections.forEach((qty, optionId) => {
        const opt = ancillaryOptions.find(o => o.option_id === optionId);
        if (opt) {
          for (let i = 0; i < qty; i++) {
            serviceSelections.push({
              passengerId: state.passengerIds[0] ?? 'pax_1',
              optionId: opt.option_id,
              name: opt.title,
              price: opt.unit_price,
            });
          }
        }
      });
      dispatch({ type: 'SET_SELECTED_SERVICES', payload: serviceSelections });

      // Navigate to review
      onNavigate('review');
    } catch (err: unknown) {
      const httpErr = err as { status?: number };
      if (httpErr.status === 500) {
        onNavigate('hold-expired');
        return;
      }
      setError(t('services.submitFailed'));
    } finally {
      setSubmitting(false);
    }
  }, [
    state.outboundSession, state.returnSession, state.passengerIds,
    state.returnPassengerIds, state.selectedSeats, state.returnSelectedSeats,
    selections, returnSelections, ancillaryOptions, isRoundTrip,
    dispatch, onNavigate, t,
  ]);

  // Passengers summary for header
  const passengerNames = state.passengers.map(p => p.fullName).join(', ');
  const flightSummary = state.selectedOutboundOffer
    ? `${state.origin?.code ?? ''} → ${state.destination?.code ?? ''}`
    : '';
  const headerSummary = `${passengerNames} • ${flightSummary}`;

  if (loading) {
    return (
      <div className="screen screen--services">
        <TopBar
          title={t('services.title')}
          showBackArrow
          onBack={() => onNavigate('passengers')}
          ariaLabel={t('services.title')}
        />
        <div className="screen__content screen__content--center">
          <Spinner size="large" ariaLabel={t('services.loading')} />
        </div>
      </div>
    );
  }

  return (
    <div className="screen screen--services">
      <TopBar
        title={t('services.title')}
        showBackArrow
        onBack={() => onNavigate('passengers')}
        ariaLabel={t('services.title')}
      />
      <div className="screen__content">
        <div className="services__header">
          <p className="services__summary" aria-label={t('services.headerSummary')}>
            {headerSummary}
          </p>
        </div>

        {categories.length === 0 && !error && (
          <p className="services__empty">{t('services.noOptions')}</p>
        )}

        <div className="services__grid">
          {categories.map((cat) => (
            <ServiceTile
              key={cat.category}
              icon={cat.icon}
              title={cat.title}
              description={cat.description}
              selectionBadge={cat.selectionCount}
              ariaLabel={t('services.tile.ariaLabel')
                .replace('{title}', cat.title)
                .replace('{count}', String(cat.selectionCount))}
              onTap={() => handleTileTap(cat.category)}
            />
          ))}
        </div>

        <InlineError visible={!!error}>{error}</InlineError>

        <div className="services__actions">
          <ButtonBig
            variant="Active"
            onClick={handleContinue}
            ariaLabel={t('services.continue.ariaLabel')}
            loading={submitting}
            disabled={submitting}
          >
            {t('services.continue')}
          </ButtonBig>
        </div>
      </div>
    </div>
  );
}
