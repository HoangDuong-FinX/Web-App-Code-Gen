import { useState } from 'react';
import type { PassengerCounts } from '../types';
import { t } from '../i18n';

interface Props {
  passengers: PassengerCounts;
  onConfirm: (passengers: PassengerCounts) => void;
  onClose: () => void;
}

export function PassengerCountModal({ passengers, onConfirm, onClose }: Props) {
  const [adults, setAdults] = useState(passengers.adults);
  const [children, setChildren] = useState(passengers.children);
  const [infants, setInfants] = useState(passengers.infants);

  const handleConfirm = () => {
    onConfirm({ adults, children, infants });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-[#F9FBF9] w-full max-w-md rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
        aria-label={t('passengerCount.title')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-medium text-[#191919]">{t('passengerCount.title')}</h2>
          <button type="button" aria-label={t('passengerCount.close.aria')} data-testid="close-action" className="w-8 h-8 flex items-center justify-center text-xl" onClick={onClose}>
            \u2715
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Adults */}
          <CounterRow
            label={t('passengerCount.adults.label')}
            description={t('passengerCount.adults.desc')}
            ariaLabel={t('passengerCount.adults.aria')}
            testId="adult-counter"
            value={adults}
            min={1}
            max={4}
            onChange={(v) => {
              setAdults(v);
              if (infants > v) setInfants(v);
            }}
          />
          {/* Children */}
          <CounterRow
            label={t('passengerCount.children.label')}
            description={t('passengerCount.children.desc')}
            ariaLabel={t('passengerCount.children.aria')}
            testId="child-counter"
            value={children}
            min={0}
            max={4}
            onChange={setChildren}
          />
          {/* Infants */}
          <CounterRow
            label={t('passengerCount.infants.label')}
            description={t('passengerCount.infants.desc')}
            ariaLabel={t('passengerCount.infants.aria')}
            testId="infant-counter"
            value={infants}
            min={0}
            max={adults}
            onChange={setInfants}
          />
        </div>

        <div className="p-4">
          <button
            type="button"
            data-testid="confirm-action"
            aria-label={t('passengerCount.confirm.aria')}
            className="w-full h-14 bg-[#E12127] text-white rounded-lg text-lg font-medium"
            onClick={handleConfirm}
          >
            {t('passengerCount.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

interface CounterRowProps {
  label: string;
  description: string;
  ariaLabel: string;
  testId: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function CounterRow({ label, description, ariaLabel, testId, value, min, max, onChange }: CounterRowProps) {
  return (
    <div className="flex items-center justify-between" data-testid={testId}>
      <div>
        <p className="text-base font-medium text-[#191919]">{label}</p>
        <p className="text-sm text-[#555555]">{description}</p>
      </div>
      <div className="flex items-center gap-3" aria-label={ariaLabel}>
        <button
          type="button"
          aria-label={`${ariaLabel} - gi\u1EA3m`}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-[#E6E8E7] flex items-center justify-center text-lg disabled:opacity-30"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          \u2212
        </button>
        <span className="w-6 text-center text-base font-medium">{value}</span>
        <button
          type="button"
          aria-label={`${ariaLabel} - t\u0103ng`}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-[#E6E8E7] flex items-center justify-center text-lg disabled:opacity-30"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
