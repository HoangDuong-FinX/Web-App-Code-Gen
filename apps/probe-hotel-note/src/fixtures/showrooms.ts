import type { Showroom, TimeSlot } from "../types";

export const showrooms: Showroom[] = [
  {
    id: "sr-001",
    name: "Vikki Auto Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    distance: "2.3 km",
    hours: "8:00 - 20:00",
  },
  {
    id: "sr-002",
    name: "Vikki Auto Quận 7",
    address: "456 Nguyễn Văn Linh, Quận 7, TP.HCM",
    distance: "5.1 km",
    hours: "8:00 - 20:00",
  },
  {
    id: "sr-003",
    name: "Vikki Auto Thủ Đức",
    address: "789 Võ Văn Ngân, TP. Thủ Đức, TP.HCM",
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
