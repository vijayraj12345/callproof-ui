export type CallDirection = "Incoming" | "Outgoing" | "Missed";
export type CallSource = "Web" | "Mobile" | "Twilio" | "Desk";

export type CallRecord = {
  id: number;
  caller: string;
  callerPhone: string;
  store: string;
  campaign: string;
  campaignNumber: string;
  notes: string;
  callerName: string;
  carrierName: string;
  direction: CallDirection;
  contactName: string | null;
  contactNumber: string | null;
  dateTime: string;
  durationSec: number;
  rating: number; // 0-5
  relatedRecord: string | null;
  source: CallSource;
  audioUrl: string | null;
};

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const callsSampleData: CallRecord[] = [
  {
    id: 1,
    caller: "AITECH",
    callerPhone: "515-414-7501",
    store: "",
    campaign: "Shiva",
    campaignNumber: "432-888-7611",
    notes: "Discussed Q2 pricing renewal and follow-up demo.",
    callerName: "N/A",
    carrierName: "Twilio - SMS/MMS-SVR",
    direction: "Incoming",
    contactName: "SelvaGanapathi Twilio",
    contactNumber: "+1 432-888-7611",
    dateTime: "April 27, 2026, 1:11 p.m.",
    durationSec: 23,
    rating: 4,
    relatedRecord: "AITECH · Account",
    source: "Web",
    audioUrl: "/audio/sample-call.mp3",
  },
  {
    id: 2,
    caller: "AITECH",
    callerPhone: "515-414-7501",
    store: "",
    campaign: "Shiva",
    campaignNumber: "432-888-7611",
    notes: "",
    callerName: "N/A",
    carrierName: "Twilio - SMS/MMS-SVR",
    direction: "Incoming",
    contactName: null,
    contactNumber: null,
    dateTime: "April 24, 2026, 1:05 p.m.",
    durationSec: 0,
    rating: 0,
    relatedRecord: null,
    source: "Web",
    audioUrl: null,
  },
  {
    id: 3,
    caller: "AITECH",
    callerPhone: "515-414-7501",
    store: "Downtown HQ",
    campaign: "Shiva",
    campaignNumber: "432-888-7611",
    notes: "Left voicemail re: invoice clarification.",
    callerName: "Selva G.",
    carrierName: "Twilio - SMS/MMS-SVR",
    direction: "Incoming",
    contactName: "SelvaGanapathi Twilio",
    contactNumber: "+1 432-888-7611",
    dateTime: "April 22, 2026, 5:43 p.m.",
    durationSec: 4,
    rating: 0,
    relatedRecord: "AITECH · Account",
    source: "Web",
    audioUrl: "/audio/sample-call.mp3",
  },
  {
    id: 4,
    caller: "Demo Rep",
    callerPhone: "210-555-0144",
    store: "Westside Branch",
    campaign: "Spring Promo",
    campaignNumber: "210-555-0100",
    notes: "Customer interested in upgrade. Send proposal Friday.",
    callerName: "Maria Lopez",
    carrierName: "Verizon",
    direction: "Outgoing",
    contactName: "Maria Lopez",
    contactNumber: "+1 210-555-0144",
    dateTime: "April 21, 2026, 10:18 a.m.",
    durationSec: 312,
    rating: 5,
    relatedRecord: "Lopez Auto · Lead",
    source: "Mobile",
    audioUrl: "/audio/sample-call.mp3",
  },
  {
    id: 5,
    caller: "Plusapp prod",
    callerPhone: "646-555-0199",
    store: "",
    campaign: "Inbound Support",
    campaignNumber: "646-555-0100",
    notes: "Reported login issue — escalated to engineering.",
    callerName: "James K.",
    carrierName: "AT&T",
    direction: "Missed",
    contactName: "James Keller",
    contactNumber: "+1 646-555-0199",
    dateTime: "April 20, 2026, 9:02 a.m.",
    durationSec: 0,
    rating: 0,
    relatedRecord: "Keller Industries",
    source: "Twilio",
    audioUrl: null,
  },
  {
    id: 6,
    caller: "Kalaiselvan Django",
    callerPhone: "415-555-0181",
    store: "Bay Area",
    campaign: "Onboarding",
    campaignNumber: "415-555-0100",
    notes: "Walked through dashboard setup.",
    callerName: "Kalai S.",
    carrierName: "T-Mobile",
    direction: "Outgoing",
    contactName: "New Customer",
    contactNumber: "+1 415-555-0181",
    dateTime: "April 19, 2026, 3:47 p.m.",
    durationSec: 845,
    rating: 4,
    relatedRecord: "Acme Co · Account",
    source: "Desk",
    audioUrl: "/audio/sample-call.mp3",
  },
  {
    id: 7,
    caller: "Rep AITECH",
    callerPhone: "212-555-0177",
    store: "",
    campaign: "Renewal Outreach",
    campaignNumber: "212-555-0100",
    notes: "",
    callerName: "Rep A.",
    carrierName: "Twilio - SMS/MMS-SVR",
    direction: "Outgoing",
    contactName: "GreenLeaf Foods",
    contactNumber: "+1 212-555-0177",
    dateTime: "April 18, 2026, 11:22 a.m.",
    durationSec: 178,
    rating: 3,
    relatedRecord: "GreenLeaf Foods",
    source: "Web",
    audioUrl: "/audio/sample-call.mp3",
  },
  {
    id: 8,
    caller: "AITECH",
    callerPhone: "515-414-7501",
    store: "",
    campaign: "Shiva",
    campaignNumber: "432-888-7611",
    notes: "Quick check-in.",
    callerName: "N/A",
    carrierName: "Twilio - SMS/MMS-SVR",
    direction: "Incoming",
    contactName: "SelvaGanapathi Twilio",
    contactNumber: "+1 432-888-7611",
    dateTime: "April 16, 2026, 4:55 p.m.",
    durationSec: 56,
    rating: 2,
    relatedRecord: "AITECH · Account",
    source: "Web",
    audioUrl: "/audio/sample-call.mp3",
  },
];
