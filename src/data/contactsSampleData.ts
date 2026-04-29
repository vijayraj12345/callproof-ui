export type ContactType = "Prospect" | "Dealer" | "Customer" | "Lead";

export type ContactPhone = { kind: "O" | "C" | "H"; number: string; isInactive?: boolean };

export type Contact = {
  id: number;
  name: string;
  type: ContactType;
  avatarLabel: string; // initials fallback
  imageUrl?: string;
  rating: number; // 0-5
  reviews: number;
  tags: string[]; // small chips like "Downtown", "B2B"
  priceTier?: "$" | "$$" | "$$$" | "$$$$";
  address: string;
  distanceMiles: number;
  lat: number;
  lng: number;
  phones: ContactPhone[];
  email: string | null;
  lastContacted: string;
  nextTask?: string;
  salesReps: string[];
  contactsList: string[];
  bookedToday?: number; // playful OpenTable-ish hint
  heroColor: string; // tailwind gradient class for tile when no image
};

export const contactsSampleData: Contact[] = [
  {
    id: 1,
    name: "12-12-2024 Phone Prefix",
    type: "Prospect",
    avatarLabel: "PP",
    rating: 4.6,
    reviews: 124,
    tags: ["Downtown", "Retail"],
    priceTier: "$$",
    address: "625 Smith Avenue, New City AL 37203",
    distanceMiles: 2.1,
    lat: 40.72,
    lng: -74.0,
    phones: [
      { kind: "O", number: "234-523-4346" },
      { kind: "O", number: "998-877-6655" },
      { kind: "C", number: "234-523-4348" },
    ],
    email: null,
    lastContacted: "Feb 20, 2026 · 7:48 PM",
    nextTask: "Appointment — March 4",
    salesReps: ["AIT Tester", "CallProof Support", "divya rep", "Plusapp 100"],
    contactsList: ["Call detail", "Doctor", "gm test", "gowtham", "+18 more"],
    bookedToday: 213,
    heroColor: "from-violet-500 to-fuchsia-500",
  },
  {
    id: 2,
    name: "Akron Auto Group",
    type: "Dealer",
    avatarLabel: "AA",
    rating: 4.8,
    reviews: 408,
    tags: ["Akron", "B2B"],
    priceTier: "$$$",
    address: "2000 E Waterloo Rd, Akron OH 44312",
    distanceMiles: 18.4,
    lat: 41.04,
    lng: -81.45,
    phones: [
      { kind: "O", number: "330-283-2599", isInactive: true },
      { kind: "O", number: "787-676-5654" },
    ],
    email: "contact@akronauto.com",
    lastContacted: "April 7, 2025 · 12:45 PM",
    nextTask: "Follow up call",
    salesReps: ["AIT Tester", "divya rep"],
    contactsList: ["Mike R.", "Sara P."],
    bookedToday: 132,
    heroColor: "from-orange-500 to-rose-500",
  },
  {
    id: 3,
    name: "Northwind Logistics",
    type: "Prospect",
    avatarLabel: "NL",
    rating: 4.4,
    reviews: 76,
    tags: ["Warehouse", "Enterprise"],
    priceTier: "$$",
    address: "12 Depot Lane, Coimbatore 641004",
    distanceMiles: 6.2,
    lat: 11.06,
    lng: 76.94,
    phones: [
      { kind: "C", number: "415-999-9999", isInactive: true },
      { kind: "O", number: "123-234-5678" },
    ],
    email: "ops@northwind.io",
    lastContacted: "Dec 19, 2025 · 12:42 PM",
    salesReps: ["CallProof Support"],
    contactsList: ["Arun K.", "Priya S."],
    bookedToday: 69,
    heroColor: "from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    name: "Sunrise Cafe & Roastery",
    type: "Customer",
    avatarLabel: "SC",
    rating: 4.9,
    reviews: 982,
    tags: ["Hospitality", "Downtown"],
    priceTier: "$$",
    address: "44 Market St, Portland OR 97204",
    distanceMiles: 0.8,
    lat: 45.52,
    lng: -122.67,
    phones: [
      { kind: "O", number: "503-555-0142" },
      { kind: "C", number: "503-555-9921" },
    ],
    email: "hello@sunrisecafe.com",
    lastContacted: "April 22, 2026 · 9:10 AM",
    nextTask: "Send Q2 proposal",
    salesReps: ["divya rep", "Plusapp 100"],
    contactsList: ["Jenna M.", "Owner — Tom"],
    bookedToday: 305,
    heroColor: "from-amber-500 to-orange-500",
  },
  {
    id: 5,
    name: "Civic Health Clinic",
    type: "Lead",
    avatarLabel: "CH",
    rating: 4.2,
    reviews: 51,
    tags: ["Healthcare", "Multi-site"],
    priceTier: "$$$",
    address: "780 Civic Plaza, Austin TX 73301",
    distanceMiles: 12.6,
    lat: 30.27,
    lng: -97.74,
    phones: [{ kind: "O", number: "512-555-3344" }],
    email: "admin@civichealth.org",
    lastContacted: "Mar 11, 2026 · 4:02 PM",
    salesReps: ["AIT Tester"],
    contactsList: ["Dr. Patel", "Reception"],
    bookedToday: 47,
    heroColor: "from-sky-500 to-indigo-500",
  },
  {
    id: 6,
    name: "Harbor Marine Supplies",
    type: "Dealer",
    avatarLabel: "HM",
    rating: 4.5,
    reviews: 211,
    tags: ["Coastal", "Wholesale"],
    priceTier: "$$",
    address: "5 Pier Road, San Diego CA 92101",
    distanceMiles: 24.0,
    lat: 32.71,
    lng: -117.16,
    phones: [
      { kind: "O", number: "619-555-7788" },
      { kind: "C", number: "619-555-7799" },
    ],
    email: "sales@harbormarine.com",
    lastContacted: "Feb 02, 2026 · 11:11 AM",
    nextTask: "Quote review",
    salesReps: ["CallProof Support", "divya rep"],
    contactsList: ["Ben H.", "Anita L."],
    bookedToday: 88,
    heroColor: "from-cyan-500 to-blue-500",
  },
];
