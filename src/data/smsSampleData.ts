export type SmsMessage = {
  id: string;
  direction: "in" | "out";
  body: string;
  sentAt: string;
  /** Shown as a centered date row above this message */
  dateDivider?: string;
  delivered?: boolean;
  /** Outgoing bubble with a small “attachment” strip */
  hasAttachmentStrip?: boolean;
  attachmentLabel?: string;
  reactions?: string[];
};

export type SmsConversation = {
  id: string;
  name: string;
  phone: string;
  lastPreview: string;
  lastAt: string;
  unread: number;
  starred: boolean;
  twilioNumber: string;
  online: boolean;
  aiSummary: string;
  messages: SmsMessage[];
};

const shivaThread: SmsMessage[] = [
  {
    id: "m1",
    direction: "out",
    body: "Hi Shiva — can you confirm you received the last alert we sent?",
    sentAt: "10:12 AM",
    dateDivider: "April 27, 2026",
    delivered: true,
  },
  {
    id: "m2",
    direction: "out",
    body: "Here is the error screen we are seeing on our side.",
    sentAt: "10:14 AM",
    delivered: true,
    hasAttachmentStrip: true,
    attachmentLabel: "Error screenshot",
  },
  {
    id: "m3",
    direction: "in",
    body: "Thanks — I restarted my phone but messages still do not come through on Android.",
    sentAt: "10:18 AM",
    reactions: ["👍"],
  },
];

const baseNames = [
  "Shiva",
  "Test Demo 014",
  "Acme Roofing",
  "Jordan Lee",
  "Maria Santos",
  "Northwind HVAC",
  "Chris Patel",
  "Demo Lead 22",
  "River City Plumbing",
  "Alex Morgan",
];

function randomPhone(seed: number): string {
  const a = 200 + (seed % 800);
  const b = 100 + ((seed * 7) % 900);
  const c = 1000 + ((seed * 13) % 9000);
  return `+1 (555) ${a}-${String(b).padStart(3, "0")}-${c}`;
}

function buildMessagesForSeed(seed: number): SmsMessage[] {
  if (seed === 0) return shivaThread;
  const day = 20 + (seed % 8);
  return [
    {
      id: `x-${seed}-1`,
      direction: "out",
      body: "Following up on our last visit — let me know a good time to reconnect.",
      sentAt: "9:00 AM",
      dateDivider: `April ${day}, 2026`,
      delivered: true,
    },
    {
      id: `x-${seed}-2`,
      direction: "in",
      body: seed % 3 === 0 ? "Sounds good, Tuesday works." : "Will call you back shortly.",
      sentAt: "9:42 AM",
    },
  ];
}

export function buildSmsConversations(): SmsConversation[] {
  const total = 132;
  const list: SmsConversation[] = [];
  for (let i = 0; i < total; i++) {
    const name = i < baseNames.length ? baseNames[i] : `${baseNames[i % baseNames.length]} ${i + 1}`;
    const unread = i === 0 ? 2 : i < 12 && i % 2 === 0 ? 1 : 0;
    list.push({
      id: `conv-${i + 1}`,
      name,
      phone: randomPhone(i + 1),
      lastPreview: i === 0 ? "Thanks — I restarted my phone but…" : i % 4 === 0 ? "Appointment confirmed for next week." : "OK, send the quote over.",
      lastAt: i === 0 ? "10:18 AM" : i % 5 === 0 ? "Yesterday" : "Apr 26",
      unread,
      starred: i === 2 || i === 7,
      twilioNumber: "+1 (844) 555-0199",
      online: i === 0,
      aiSummary:
        i === 0
          ? "This user is facing an issue receiving messages on their Android device. They have tried restarting but it did not help."
          : i % 3 === 0
            ? "Strong engagement — responded quickly and asked for pricing details."
            : "Routine check-in thread; no urgent risks flagged.",
      messages: buildMessagesForSeed(i),
    });
  }
  return list;
}

export const smsUnreadTotal = (convs: SmsConversation[]) => convs.reduce((n, c) => n + (c.unread > 0 ? 1 : 0), 0);
