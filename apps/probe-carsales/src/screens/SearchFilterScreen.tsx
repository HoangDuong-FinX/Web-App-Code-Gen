import { useState } from "react";
import type { FilterCriteria } from "../types";
import { t } from "../i18n/index";

interface Props {
  criteria: FilterCriteria;
  onApply: (criteria: FilterCriteria) => void;
  onCancel: () => void;
}

export default function SearchFilterScreen({ criteria, onApply, onCancel }: Props) {
  const [form, setForm] = useState<FilterCriteria>({ ...criteria });

  const update = (field: keyof FilterCriteria, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4 p-4" role="dialog" aria-label={t("filter.title")}>
      <h2 className="text-xl font-bold text-gray-900">{t("filter.title")}</h2>
      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="filter-make" className="block text-sm font-medium text-gray-700 mb-1">{t("filter.make")}</label>
          <input id="filter-make" type="text" value={form.make} onChange={e => update("make", e.target.value)} placeholder={t("filter.make.placeholder")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("filter.make.aria")} />
        </div>
        <div>
          <label htmlFor="filter-model" className="block text-sm font-medium text-gray-700 mb-1">{t("filter.model")}</label>
          <input id="filter-model" type="text" value={form.model} onChange={e => update("model", e.target.value)} placeholder={t("filter.model.placeholder")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("filter.model.aria")} />
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-1">{t("filter.yearRange")}</legend>
          <div className="flex gap-2">
            <input type="number" value={form.yearMin} onChange={e => update("yearMin", e.target.value)} placeholder={t("filter.yearMin")} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("filter.yearMin")} />
            <input type="number" value={form.yearMax} onChange={e => update("yearMax", e.target.value)} placeholder={t("filter.yearMax")} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("filter.yearMax")} />
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-1">{t("filter.priceRange")}</legend>
          <div className="flex gap-2">
            <input type="number" value={form.priceMin} onChange={e => update("priceMin", e.target.value)} placeholder={t("filter.priceMin")} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("filter.priceMin")} />
            <input type="number" value={form.priceMax} onChange={e => update("priceMax", e.target.value)} placeholder={t("filter.priceMax")} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("filter.priceMax")} />
          </div>
        </fieldset>
        <div>
          <label htmlFor="filter-fuel" className="block text-sm font-medium text-gray-700 mb-1">{t("filter.fuelType")}</label>
          <input id="filter-fuel" type="text" value={form.fuelType} onChange={e => update("fuelType", e.target.value)} placeholder={t("filter.fuelType.placeholder")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("filter.fuelType.aria")} />
        </div>
        <div>
          <label htmlFor="filter-trans" className="block text-sm font-medium text-gray-700 mb-1">{t("filter.transmission")}</label>
          <input id="filter-trans" type="text" value={form.transmission} onChange={e => update("transmission", e.target.value)} placeholder={t("filter.transmission.placeholder")} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" aria-label={t("filter.transmission.aria")} />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("filter.cancel.aria")}>
          {t("filter.cancel")}
        </button>
        <button onClick={() => onApply(form)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" aria-label={t("filter.apply.aria")}>
          {t("filter.apply")}
        </button>
      </div>
    </div>
  );
}