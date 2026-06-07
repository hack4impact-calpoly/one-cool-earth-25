import NotificationSettings, { REGISTRATION_NOTIFICATION_SETTINGS_KEY } from "@/database/models/NotificationSettings";

type PartyMember = {
  name?: string;
  email?: string;
  registrant?: boolean;
};

type PopulatedRegistration = {
  _id: { toString(): string };
  eventId?: {
    _id?: { toString(): string };
    name?: string;
    title?: string;
    location?: string;
    startTime?: Date | string;
    endTime?: Date | string;
  };
  partyMembers?: PartyMember[];
  affiliatedOrganization?: string;
  additionalComments?: string;
};

type NotificationSettingsLean = { emails?: string[] } | null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDateTime(value?: Date | string) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildRegistrationNotification(registration: PopulatedRegistration) {
  const event = registration.eventId;
  const eventName = event?.name || event?.title || "Event";
  const registrant = registration.partyMembers?.find((member) => member.registrant) ?? registration.partyMembers?.[0];
  const partyMembers = registration.partyMembers ?? [];

  const subject = `New registration for ${eventName}`;
  const rows = [
    ["Event", eventName],
    ["Location", event?.location || "Not provided"],
    ["Starts", formatDateTime(event?.startTime)],
    ["Ends", formatDateTime(event?.endTime)],
    ["Registrant", registrant ? `${registrant.name || "Unnamed"} <${registrant.email || "no email"}>` : "Not provided"],
    ["Party size", String(partyMembers.length)],
    ["Organization", registration.affiliatedOrganization || "Not provided"],
    ["Comments", registration.additionalComments || "None"],
  ];

  const text = [
    subject,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Party members:",
    ...partyMembers.map((member) => `- ${member.name || "Unnamed"} <${member.email || "no email"}>`),
  ].join("\n");

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:700;vertical-align:top;">${escapeHtml(
          label,
        )}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const htmlPartyMembers = partyMembers
    .map(
      (member) => `<li>${escapeHtml(member.name || "Unnamed")} &lt;${escapeHtml(member.email || "no email")}&gt;</li>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f2933;">
      <h1 style="font-size:20px;">${escapeHtml(subject)}</h1>
      <table style="border-collapse:collapse;">${htmlRows}</table>
      <h2 style="font-size:16px;margin-top:20px;">Party members</h2>
      <ul>${htmlPartyMembers}</ul>
    </div>
  `;

  return { subject, text, html };
}

export async function sendRegistrationNotificationEmail(registration: PopulatedRegistration) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.REGISTRATION_NOTIFICATION_FROM;

  if (!apiKey || !from) {
    console.info("Registration notification email skipped: missing RESEND_API_KEY or REGISTRATION_NOTIFICATION_FROM.");
    return;
  }

  const settings = (await NotificationSettings.findOne({
    key: REGISTRATION_NOTIFICATION_SETTINGS_KEY,
  }).lean()) as NotificationSettingsLean;
  const recipients = settings?.emails ?? [];

  if (recipients.length === 0) {
    return;
  }

  const message = buildRegistrationNotification(registration);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend email request failed with ${response.status}: ${body}`);
  }
}
