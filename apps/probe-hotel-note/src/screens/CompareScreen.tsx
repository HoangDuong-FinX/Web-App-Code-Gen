import React from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { useCompare } from '../context/CompareContext';

export default function CompareScreen(): React.JSX.Element {
  const { navigate } = useApp();
  const { compareList, removeFromCompare } = useCompare();

  const allSpecLabels: string[] = [];
  for (const car of compareList) {
    for (const spec of car.specs) {
      if (!allSpecLabels.includes(spec.label)) allSpecLabels.push(spec.label);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('catalog')} aria-label={t('compare.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('compare.title')}</h1>
      </header>

      <div className="flex gap-4 px-4 overflow-x-auto pb-4 scrollbar-hide">
        {compareList.map(car => (
          <div key={car.id} className="flex-shrink-0 flex flex-col items-center gap-2" style={{ width: `${100 / Math.max(compareList.length, 1)}%`, minWidth: '120px' }}>
            <img src={car.thumbnailUrl} alt={car.name} className="w-full aspect-[4/3] object-cover rounded-lg" />
            <span className="text-xs font-bold text-center">{car.name}</span>
            <span className="text-xs text-blue-600 text-center">{car.formattedPrice}</span>
            <button type="button" onClick={() => removeFromCompare(car.id)} aria-label={`${t('compare.remove')} ${car.name}`} data-testid="remove-compare" className="text-gray-400 hover:text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="px-4 flex-1">
        {allSpecLabels.map(label => {
          const values = compareList.map(car => {
            const found = car.specs.find(s => s.label === label);
            return found?.value ?? '\u2014';
          });
          const allSame = values.every(v => v === values[0]);
          return (
            <div key={label} className="flex py-2.5 border-b">
              <span className="text-xs font-bold text-gray-500 w-[30%] flex-shrink-0">{label}</span>
              <div className="flex flex-1 gap-2">
                {values.map((v, i) => (
                  <span key={i} className={`text-sm flex-1 text-center ${!allSame ? 'text-blue-600 font-medium' : ''}`}>{v}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {compareList.length < 3 && (
        <div className="p-4">
          <button type="button" onClick={() => navigate('catalog')} aria-label={t('compare.addCarAria')} data-testid="add-car-compare" className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-blue-400 hover:text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            {t('compare.addCar')}
          </button>
        </div>
      )}
    </div>
  );
}
