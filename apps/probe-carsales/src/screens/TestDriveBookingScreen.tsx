import { useState } from "react";
import type { Car, AvailableSlot } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  car: Car;
  userName: string;
  userPhone: string;
  userEmail: string;
  availableSlots: AvailableSlot[];
  onSubmit: (data: { date: string; time: string; name: string; phone: string; email: string; notes: string }) => void;
  onCancel: () => void;
}

export default function TestDriveBookingScreen({ car, userName, userPhone, userEmail, availableSlots, onSubmit, onCancel }: Props) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const minDate = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [email, setEmail] = useState(userEmail);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const availableTimes = availableSlots.filter(s => s.available);
  const canSubmit = date && time && name && phone && email && !submitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ date, time, name, phone, email, notes });
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <button onClick={onCancel} className="self-start text-sm text-blue-600 hover:underline" aria-label={t("testDrive.back.aria")}>
        \u2190 {t("testDrive.back")}
      </button>
      <h1 className="text-2xl font-bold text-gray-900">{t("testDrive.title")}</h1>
      <div className="bg-gray-50 p-3 rounded-lg">
        <h3 className="font-semibold text-gray-900">{car.make} {car.model} {car.year}</h3>
        <p className="text-blue-700 font-bold">{formatPrice(car.price, car.currency)}</p>
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{t("testDrive.dateTime")}</h2>
      <div>
        <label htmlFor="td-date" className="block text-sm font-medium text-gray-700 mb-1">{t("testDrive.date")}</label>
        <input id="td-date" type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("testDrive.date.aria")} />
      </div>
      <div>
        <label htmlFor="td-time" className="block text-sm font-medium text-gray-700 mb-1">{t("testDrive.time")}</label>
        <select id="td-time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("testDrive.time.aria")}>
          <option value="">--</option>
          {availableTimes.map(s => (
            <option key={s.time} value={s.time}>{s.time}</option>
          ))}
        </select>
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{t("testDrive.info")}</h2>
      <div>
        <label htmlFor="td-name" className="block text-sm font-medium text-gray-700 mb-1">{t("testDrive.name")}</label>
        <input id="td-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("testDrive.name.aria")} />
      </div>
      <div>
        <label htmlFor="td-phone" className="block text-sm font-medium text-gray-700 mb-1">{t("testDrive.phone")}</label>
        <input id="td-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("testDrive.phone.aria")} />
      </div>
      <div>
        <label htmlFor="td-email" className="block text-sm font-medium text-gray-700 mb-1">{t("testDrive.email")}</label>
        <input id="td-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("testDrive.email.aria")} />
      </div>
      <div>
        <label htmlFor="td-notes" className="block text-sm font-medium text-gray-700 mb-1">{t("testDrive.notes")}</label>
        <textarea id="td-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder={t("testDrive.notes.placeholder")} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("testDrive.notes.aria")} />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("testDrive.cancel.aria")}>
          {t("testDrive.cancel")}
        </button>
        <button onClick={handleSubmit} disabled={!canSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50" aria-label={t("testDrive.confirm.aria")}>
          {submitting ? t("testDrive.submitting") : t("testDrive.confirm")}
        </button>
      </div>
    </div>
  );
}