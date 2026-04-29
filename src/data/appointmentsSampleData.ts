export type AppointmentType = "In person" | "Remote" | "Phone";

export type AppointmentRow = {
  id: number;
  repName: string;
  repInitials: string;
  dateTime: string;
  durationSec: number;
  contactName: string;
  startVerified: boolean;
  endVerified: boolean;
  endHasWarning: boolean;
  startLat: string;
  startLng: string;
  endLat: string;
  endLng: string;
  eventForm: string | null;
  followUpNeeded: boolean;
  type: AppointmentType;
  hasNotes: boolean;
  accountName: string;
  accountAddress: string;
  /** Short AI tip for this visit (demo). */
  aiTip: string | null;
};

export function formatAppointmentDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const appointmentsSampleData: AppointmentRow[] = [
  {
    id: 1,
    repName: "AITECH AIT",
    repInitials: "AA",
    dateTime: "April 28, 2026, 12:37 p.m.",
    durationSec: 864,
    contactName: "WILLIAM SMITH",
    startVerified: true,
    endVerified: true,
    endHasWarning: false,
    startLat: "11.0168",
    startLng: "76.9558",
    endLat: "11.0182",
    endLng: "76.9571",
    eventForm: null,
    followUpNeeded: false,
    type: "In person",
    hasNotes: true,
    accountName: "Shivalaya Costumes",
    accountAddress: "Coimbatore TN 641050",
    aiTip: "On-site duration aligns with account tier — good candidate for upsell accessories.",
  },
  {
    id: 2,
    repName: "Jordan Lee",
    repInitials: "JL",
    dateTime: "April 28, 2026, 9:15 a.m.",
    durationSec: 2100,
    contactName: "Maria Chen",
    startVerified: true,
    endVerified: true,
    endHasWarning: true,
    startLat: "43.6532",
    startLng: "-79.3832",
    endLat: "43.6510",
    endLng: "-79.3810",
    eventForm: "Standard visit",
    followUpNeeded: true,
    type: "In person",
    hasNotes: false,
    accountName: "Metro HVAC",
    accountAddress: "Toronto ON M5H 2N2",
    aiTip: "End GPS drift > 200 m — confirm check-out next time.",
  },
  {
    id: 3,
    repName: "Sam Rivera",
    repInitials: "SR",
    dateTime: "April 27, 2026, 4:22 p.m.",
    durationSec: 540,
    contactName: "James Keller",
    startVerified: true,
    endVerified: false,
    endHasWarning: false,
    startLat: "30.2672",
    startLng: "-97.7431",
    endLat: "—",
    endLng: "—",
    eventForm: null,
    followUpNeeded: true,
    type: "Remote",
    hasNotes: true,
    accountName: "Keller Industries",
    accountAddress: "Austin TX 78701",
    aiTip: "Remote session under 15 min — schedule follow-up call within 48h.",
  },
  {
    id: 4,
    repName: "Casey Nguyen",
    repInitials: "CN",
    dateTime: "April 27, 2026, 11:05 a.m.",
    durationSec: 3720,
    contactName: "Priya N.",
    startVerified: true,
    endVerified: true,
    endHasWarning: false,
    startLat: "47.6062",
    startLng: "-122.3321",
    endLat: "47.6070",
    endLng: "-122.3335",
    eventForm: "Quarterly review",
    followUpNeeded: false,
    type: "In person",
    hasNotes: true,
    accountName: "GreenLeaf Foods",
    accountAddress: "Seattle WA 98101",
    aiTip: null,
  },
  {
    id: 5,
    repName: "Riley Brooks",
    repInitials: "RB",
    dateTime: "April 26, 2026, 2:40 p.m.",
    durationSec: 900,
    contactName: "Alex P.",
    startVerified: true,
    endVerified: true,
    endHasWarning: false,
    startLat: "41.8781",
    startLng: "-87.6298",
    endLat: "41.8795",
    endLng: "-87.6312",
    eventForm: null,
    followUpNeeded: false,
    type: "Phone",
    hasNotes: false,
    accountName: "Lopez Auto",
    accountAddress: "Chicago IL 60601",
    aiTip: "Phone visit — log outcome in CRM for pipeline accuracy.",
  },
  {
    id: 6,
    repName: "Morgan Patel",
    repInitials: "MP",
    dateTime: "April 26, 2026, 8:50 a.m.",
    durationSec: 1440,
    contactName: "Taylor Kim",
    startVerified: true,
    endVerified: true,
    endHasWarning: false,
    startLat: "33.7490",
    startLng: "-84.3880",
    endLat: "33.7502",
    endLng: "-84.3891",
    eventForm: "Renewal",
    followUpNeeded: true,
    type: "In person",
    hasNotes: true,
    accountName: "Downtown HQ",
    accountAddress: "Atlanta GA 30308",
    aiTip: "Renewal form started — nudge rep to complete before Friday.",
  },
];
