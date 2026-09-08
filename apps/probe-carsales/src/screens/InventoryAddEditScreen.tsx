import { useState } from "react";
import { t } from "../i18n/index";
import { getCarById } from "../fixtures/cars";

interface Props {
  editCarId: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function InventoryAddEditScreen({ editCarId, onSave, onCancel }: Props) {
  const existing = editCarId ? getCarById(editCarId) : null;
  const isEdit = !!existing;

  const [make, setMake] = useState(existing?.make ?? "");
  const [model, setModel] = useState(existing?.model ?? "");
  const [year, setYear] = useState(existing?.year?.toString() ?? "");
  const [color, setColor] = useState(existing?.color ?? "");
  const [engine, setEngine] = useState(existing?.engine ?? "");
  const [transmission, setTransmission] = useState(existing?.transmission ?? "");
  const [fuelType, setFuelType] = useState(existing?.fuelType ?? "");
  const [mileage, setMileage] = useState(existing?.mileage?.toString() ?? "");
  const [interior, setInterior] = useState(existing?.interior ?? "");
  const [price, setPrice] = useState(existing?.price?.toString() ?? "");
  const [negotiable, setNegotiable] = useState(existing?.priceNegotiable ?? false);
  const [features, setFeatures] = useState(existing?.features?.join(", ") ?? "");
  const [status, setStatus] = useState<string>(existing?.status ?? "available");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = make && model && year && price && !submitting;

  const handleSave = () => {
    if (!canSubmit) return;
    setError("");
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSave();
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <button onClick={onCancel} className="self-start text-sm text-blue-600 hover:underline" aria-label={t("inventoryForm.back.aria")}>
        \u2190 {t("inventoryForm.back")}
      </button>
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? t("inventoryForm.editTitle") : t("inventoryForm.addTitle")}</h1>
      <h2 className="text-lg font-semibold text-gray-900">{t("inventoryForm.basicInfo")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="inv-make" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.make")}</label>
          <input id="inv-make" type="text" value={make} onChange={e => setMake(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.make.aria")} />
        </div>
        <div>
          <label htmlFor="inv-model" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.model")}</label>
          <input id="inv-model" type="text" value={model} onChange={e => setModel(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.model.aria")} />
        </div>
        <div>
          <label htmlFor="inv-year" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.year")}</label>
          <input id="inv-year" type="number" value={year} onChange={e => setYear(e.target.value)} required min="1900" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.year.aria")} />
        </div>
        <div>
          <label htmlFor="inv-color" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.color")}</label>
          <input id="inv-color" type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.color.aria")} />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{t("inventoryForm.specs")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="inv-engine" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.engine")}</label>
          <input id="inv-engine" type="text" value={engine} onChange={e => setEngine(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.engine.aria")} />
        </div>
        <div>
          <label htmlFor="inv-trans" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.transmission")}</label>
          <input id="inv-trans" type="text" value={transmission} onChange={e => setTransmission(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.transmission.aria")} />
        </div>
        <div>
          <label htmlFor="inv-fuel" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.fuelType")}</label>
          <input id="inv-fuel" type="text" value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.fuelType.aria")} />
        </div>
        <div>
          <label htmlFor="inv-mileage" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.mileage")}</label>
          <input id="inv-mileage" type="number" value={mileage} onChange={e => setMileage(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.mileage.aria")} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="inv-interior" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.interior")}</label>
          <input id="inv-interior" type="text" value={interior} onChange={e => setInterior(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.interior.aria")} />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{t("inventoryForm.pricing")}</h2>
      <div>
        <label htmlFor="inv-price" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.askingPrice")}</label>
        <input id="inv-price" type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.askingPrice.aria")} />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={negotiable} onChange={e => setNegotiable(e.target.checked)} className="w-4 h-4" aria-label={t("inventoryForm.negotiable.aria")} />
        <span className="text-sm text-gray-700">{t("inventoryForm.negotiable")}</span>
      </label>
      <h2 className="text-lg font-semibold text-gray-900">{t("inventoryForm.features")}</h2>
      <div>
        <label htmlFor="inv-features" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.featuresInput")}</label>
        <textarea id="inv-features" value={features} onChange={e => setFeatures(e.target.value)} placeholder={t("inventoryForm.featuresInput.placeholder")} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.featuresInput.aria")} />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{t("inventoryForm.availability")}</h2>
      <div>
        <label htmlFor="inv-status" className="block text-sm font-medium text-gray-700 mb-1">{t("inventoryForm.status")}</label>
        <select id="inv-status" value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("inventoryForm.status.aria")}>
          <option value="available">{t("inventoryForm.status.available")}</option>
          <option value="sold">{t("inventoryForm.status.sold")}</option>
          <option value="pending">{t("inventoryForm.status.pending")}</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("inventoryForm.cancel.aria")}>
          {t("inventoryForm.cancel")}
        </button>
        <button onClick={handleSave} disabled={!canSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50" aria-label={t("inventoryForm.save.aria")}>
          {submitting ? t("inventoryForm.saving") : t("inventoryForm.save")}
        </button>
      </div>
    </div>
  );
}