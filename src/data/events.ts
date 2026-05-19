export type AppEvent = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  imageUrl?: string;
  registeredCount: number;
  attendanceCount?: number;
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isUpcomingEvent(event: AppEvent, now = new Date()) {
  return startOfDay(now) <= startOfDay(event.startTime);
}

export function isPastEvent(event: AppEvent, now = new Date()) {
  return !isUpcomingEvent(event, now);
}
