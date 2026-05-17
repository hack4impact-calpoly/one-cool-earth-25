export type EventSection = "upcoming" | "past";
// missing waiver, missed, attended, none

export type AppEvent = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  imageUrl?: string;
  section: EventSection;
  registeredCount: number;
  attendanceCount?: number;
};
