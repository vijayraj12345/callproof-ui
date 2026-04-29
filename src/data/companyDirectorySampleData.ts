/** Sample reps for Company Directory — list + detail screens. */

export type UserAccessToggle = { id: string; label: string; enabled: boolean };

export type CompanyRep = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  password?: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat: number;
  lng: number;
  placesCategory: string;
  markets: string[];
  phones: string[];
  accounts: number;
  lastActivity: string;
  accountEnabled: boolean;
  isManager: boolean;
  userAccess: UserAccessToggle[];
  messageCallerId: string;
  accountRadius: string;
  appointmentButtonAssignment: string;
  defaultPhone: string;
  marketManager: boolean;
  limitToMarket: boolean;
  canViewOthersOpportunities: boolean;
  opportunityStages: string[];
};

function accessTemplate(
  overrides: Partial<Record<string, boolean>> = {},
): UserAccessToggle[] {
  const defs: [string, string][] = [
    ["all_unassigned", "All Unassigned"],
    ["can_delete_contacts", "Can Delete Contacts"],
    ["can_export", "Can Export"],
    ["hide_events", "Hide My Events"],
    ["view_team", "View Team Calendar"],
    ["edit_routes", "Edit Routes"],
    ["manage_markets", "Manage Markets"],
    ["admin_reports", "Admin Reports"],
  ];
  return defs.map(([id, label]) => ({
    id,
    label,
    enabled: overrides[id] ?? id !== "hide_events",
  }));
}

export const companyDirectorySampleData: CompanyRep[] = [
  {
    id: "1",
    firstName: "AITECH",
    lastName: "AIT",
    email: "aitech@example.com",
    title: "Manager",
    address: "123 Commerce Way",
    address2: "Suite 200",
    city: "Nashville",
    state: "TN",
    zip: "37203",
    country: "United States",
    lat: 36.1627,
    lng: -86.7816,
    placesCategory: "Office",
    markets: ["Nashville", "Toronto", "Shelterland"],
    phones: ["+1 615-555-0101", "+1 615-555-0102"],
    accounts: 42,
    lastActivity: "Apr 28, 2026 4:12 PM",
    accountEnabled: true,
    isManager: true,
    userAccess: accessTemplate({ hide_events: false }),
    messageCallerId: "CP Main",
    accountRadius: "50 mi",
    appointmentButtonAssignment: "Round-robin",
    defaultPhone: "+1 615-555-0101",
    marketManager: true,
    limitToMarket: false,
    canViewOthersOpportunities: true,
    opportunityStages: ["Quote - 70%"],
  },
  {
    id: "2",
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan.lee@example.com",
    title: "Sales Rep",
    address: "88 Market Street",
    address2: "",
    city: "Toronto",
    state: "ON",
    zip: "M5H 2N2",
    country: "Canada",
    lat: 43.6532,
    lng: -79.3832,
    placesCategory: "Field",
    markets: ["Toronto"],
    phones: ["+1 416-555-0144"],
    accounts: 18,
    lastActivity: "Apr 27, 2026 9:00 AM",
    accountEnabled: true,
    isManager: false,
    userAccess: accessTemplate({ admin_reports: false, manage_markets: false }),
    messageCallerId: "Toronto Line",
    accountRadius: "25 mi",
    appointmentButtonAssignment: "Self",
    defaultPhone: "+1 416-555-0144",
    marketManager: false,
    limitToMarket: true,
    canViewOthersOpportunities: false,
    opportunityStages: [],
  },
  {
    id: "3",
    firstName: "Sam",
    lastName: "Rivera",
    email: "sam.r@example.com",
    title: "Manager",
    address: "400 River Rd",
    address2: "",
    city: "Austin",
    state: "TX",
    zip: "78701",
    country: "United States",
    lat: 30.2672,
    lng: -97.7431,
    placesCategory: "Office",
    markets: ["Austin", "Dallas"],
    phones: ["+1 512-555-0199"],
    accounts: 31,
    lastActivity: "Apr 26, 2026 2:45 PM",
    accountEnabled: true,
    isManager: true,
    userAccess: accessTemplate(),
    messageCallerId: "CP Austin",
    accountRadius: "75 mi",
    appointmentButtonAssignment: "Round-robin",
    defaultPhone: "+1 512-555-0199",
    marketManager: true,
    limitToMarket: false,
    canViewOthersOpportunities: true,
    opportunityStages: ["Discovery", "Quote - 70%"],
  },
  {
    id: "4",
    firstName: "Casey",
    lastName: "Nguyen",
    email: "casey.n@example.com",
    title: "Sales Rep",
    address: "10 Harbor View",
    address2: "Unit B",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    country: "United States",
    lat: 47.6062,
    lng: -122.3321,
    placesCategory: "Field",
    markets: ["Seattle"],
    phones: ["+1 206-555-0177"],
    accounts: 12,
    lastActivity: "Apr 25, 2026 11:20 AM",
    accountEnabled: false,
    isManager: false,
    userAccess: accessTemplate({ can_export: false, admin_reports: false }),
    messageCallerId: "Seattle Pool",
    accountRadius: "30 mi",
    appointmentButtonAssignment: "Self",
    defaultPhone: "+1 206-555-0177",
    marketManager: false,
    limitToMarket: true,
    canViewOthersOpportunities: false,
    opportunityStages: [],
  },
  {
    id: "5",
    firstName: "Riley",
    lastName: "Brooks",
    email: "riley.b@example.com",
    title: "Sales Rep",
    address: "2 Division St",
    address2: "",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    country: "United States",
    lat: 41.8781,
    lng: -87.6298,
    placesCategory: "Office",
    markets: ["Chicago", "Milwaukee"],
    phones: ["+1 312-555-0160"],
    accounts: 24,
    lastActivity: "Apr 24, 2026 8:05 AM",
    accountEnabled: true,
    isManager: false,
    userAccess: accessTemplate({ hide_events: true }),
    messageCallerId: "Midwest",
    accountRadius: "40 mi",
    appointmentButtonAssignment: "Round-robin",
    defaultPhone: "+1 312-555-0160",
    marketManager: false,
    limitToMarket: false,
    canViewOthersOpportunities: true,
    opportunityStages: ["Negotiation"],
  },
  {
    id: "6",
    firstName: "Morgan",
    lastName: "Patel",
    email: "morgan.p@example.com",
    title: "Manager",
    address: "500 Peachtree NE",
    address2: "Floor 12",
    city: "Atlanta",
    state: "GA",
    zip: "30308",
    country: "United States",
    lat: 33.749,
    lng: -84.388,
    placesCategory: "Office",
    markets: ["Atlanta"],
    phones: ["+1 404-555-0133", "+1 404-555-0134"],
    accounts: 55,
    lastActivity: "Apr 23, 2026 5:30 PM",
    accountEnabled: true,
    isManager: true,
    userAccess: accessTemplate(),
    messageCallerId: "ATL Primary",
    accountRadius: "60 mi",
    appointmentButtonAssignment: "Self",
    defaultPhone: "+1 404-555-0133",
    marketManager: true,
    limitToMarket: false,
    canViewOthersOpportunities: true,
    opportunityStages: ["Quote - 70%", "Closed Won"],
  },
  {
    id: "7",
    firstName: "Taylor",
    lastName: "Kim",
    email: "taylor.k@example.com",
    title: "Sales Rep",
    address: "77 Sunset Blvd",
    address2: "",
    city: "Los Angeles",
    state: "CA",
    zip: "90028",
    country: "United States",
    lat: 34.0522,
    lng: -118.2437,
    placesCategory: "Field",
    markets: ["Los Angeles"],
    phones: ["+1 323-555-0188"],
    accounts: 9,
    lastActivity: "Apr 22, 2026 10:15 AM",
    accountEnabled: true,
    isManager: false,
    userAccess: accessTemplate({ edit_routes: false }),
    messageCallerId: "LA Desk",
    accountRadius: "35 mi",
    appointmentButtonAssignment: "Round-robin",
    defaultPhone: "+1 323-555-0188",
    marketManager: false,
    limitToMarket: false,
    canViewOthersOpportunities: false,
    opportunityStages: [],
  },
  {
    id: "8",
    firstName: "Jamie",
    lastName: "Foster",
    email: "jamie.f@example.com",
    title: "Sales Rep",
    address: "1 Canal St",
    address2: "",
    city: "Boston",
    state: "MA",
    zip: "02114",
    country: "United States",
    lat: 42.3601,
    lng: -71.0589,
    placesCategory: "Office",
    markets: ["Boston", "Providence"],
    phones: ["+1 617-555-0120"],
    accounts: 15,
    lastActivity: "Apr 21, 2026 3:40 PM",
    accountEnabled: true,
    isManager: false,
    userAccess: accessTemplate(),
    messageCallerId: "NE Region",
    accountRadius: "45 mi",
    appointmentButtonAssignment: "Self",
    defaultPhone: "+1 617-555-0120",
    marketManager: false,
    limitToMarket: true,
    canViewOthersOpportunities: true,
    opportunityStages: ["Qualification"],
  },
];

export function getRepById(id: string): CompanyRep | undefined {
  return companyDirectorySampleData.find((r) => r.id === id);
}

export function repDisplayName(r: CompanyRep): string {
  return `${r.firstName} ${r.lastName}`.trim() || r.email;
}
