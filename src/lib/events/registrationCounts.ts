import { Types } from "mongoose";
import Registration from "@/database/models/Registration";

type EventCounts = {
  registeredCount: number;
  attendanceCount: number;
};

export async function getRegistrationCountsByEventId(eventIds: string[]) {
  const validObjectIds = eventIds.filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id));

  if (validObjectIds.length === 0) {
    return new Map<string, EventCounts>();
  }

  const counts = await Registration.aggregate<{
    _id: Types.ObjectId;
    registeredCount: number;
    attendanceCount: number;
  }>([
    {
      $match: {
        eventId: { $in: validObjectIds },
      },
    },
    {
      $unwind: "$partyMembers",
    },
    {
      $match: {
        "partyMembers.attending": { $ne: false },
      },
    },
    {
      $group: {
        _id: "$eventId",
        registeredCount: { $sum: 1 },
        attendanceCount: {
          $sum: {
            $cond: ["$partyMembers.attended", 1, 0],
          },
        },
      },
    },
  ]);

  return new Map(
    counts.map((count) => [
      count._id.toString(),
      {
        registeredCount: count.registeredCount,
        attendanceCount: count.attendanceCount,
      },
    ]),
  );
}
