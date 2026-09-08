import { t } from "../i18n";
import { getActivityById } from "../fixtures/activities";
import type { ScreenProps } from "./types";

export default function ActivityDetailScreen({ goBack, setCurrentCar, state }: ScreenProps) {
  const activity = state.currentActivityId
    ? getActivityById(state.currentActivityId)
    : undefined;

  if (!activity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">{t("catalog.empty.title")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center p-4 gap-3">
        <button
          data-testid="back-action"
          aria-label={t("common.back")}
          onClick={goBack}
          className="p-2 text-gray-600"
        >
          \u2190
        </button>
        <h1 className="text-xl font-bold">{t("activityDetail.title")}</h1>
      </div>

      {/* Car Info */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("activityDetail.carInfo")}</h3>
        <div className="flex items-center gap-3 mt-2">
          <img
            src={activity.carThumbnailUrl}
            alt={activity.carName}
            className="w-20 aspect-[4/3] object-cover rounded-lg"
          />
          <div>
            <span className="font-semibold text-sm block">{activity.carName}</span>
            <span className="text-sm text-blue-600">{activity.carFormattedPrice}</span>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("activityDetail.status")}</h3>
        <span
          className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${
            activity.statusVariant === "success"
              ? "bg-green-100 text-green-700"
              : activity.statusVariant === "warning"
                ? "bg-amber-100 text-amber-700"
                : activity.statusVariant === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
          }`}
          aria-label={t("common.status", { status: activity.statusLabel })}
        >
          {activity.statusLabel}
        </span>
      </section>

      {/* Details */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("activityDetail.details")}</h3>
        <p className="mt-2 text-sm">{activity.typeSpecificDetails}</p>
      </section>

      {/* Timeline */}
      <section className="p-4">
        <h3 className="text-lg font-bold">{t("activityDetail.history")}</h3>
        <div className="mt-2">
          {activity.timeline.map((event, idx) => (
            <div key={idx} className="flex gap-3 py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 w-20 flex-shrink-0">{event.date}</span>
              <span className="text-sm flex-1">{event.description}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="p-4">
        <button
          data-testid="view-car"
          aria-label={t("activityDetail.viewCar")}
          onClick={() => setCurrentCar(activity.carId)}
          className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium"
        >
          {t("activityDetail.viewCar")}
        </button>
      </div>
    </div>
  );
}
