import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getCarById } from '../fixtures/cars';
import { formatPrice } from '../utils';

interface CompareScreenProps {
  compareList: string[];
  onToggleCompare: (carId: string) => void;
  onClearCompare: () => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectCar: (carId: string) => void;
}

export default function CompareScreen({
  compareList,
  onToggleCompare,
  onClearCompare,
  onNavigate,
  onSelectCar,
}: CompareScreenProps) {
  const cars = compareList.map((id) => getCarById(id)).filter(Boolean);

  const specRows = [
    { label: t('compare.price'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => formatPrice(c.price) },
    { label: t('carDetail.brand'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => c.brand },
    { label: t('carDetail.model'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => c.model },
    { label: t('carDetail.year'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => String(c.year) },
    { label: t('carDetail.mileage'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => `${c.mileage.toLocaleString()} ${t('common.km')}` },
    { label: t('carDetail.fuelType'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => c.fuelType },
    { label: t('carDetail.transmission'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => c.transmission },
    { label: t('carDetail.engine'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => c.engine },
    { label: t('carDetail.exteriorColor'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => c.exteriorColor },
    { label: t('carDetail.interiorColor'), getValue: (c: NonNullable<ReturnType<typeof getCarById>>) => c.interiorColor },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('car-detail')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
          <h1 className="text-lg font-semibold">{t('compare.title')}</h1>
        </div>
        <button
          onClick={onClearCompare}
          className="text-sm text-red-500"
          aria-label={t('compare.clearAll')}
        >
          {t('compare.clearAll')}
        </button>
      </header>

      {cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-500">{t('compare.addMore')}</p>
          <button
            onClick={() => onNavigate('search-results')}
            className="mt-4 text-blue-600"
            aria-label={t('nav.search')}
          >
            {t('nav.search')}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            {/* Car headers */}
            <thead>
              <tr className="bg-white">
                <th className="w-28 p-2" />
                {cars.map((car) => car && (
                  <th key={car.id} className="p-3 text-center">
                    <button onClick={() => onSelectCar(car.id)} className="block mx-auto" aria-label={car.name}>
                      <img src={car.thumbnail} alt={car.name} className="w-32 h-20 object-cover rounded-lg mx-auto" />
                    </button>
                    <p className="font-semibold text-sm mt-2">{car.name}</p>
                    <p className="text-blue-600 font-bold text-sm">{formatPrice(car.price)}</p>
                    <button
                      onClick={() => onToggleCompare(car.id)}
                      className="mt-1 text-xs text-red-500"
                      aria-label={t('compare.remove')}
                    >
                      {t('compare.remove')}
                    </button>
                  </th>
                ))}
                {cars.length < 3 && (
                  <th className="p-3 text-center">
                    <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-gray-400 text-sm">{t('compare.emptySlot')}</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            {/* Spec rows */}
            <tbody>
              {specRows.map((row, idx) => {
                const values = cars.map((c) => c ? row.getValue(c) : '');
                const allSame = values.every((v) => v === values[0]);
                return (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-sm text-gray-500 font-medium">{row.label}</td>
                    {cars.map((car) => car && (
                      <td
                        key={car.id}
                        className={`px-3 py-2 text-sm text-center ${!allSame ? 'text-blue-700 font-semibold' : 'text-gray-900'}`}
                      >
                        {row.getValue(car)}
                      </td>
                    ))}
                    {cars.length < 3 && <td className="px-3 py-2" />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
