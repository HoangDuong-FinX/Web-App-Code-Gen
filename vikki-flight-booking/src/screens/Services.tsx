import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { t } from '../i18n';
import { fixtureAncillaryOptions, fixtureSeatMap } from '../fixtures';
import { AncillaryOption, Seat } from '../types';

interface ServicesProps {
  airports: any[];
  cityPairs: any[];
  masterDataError: string | null;
  masterDataLoading: boolean;
}

const Services: React.FC<ServicesProps> = () => {
  const { navigateTo, updateBooking } = useStore();
  const [meals, setMeals] = useState<AncillaryOption[]>([]);
  const [baggage, setBaggage] = useState<AncillaryOption[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ancillary, seatMap] = await Promise.all([
          fixtureAncillaryOptions(),
          fixtureSeatMap(),
        ]);
        setMeals(ancillary.meals);
        setBaggage(ancillary.baggage);
        setSeats(seatMap.seats);
      } catch (err) {
        setError(t('services.error'));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // In a real app, would submit ancillary and seat selections
      navigateTo('payment');
    } catch (err) {
      setError(t('services.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading services...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('services.title')}</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="font-semibold mb-3">Available Meals</h2>
        <div className="space-y-2">
          {meals.map((meal) => (
            <div key={meal.option_id} className="p-3 bg-blue-50 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{meal.name}</div>
                <div className="text-sm text-gray-600">{meal.price_amount.toLocaleString()} VND</div>
              </div>
              <input type="checkbox" defaultChecked={false} />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-3">Available Baggage</h2>
        <div className="space-y-2">
          {baggage.map((bag) => (
            <div key={bag.option_id} className="p-3 bg-blue-50 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{bag.name}</div>
                <div className="text-sm text-gray-600">{bag.price_amount.toLocaleString()} VND</div>
              </div>
              <input type="checkbox" defaultChecked={false} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full p-3 bg-blue-600 text-white rounded font-medium disabled:opacity-50"
        aria-label={t('services.continue')}
      >
        {submitting ? 'Submitting...' : t('services.continue')}
      </button>
    </div>
  );
};

export default Services;
