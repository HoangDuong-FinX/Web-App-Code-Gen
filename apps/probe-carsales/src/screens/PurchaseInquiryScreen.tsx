import { useState } from "react";
import type { Car } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  car: Car;
  userName: string;
  userPhone: string;
  userEmail: string;
  onSubmit: (data: { offerPrice: number; needsFinancing: boolean; loanTerm: number; downPaymentPercent: number; name: string; phone: string; email: string; notes: string }) => void;
  onCancel: () => void;
}

export default function PurchaseInquiryScreen({ car, userName, userPhone, userEmail, onSubmit, onCancel }: Props) {
  const [offerPrice, setOfferPrice] = useState("");
  const [needsFinancing, setNeedsFinancing] = useState(false);
  const [loanTerm, setLoanTerm] = useState(36);
  const [downPayment, setDownPayment] = useState(20);
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [email, setEmail] = useState(userEmail);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [offerError, setOfferError] = useState(false);

  const validateOffer = (val: string) => {
    if (!val) { setOfferError(false); return; }
    const num = Number(val);
    const min = car.price * 0.5;
    const max = car.price * 1.2;
    setOfferError(num < min || num > max);
  };

  const canSubmit = name && phone && email && !offerError && !submitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ offerPrice: offerPrice ? Number(offerPrice) : 0, needsFinancing, loanTerm, downPaymentPercent: downPayment, name, phone, email, notes });
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <button onClick={onCancel} className="self-start text-sm text-blue-600 hover:underline" aria-label={t("inquiry.back.aria")}>
        \u2190 {t("inquiry.back")}
      </button>
      <h1 className="text-2xl font-bold text-gray-900">{t("inquiry.title")}</h1>
      <div className="bg-gray-50 p-3 rounded-lg">
        <h3 className="font-semibold text-gray-900">{car.make} {car.model} {car.year}</h3>
        <p className="text-blue-700 font-bold">{t("inquiry.askingPrice", { price: formatPrice(car.price, car.currency) })}</p>
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{t("inquiry.yourOffer")}</h2>
      <div>
        <label htmlFor="pi-offer" className="block text-sm font-medium text-gray-700 mb-1">{t("inquiry.offerPrice")}</label>
        <input id="pi-offer" type="number" value={offerPrice} onChange={e => { setOfferPrice(e.target.value); validateOffer(e.target.value); }} className={`w-full px-3 py-2 border rounded-lg text-sm ${offerError ? "border-red-500" : "border-gray-300"}`} aria-label={t("inquiry.offerPrice.aria")} />
        {offerError && <p className="text-xs text-red-600 mt-1" role="alert">{t("inquiry.offerError")}</p>}
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{t("inquiry.financing")}</h2>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={needsFinancing} onChange={e => setNeedsFinancing(e.target.checked)} aria-label={t("inquiry.needFinancing.aria")} className="w-4 h-4" />
        <span className="text-sm text-gray-700">{t("inquiry.needFinancing")}</span>
      </label>
      {needsFinancing && (
        <div className="flex flex-col gap-3 pl-6">
          <div>
            <label htmlFor="pi-term" className="block text-sm font-medium text-gray-700 mb-1">{t("inquiry.loanTerm")}</label>
            <select id="pi-term" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inquiry.loanTerm.aria")}>
              {[12, 24, 36, 48, 60].map(m => (
                <option key={m} value={m}>{t(`inquiry.loanTerm.${m}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pi-down" className="block text-sm font-medium text-gray-700 mb-1">{t("inquiry.downPayment")}: {downPayment}%</label>
            <input id="pi-down" type="range" min={10} max={50} value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-full" aria-label={t("inquiry.downPayment.aria")} />
          </div>
        </div>
      )}
      <h2 className="text-lg font-semibold text-gray-900">{t("inquiry.info")}</h2>
      <div>
        <label htmlFor="pi-name" className="block text-sm font-medium text-gray-700 mb-1">{t("inquiry.name")}</label>
        <input id="pi-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inquiry.name.aria")} />
      </div>
      <div>
        <label htmlFor="pi-phone" className="block text-sm font-medium text-gray-700 mb-1">{t("inquiry.phone")}</label>
        <input id="pi-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inquiry.phone.aria")} />
      </div>
      <div>
        <label htmlFor="pi-email" className="block text-sm font-medium text-gray-700 mb-1">{t("inquiry.email")}</label>
        <input id="pi-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inquiry.email.aria")} />
      </div>
      <div>
        <label htmlFor="pi-notes" className="block text-sm font-medium text-gray-700 mb-1">{t("inquiry.notes")}</label>
        <textarea id="pi-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder={t("inquiry.notes.placeholder")} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inquiry.notes.aria")} />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("inquiry.cancel.aria")}>
          {t("inquiry.cancel")}
        </button>
        <button onClick={handleSubmit} disabled={!canSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50" aria-label={t("inquiry.submit.aria")}>
          {submitting ? t("inquiry.submitting") : t("inquiry.submit")}
        </button>
      </div>
    </div>
  );
}