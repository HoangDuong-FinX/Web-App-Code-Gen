import type { Showroom, TimeSlot } from "../types";

export const showrooms: Showroom[] = [
  {
    id: "sr-001",
    name: "Vikki Auto Qu\u1eadn 1",
    address: "123 Nguy\u1ec5n Hu\u1ec7, Qu\u1eadn 1, TP.HCM",
    distance: "2.3 km",
    hours: "8:00 - 20:00",
  },
  {
    id: "sr-002",
    name: "Vikki Auto Qu\u1eadn 7",
    address: "456 Nguy\u1ec5n V\u0103n Linh, Qu\u1eadn 7, TP.HCM",
    distance: "5.1 km",
    hours: "8:00 - 20:00",
  },
  {
    id: "sr-003",
    name: "Vikki Auto Th\u1ee7 \u0110\u1ee9c",
    address: "789 V\u00f5 V\u0103n Ng\u00e2n, TP. Th\u1ee7 \u0110\u1ee9c, TP.HCM",
    distance: "8.7 km",
    hours: "8:30 - 19:30",
  },
];

export function getTimeSlotsForDate(_showroomId: string, _date: string): TimeSlot[] {
  return [
    { time: "08:00", isUnavailable: false, isSelected: false },
    { time: "09:00", isUnavailable: false, isSelected: false },
    { time: "10:00", isUnavailable: true, isSelected: false },
    { time: "11:00", isUnavailable: false, isSelected: false },
    { time: "13:00", isUnavailable: false, isSelected: false },
    { time: "14:00", isUnavailable: false, isSelected: false },
    { time: "15:00", isUnavailable: true, isSelected: false },
    { time: "16:00", isUnavailable: false, isSelected: false },
    { time: "17:00", isUnavailable: false, isSelected: false },
  ];
}
