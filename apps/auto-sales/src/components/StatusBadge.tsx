import React from "react";
import { t } from "../i18n";

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  out_of_stock: "bg-red-100 text-red-800",
  discontinued: "bg-gray-100 text-gray-600",
  processing: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  delivering: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export function StatusBadge({ status }: { status: string }) {
  const color = statusColors[status] ?? "bg-gray-100 text-gray-600";
  const key = `status.${status}`;
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${color}`}>
      {t(key)}
    </span>
  );
}
