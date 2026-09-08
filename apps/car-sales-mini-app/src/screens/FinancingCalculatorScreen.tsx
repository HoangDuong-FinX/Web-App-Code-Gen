import { useState, useMemo } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getCarById } from '../fixtures/cars';
import { formatPrice } from '../utils';

interface FinancingCalculatorScreenProps {
  carId: string | null;
  onNavigate: (screen: ScreenId) => void;
}

const ILLUSTRATIVE_RATE = 7.5;
const TERM_OPTIONS = [12, 24, 36, 48, 60, 72];

export default function FinancingCalculatorScreen({ carId, onNavigate }: FinancingCalculatorScreenProps) {
  const car = carId ? getCarById(carId) : undefined;
  const carPrice = car?.price ?? 0;

  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.3));
  const [loanTerm, setLoanTerm] = useState(60);

  const { monthlyPayment, totalInterest, totalCost, loanAmount } = useMemo(() => {
    const loan = Math.max(carPrice - downPayment, 0);
    const monthlyRate = ILLUSTRATIVE_RATE / 100 / 12;
    if (loan <= 0 || monthlyRate <= 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalCost: downPayment, loanAmount: 0 };
    }
    const mp = loan * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    const total = mp * loanTerm;
    return {
      monthlyPayment: Math.round(mp),
      totalInterest: Math.round(total - loan),
      totalCost: Math.round(total + downPayment),
      loanAmount: loan,
    };
  }, [carPrice, downPayment, loanTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10">
        <button onClick={() => onNavigate('car-detail')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('financing.title')}</h1>
      </header>

      {/* Car summary */}
      {car && (
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-3">
          <img src={car.thumbnail} alt={car.name} className="w-16 h-10 rounded object-cover" />
          <div>
            <p className="font-medium text-sm">{car.name}</p>
            <p className="text-blue-600 font-bold text-sm">{formatPrice(car.price)}</p>
          </div>
        </div>
      )}

      {/* Loan Parameters */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">{t('financing.loanParams')}</h2>
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">{t('financing.carPrice')}</label>
            <p className="font-bold text-gray-900">{formatPrice(carPrice)}</p>
          </div>
          <div>
            <label htmlFor="downPayment" className="text-sm text-gray-600 block mb-1">{t('financing.downPayment')}</label>
            <input
              id="downPayment"
              type="range"
              min={0}
              max={carPrice}
              step={10000000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full"
              aria-label={t('financing.downPayment')}
            />
            <p className="text-sm font-medium text-gray-900 mt-1">{formatPrice(downPayment)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-2">{t('financing.loanTerm')}</label>
            <div className="flex flex-wrap gap-2">
              {TERM_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setLoanTerm(m)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    loanTerm === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                  aria-label={`${m} ${t('financing.months')}`}
                >
                  {m} {t('financing.months')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">{t('financing.interestRate')}</label>
            <p className="font-medium text-gray-900">{ILLUSTRATIVE_RATE}%</p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">{t('financing.result')}</h2>
        <div className="bg-white rounded-xl p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('financing.loanAmount')}</span>
            <span className="font-bold text-gray-900">{formatPrice(loanAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('financing.monthlyPayment')}</span>
            <span className="font-bold text-blue-600 text-lg">{formatPrice(monthlyPayment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('financing.totalInterest')}</span>
            <span className="font-medium text-gray-900">{formatPrice(totalInterest)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('financing.totalCost')}</span>
            <span className="font-bold text-gray-900">{formatPrice(totalCost)}</span>
          </div>
        </div>
      </section>

      {/* Disclaimer BR-10 */}
      <div className="px-4 mt-3">
        <p className="text-xs text-gray-400 italic" data-testid="financing-disclaimer">{t('financing.disclaimer')}</p>
      </div>

      {/* CTA */}
      <div className="px-4 mt-4 pb-6">
        <button
          onClick={() => onNavigate('car-detail')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          aria-label={t('financing.contactDealer')}
        >
          {t('financing.contactDealer')}
        </button>
      </div>
    </div>
  );
}
