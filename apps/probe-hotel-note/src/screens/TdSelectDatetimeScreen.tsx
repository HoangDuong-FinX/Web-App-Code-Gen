import { useState, useMemo } from "react";
import { t } from "../i18n";
import { getTimeSlotsForDate } from "../fixtures/showrooms";
import type { ScreenProps } from "./types";

export default function TdSelectDatetimeScreen({ navigate, goBack, setTestDriveBooking, state }: ScreenProps) {
  const booking = state.testDriveBooking;
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slotError, setSlotError] = useState(false);

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const timeSlots = useMemo(
    () => selectedDate && booking.showroomId ? getTimeSlotsForDate(booking.showroomId, selectedDate) : [],
    [selectedDate, booking.showroomId],
  );

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    setSlotError(false);
    setTestDriveBooking({ date: selectedDate, time: selectedTime });
    navigate("td-confirm");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center p-4 gap-3">
        <button data-testid="back-action" aria-label={t("common.back")} onClick={goBack} className="p-2 text-gray-600">
          {"\u2190"}
        </button>
        <h1 className="text-xl font-bold">{t("tdDatetime.title")}</h1>
      </div>

      <div data-testid="step-indicator" aria-label={t("tdDatetime.step")} className="flex items-center justify-center gap-2 px-4 py-3">
        {[t("steps.showroom"), t("steps.datetime"), t("steps.confirm")].map((step, idx) => (
          <div key={step} className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx <= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {idx + 1}
            </span>
            <span className={`text-xs ${idx <= 1 ? "font-semibold text-blue-600" : "text-gray-500"}`}>{step}</span>
            {idx < 2 && <span className="text-gray-300">{"\u2014"}</span>}
          </div>
        ))}
      </div>

      <div className="mx-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-xs font-semibold">{t("tdDatetime.selectedShowroom")}</span>
        <span className="block text-sm">{booking.showroomName}</span>
      </div>

      <div className="p-4">
        <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-1">{t("tdDatetime.selectDate")}</label>
        <input
          id="date-picker"
          data-testid="date-picker"
          aria-label={t("tdDatetime.selectDate")}
          type="date"
          min={tomorrow}
          value={selectedDate}
          onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); setSlotError(false); }}
          className="w-full bg-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {timeSlots.length > 0 && (
        <section className="p-4">
          <h3 className="text-lg font-bold">{t("tdDatetime.selectTime")}</h3>
          <div className="flex flex-wrap gap-2 pt-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                data-testid="time-slot"
                aria-label={`${slot.time} - ${slot.isUnavailable ? t("tdDatetime.slotUnavailable") : t("tdDatetime.slotAvailable")}`}
                disabled={slot.isUnavailable}
                onClick={() => { setSelectedTime(slot.time); setSlotError(false); }}
                className={`px-4 py-2 rounded-full text-sm font-medium ${slot.isUnavailable ? "bg-gray-100 text-gray-400 cursor-not-allowed" : selectedTime === slot.time ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-50"}`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </section>
      )}

      {slotError && (
        <div data-testid="slot-error" aria-live="polite" className="mx-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {t("tdDatetime.slotError")}
        </div>
      )}

      <div className="p-4 mt-auto">
        <button data-testid="datetime-continue" aria-label={t("tdDatetime.continue")} onClick={handleContinue} disabled={!selectedDate || !selectedTime} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50">
          {t("tdDatetime.continue")}
        </button>
      </div>
    </div>
  );
}
