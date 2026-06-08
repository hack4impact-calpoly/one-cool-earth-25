import connectDB from "@/database/db";
import Event from "@/database/models/Event";
import Registration from "@/database/models/Registration";
import { requireAdmin } from "@/lib/auth/admin";
import { NextResponse } from "next/server";

type ReportRow = {
  name: string;
  events: number;
  volunteers: number;
  hours: number;
};

type ReportGroup = {
  eventIds: Set<string>;
  volunteers: number;
  hours: number;
};

type PartyMember = {
  email?: string;
  attended?: boolean;
  attending?: boolean;
};

type RegistrationWithEvent = {
  eventId?: {
    _id: unknown;
    location?: string;
    startTime?: Date;
    endTime?: Date;
  } | null;
  affiliatedOrganization?: string;
  partyMembers?: PartyMember[];
};

const MS_PER_HOUR = 1000 * 60 * 60;

export async function GET(request: Request) {
  const admin = await requireAdmin();

  if ("error" in admin) {
    return admin.error;
  }

  try {
    const { searchParams } = new URL(request.url);
    const startDate = parseReportDate(searchParams.get("startDate"), "start");
    const endDate = parseReportDate(searchParams.get("endDate"), "end");

    if (!startDate || !endDate || startDate > endDate) {
      return NextResponse.json({ error: "Invalid report date range" }, { status: 400 });
    }

    await connectDB();

    const eventIds = await Event.find({
      startTime: {
        $gte: startDate,
        $lte: endDate,
      },
    }).distinct("_id");

    const eventCount = eventIds.length;

    const registrations = await Registration.find({ eventId: { $in: eventIds } })
      .populate("eventId")
      .lean<RegistrationWithEvent[]>();

    const schools = new Map<string, ReportGroup>();
    const organizations = new Map<string, ReportGroup>();
    const volunteerEventCounts = new Map<string, number>();
    let totalVolunteerCheckins = 0;
    let totalHours = 0;

    registrations.forEach((registration) => {
      const event = registration.eventId;

      if (!event) return;

      const eventId = String(event._id);
      const durationHours = getDurationHours(event.startTime, event.endTime);
      const schoolName = normalizeGroupName(event.location, "Unknown School");
      const organizationName = normalizeOrganizationName(registration.affiliatedOrganization);

      registration.partyMembers
        ?.filter((member) => member.attending !== false && member.attended === true)
        .forEach((member) => {
          totalVolunteerCheckins += 1;
          totalHours += durationHours;

          addToGroup(schools, schoolName, eventId, durationHours);
          addToGroup(organizations, organizationName, eventId, durationHours);

          const volunteerKey = normalizeVolunteerKey(member.email);

          if (volunteerKey) {
            volunteerEventCounts.set(volunteerKey, (volunteerEventCounts.get(volunteerKey) ?? 0) + 1);
          }
        });
    });

    return NextResponse.json(
      {
        summary: {
          volunteers: volunteerEventCounts.size || totalVolunteerCheckins,
          returning: Array.from(volunteerEventCounts.values()).filter((count) => count > 1).length,
          events: eventCount,
          hours: roundHours(totalHours),
        },
        schools: mapGroupsToRows(schools),
        organizations: mapGroupsToRows(organizations),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Report API Error:", error);
    return NextResponse.json({ error: "Failed to load report" }, { status: 500 });
  }
}

function parseReportDate(value: string | null, boundary: "start" | "end") {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const date = new Date(`${value}T${boundary === "start" ? "00:00:00.000" : "23:59:59.999"}`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getDurationHours(startTime?: Date, endTime?: Date) {
  const start = startTime ? new Date(startTime).getTime() : NaN;
  const end = endTime ? new Date(endTime).getTime() : NaN;

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return 0;
  }

  return (end - start) / MS_PER_HOUR;
}

function addToGroup(groups: Map<string, ReportGroup>, name: string, eventId: string, hours: number) {
  const group = groups.get(name) ?? {
    eventIds: new Set<string>(),
    volunteers: 0,
    hours: 0,
  };

  group.eventIds.add(eventId);
  group.volunteers += 1;
  group.hours += hours;
  groups.set(name, group);
}

function mapGroupsToRows(groups: Map<string, ReportGroup>): ReportRow[] {
  return Array.from(groups.entries())
    .map(([name, group]) => ({
      name,
      events: group.eventIds.size,
      volunteers: group.volunteers,
      hours: roundHours(group.hours),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function normalizeGroupName(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

function normalizeOrganizationName(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed.toLowerCase() === "n/a") {
    return "No Organization";
  }

  return trimmed;
}

function normalizeVolunteerKey(email: string | undefined) {
  return email?.trim().toLowerCase() || null;
}

function roundHours(hours: number) {
  return Math.round(hours * 10) / 10;
}
