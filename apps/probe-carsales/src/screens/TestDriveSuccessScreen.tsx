import type { TestDriveBooking } from "../types";
import { t } from "../i18n/index";

interface Props {
  booking: TestDriveBooking;
  onContinueShopping: () => void;
  onViewAppointments: () => void;
}

export default function TestDriveSuccessScreen({ booking, onContinueShopping, onViewAppointments }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 p-4 pt-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <span className="text-3xl text-green-600" aria-hidden="true">\u2713</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 text-center">{t("testDrive.success.title")}</h1>
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <dl className="flex flex-col gap-2">
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("testDrive.success.vehicle")}</dt><dd className="text-sm font-medium text-gray-900">{booking.carMakeModel}</dd></div>
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("testDrive.success.date")}</dt><dd className="text-sm font-medium text-gray-900">{booking.date}</dd></div>
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("testDrive.success.time")}</dt><dd className="text-sm font-medium text-gray-900">{booking.time}</dd></div>
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("testDrive.success.reference")}</dt><dd className="text-sm font-medium text-gray-900">{booking.referenceNumber}</dd></div>
          <div className="flex justify-between"><dt className="text-sm text-gray-500">{t("testDrive.success.location")}</dt><dd className="text-sm font-medium text-gray-900">{booking.location}</dd></div>
        </dl>
      </div>
      <p className="text-sm text-gray-500 text-center">{t("testDrive.success.emailSent")}</p>
      <div className="flex gap-2">
        <button onClick={onContinueShopping} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label={t("testDrive.success.continueShopping.aria")}>
          {t("testDrive.success.continueShopping")}
        </button>
        <button onClick={onViewAppointments} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700" aria-label={t("testDrive.success.viewAppointments.aria")}>
          {t("testDrive.success.viewAppointments")}
        </button>
      </div>
    </div>
  );
}