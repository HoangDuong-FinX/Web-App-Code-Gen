import React, { useState, useEffect } from 'react';
import { ScreenId } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { loadAncillaryOptions } from '../sdk/http';
import { AncillaryOption } from '../types';
import { QuantityCounter } from '../components/QuantityCounter';
import { formatCurrency } from '../utils/format';

interface Props {
  navigate: (screen: ScreenId) => void;
  category: string;
}

export const AncillaryDetail: React.FC<Props> = ({ navigate, category }) => {
  const store = useStore();
  const [options, setOptions] = useState<AncillaryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const title = category === 'meals' ? t('ancillary.meals.title') : t('ancillary.baggage.title');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await loadAncillaryOptions(store.sessionId!, store.selectedOfferId!);
        if (!cancelled) {
          const filtered = data.filter((o) => o.category === category);
          setOptions(filtered);
          const existingQuantities: Record<string, number> = {};
          store.ancillarySelections
            .filter((s) => filtered.some((o) => o.optionId === s.optionId))
            .forEach((s) => {
              existingQuantities[s.optionId] = (existingQuantities[s.optionId] ?? 0) + s.quantity;
            });
          setQuantities(existingQuantities);
        }
      } catch {
        if (!cancelled) {
          setOptions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [category, store.sessionId, store.selectedOfferId]);

  const handleQuantityChange = (optionId: string, newVal: number) => {
    setQuantities((prev) => ({ ...prev, [optionId]: newVal }));
  };

  const handleConfirm = () => {
    const newSelections = store.ancillarySelections.filter(
      (s) => !options.some((o) => o.optionId === s.optionId)
    );
    options.forEach((opt) => {
      const qty = quantities[opt.optionId] ?? 0;
      if (qty > 0) {
        store.passengerIds.forEach((paxId) => {
          newSelections.push({
            passengerId: paxId,
            optionId: opt.optionId,
            name: opt.name,
            price: opt.unitPrice,
            quantity: qty,
          });
        });
      }
    });
    store.update({ ancillarySelections: newSelections });
    navigate('services-grid');
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button type="button" onClick={() => navigate('services-grid')} aria-label={t('common.back.ariaLabel')} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 20 }}>
          ←
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{title}</h1>
      </div>

      {/* Items */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#666' }}>...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.map((opt) => (
            <div key={opt.optionId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, border: '1px solid #e0e0e0', borderRadius: 8 }}>
              <div>
                <span style={{ fontSize: 14, display: 'block' }}>{opt.name}</span>
                <span style={{ fontSize: 13, color: '#E31837' }}>{formatCurrency(opt.unitPrice)}</span>
              </div>
              <QuantityCounter
                value={quantities[opt.optionId] ?? 0}
                ariaLabel={t('ancillary.quantity.ariaLabel', { itemName: opt.name })}
                onChange={(v) => handleQuantityChange(opt.optionId, v)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 20 }}>
        <button
          type="button"
          onClick={handleConfirm}
          aria-label={t('ancillary.confirm.ariaLabel')}
          style={{
            width: '100%', padding: 14, borderRadius: 8, border: 'none',
            backgroundColor: '#E31837', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer',
          }}
        >
          {t('ancillary.confirm')}
        </button>
      </div>
    </div>
  );
};
