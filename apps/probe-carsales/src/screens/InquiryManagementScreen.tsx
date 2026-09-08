import { useState } from "react";
import type { AdminInquiry } from "../types";
import { t } from "../i18n/index";

interface Props {
  inquiries: AdminInquiry[];
  onRespondInquiry: (id: string) => void;
  onBack: () => void;
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  responded: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function InquiryManagementScreen({ inquiries, onRespondInquiry, onBack }: Props) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? inquiries : inquiries.filter(i => i.status === statusFilter);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="text-sm text-blue-600 hover:underline" aria-label={t("inquiryMgmt.back.aria")}>
          \u2190 {t("inquiryMgmt.back")}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{t("inquiryMgmt.title")}</h1>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <label htmlFor="inq-filter" className="text-sm text-gray-600">{t("inquiryMgmt.filterStatus")}</label>
        <select id="inq-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm" aria-label={t("inquiryMgmt.filterStatus.aria")}>
          <option value="all">{t("inquiryMgmt.filterAll")}</option>
          <option value="pending">{t("inquiryMgmt.filterPending")}</option>
          <option value="responded">{t("inquiryMgmt.filterResponded")}</option>
          <option value="accepted">{t("inquiryMgmt.filterAccepted")}</option>
          <option value="rejected">{t("inquiryMgmt.filterRejected")}</option>
        </select>
        <span className="text-sm text-gray-500">{t("inquiryMgmt.count", { count: filtered.length })}</span>
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{t("inquiryMgmt.empty")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map(inq => (
            <li key={inq.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{inq.customerName}</h3>
                <p className="text-sm text-gray-600">{inq.carMakeModel}</p>
                <p className="text-xs text-gray-500">{inq.type} \u2022 {inq.submittedDate}</p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${statusColor[inq.status] ?? "bg-gray-100 text-gray-700"}`}>{inq.status}</span>
              </div>
              <button onClick={() => onRespondInquiry(inq.id)} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 ml-2" aria-label={t("inquiryMgmt.respond.aria")}>
                {t("inquiryMgmt.respond")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}