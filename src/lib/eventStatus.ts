/**
 * Trạng thái sự kiện tính lúc hiển thị từ lịch trong bài (eventStartAt/eventEndAt),
 * không lưu trong DB — dời lịch chỉ cần sửa ngày, nhãn tự đổi theo.
 */
export type EventStatus = "upcoming" | "ongoing" | "ended" | "postponed";

export interface EventSchedule {
  eventStartAt?: string | null;
  eventEndAt?: string | null;
  eventPostponed?: boolean;
}

/** null = bài không có lịch sự kiện → không hiện nhãn. */
export function eventStatus(
  e: EventSchedule,
  now: Date = new Date(),
): EventStatus | null {
  if (e.eventPostponed) return "postponed";
  if (!e.eventStartAt) return null;
  const start = new Date(e.eventStartAt);
  // Không nhập giờ kết thúc → coi như kết thúc cuối ngày bắt đầu.
  const end = e.eventEndAt
    ? new Date(e.eventEndAt)
    : new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59, 999);
  if (now < start) return "upcoming";
  if (now <= end) return "ongoing";
  return "ended";
}

export const EVENT_STATUS_LABEL: Record<EventStatus, { vn: string; en: string }> = {
  upcoming: { vn: "Sắp diễn ra", en: "Upcoming" },
  ongoing: { vn: "Đang diễn ra", en: "Happening now" },
  ended: { vn: "Đã kết thúc", en: "Ended" },
  postponed: { vn: "Tạm hoãn", en: "Postponed" },
};

/** Màu nhãn: xanh = sắp/đang diễn ra, xám = đã kết thúc, vàng = tạm hoãn. */
export const EVENT_STATUS_CLASS: Record<EventStatus, string> = {
  upcoming: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  ongoing: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
  ended: "bg-white/10 text-white/50 border-white/10",
  postponed: "bg-amber-500/15 text-amber-300 border-amber-500/20",
};
