import { useState } from "react";
import type { AdminInquiry } from "../types";
import { t, formatPrice } from "../i18n/index";

interface Props {
  inquiry: AdminInquiry;
  onSend: () => void;
  onCancel: () => void;
}

export default function InquiryRespondScreen({ inquiry, onSend, onCancel }: Props) {
  const isPurchase = inquiry.type === "purchase";
  const actions = isPurchase
    ? ["accept", "counter", "requestInfo", "reject"] as const
    : ["confirm", "reschedule", "reject"] as const;

  const [action, setAction] = useState<string>(actions[0]);
  const [counterPrice, setCounterPrice] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = message.trim() && !submitting;

  const handleSend = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSend();
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <button onClick={onCancel} className="self-start text-sm text-blue-600 hover:underline" aria-label={t("respond.back.aria")}>
        \u2190 {t("respond.back")}
      </button>
      <h1 className="text-2xl font-bold text-gray-900">{t("respond.title")}</h1>
      <div className="bg-gray-50 p-3 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("respond.details")}</h2>
        <dl className="flex flex-col gap-1">
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("respond.customer")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.customerName}</dd></div>
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("respond.contact")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.customerContact}</dd></div>
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("respond.vehicle")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.carMakeModel}</dd></div>
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("respond.type")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.type}</dd></div>
          {inquiry.offerPrice !== undefined && <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("respond.offerPrice")}</dt><dd className="text-sm font-medium text-gray-900">{formatPrice(inquiry.offerPrice, "VND")}</dd></div>}
          {inquiry.financing && <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("respond.financing")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.financing}</dd></div>}
          {inquiry.appointmentDetails && <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("respond.appointment")}</dt><dd className="text-sm font-medium text-gray-900">{inquiry.appointmentDetails}</dd></div>}
        </dl>
        {inquiry.customerNotes && <p className="text-sm text-gray-700 mt-2">{inquiry.customerNotes}</p>}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("respond.yourResponse")}</h2>
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-2">{t("respond.action")}</legend>
          <div className="flex flex-col gap-2">
            {actions.map(a => (
              <label key={a} className="flex items-center gap-2">
                <input type="radio" name="action" value={a} checked={action === a} onChange={() => setAction(a)} className="w-4 h-4" aria-label={t(`respond.action.${a}`)} />
                <span className="text-sm text-gray-700">{t(`respond.action.${a}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      {action === "counter" && (
        <div>
          <label htmlFor="resp-counter" className="block text-sm font-medium text-gray-700 mb-1">{t("respond.counterPrice")}</label>
          <input id="resp-counter" type="number" value={counterPrice} onChange={e => setCounterPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("respond.counterPrice.aria")} />
        </div>
      )}
      <div>
        <label htmlFor="resp-msg" className="block text-sm font-medium text-gray-700 mb-1">{t("respond.message")}</label>
        <textarea id="resp-msg" value={message} onChange={e => setMessage(e.target.value)} placeholder={t("respond.message.placeholder")} rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("respond.message.aria")} />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("respond.cancel.aria")}>
          {t("respond.cancel")}
        </button>
        <button onClick={handleSend} disabled={!canSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50" aria-label={t("respond.send.aria")}>
          {submitting ? t("respond.sending") : t("respond.send")}
        </button>
      </div>
    </div>
  );
}