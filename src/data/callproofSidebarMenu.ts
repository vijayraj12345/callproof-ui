/** Legacy CallProof sidebar / submenu payload (sorted by `position` when rendering). */

export type CallproofMenuItem = {
  name: string;
  url: string;
  menu_row_id: number;
  position: number;
};

export type CallproofMenuBucket = Record<string, CallproofMenuItem[]>;

export const callproofSidebarMenu = {
  home: {
    "1": [
      { name: "Event Forms", url: "/eforms/", menu_row_id: 1, position: 0 },
      { name: "Custom Fields", url: "/cfields/", menu_row_id: 1, position: 1 },
      { name: "Account Types", url: "/contact_types/", menu_row_id: 1, position: 2 },
      { name: "Titles & Assignments", url: "/titles/", menu_row_id: 1, position: 3 },
      { name: "Build Custom Menus", url: "/custom_contact_menu/", menu_row_id: 1, position: 4 },
      { name: "Markets & Territories", url: "/markets/", menu_row_id: 1, position: 5 },
      { name: "Edit Contact Role Option", url: "/role/", menu_row_id: 1, position: 6 },
      { name: "Region", url: "/region/", menu_row_id: 1, position: 7 },
    ],
    "2": [
      { name: "Activate New CallerID", url: "/caller/callerid/new/", menu_row_id: 2, position: 0 },
      { name: "My Phone Numbers", url: "/phone_numbers/", menu_row_id: 2, position: 1 },
      { name: "Edit Call Result Options", url: "/call_results/", menu_row_id: 2, position: 2 },
      { name: "Call Overrides", url: "/calls/overrides/", menu_row_id: 2, position: 3 },
      { name: "Set-Up Auto Text", url: "/autotext/", menu_row_id: 2, position: 4 },
    ],
    "3": [
      { name: "Tools Site", url: "/tools/companies/", menu_row_id: 3, position: 1 },
      { name: "Whats New", url: "/home/whats_new/", menu_row_id: 3, position: 3 },
    ],
    "4": [],
    "13": [],
  },
  sales: {
    "5": [
      { name: "Opportunities", url: "/funnel/new/", menu_row_id: 5, position: 1 },
      { name: "Opportunities Report", url: "/funnel/opps/", menu_row_id: 5, position: 2 },
      { name: "Goals", url: "/funnel/goals/", menu_row_id: 5, position: 6 },
      { name: "Badges", url: "/badges/", menu_row_id: 5, position: 7 },
      { name: "Set Activity Points", url: "/event_points/", menu_row_id: 5, position: 8 },
    ],
  },
  dashboard: {
    "6": [
      { name: "What Happened Yesterday", url: "/stats/activities/", menu_row_id: 6, position: 0 },
      { name: "Daily Point Tracker", url: "/stats/points/daily/", menu_row_id: 6, position: 1 },
      { name: "Events", url: "/dash/events/", menu_row_id: 6, position: 2 },
      { name: "Activity", url: "/stats/productivity/daily/", menu_row_id: 6, position: 3 },
      { name: "Appointments & Visits", url: "/appointments/", menu_row_id: 6, position: 4 },
      { name: "Task & Follow-Ups", url: "/followups/", menu_row_id: 6, position: 5 },
      { name: "My Exports", url: "/users/list/export/", menu_row_id: 6, position: 6 },
      { name: "Notes", url: "/contacts/notes/report/", menu_row_id: 6, position: 7 },
      { name: "Images", url: "/contacts/images/", menu_row_id: 6, position: 8 },
      { name: "Custom Reports", url: "/reports/", menu_row_id: 6, position: 9 },
      { name: "Manual Reports", url: "/reports/manual_report/", menu_row_id: 6, position: 10 },
      { name: "Rankings", url: "/rank/", menu_row_id: 6, position: 11 },
    ],
  },
  people: {
    "8": [
      { name: "Company Directory", url: "/users/", menu_row_id: 8, position: 1 },
      { name: "Accounts & Contacts", url: "/contacts/", menu_row_id: 8, position: 2 },
      { name: "Find New Leads", url: "/map/places/", menu_row_id: 8, position: 4 },
      { name: "Routes", url: "/route/", menu_row_id: 8, position: 5 },
      { name: "Business Cards", url: "/business_cards/", menu_row_id: 8, position: 6 },
      { name: "Find & Merge Duplicate Accounts", url: "/duplicates/contact_duplicates/", menu_row_id: 8, position: 7 },
    ],
  },
  stats: {
    "9": [],
  },
  mail: {
    "11": [
      { name: "My Subscriptions", url: "/mail/settings/20373/", menu_row_id: 11, position: 3 },
      { name: "My Email", url: "/mail/emails/", menu_row_id: 11, position: 4 },
    ],
  },
  support: {
    "12": [
      { name: "Documentation", url: "https://callproofsupport.helpscoutdocs.com/", menu_row_id: 12, position: 0 },
      { name: "Submit Support Request", url: "/support/", menu_row_id: 12, position: 1 },
      { name: "Help & FAQs", url: "https://callproof.com/plans/#faq", menu_row_id: 12, position: 2 },
    ],
  },
  settings: {
    "14": [
      { name: "Set Time Zone", url: "/timezone/", menu_row_id: 14, position: 0 },
      { name: "Link Email Accounts", url: "/em/", menu_row_id: 14, position: 1 },
      { name: "Calendar Set-Up", url: "/calendar-integration/", menu_row_id: 14, position: 2 },
    ],
  },
  communication: {
    "15": [
      { name: "Make a Call", url: "/anywhere/", menu_row_id: 15, position: 0 },
      { name: "Sent a Text", url: "/sms/", menu_row_id: 15, position: 1 },
      { name: "Recorded Voicemail Messages", url: "/caller/msgs/", menu_row_id: 15, position: 2 },
      { name: "Call History", url: "/calls/all/", menu_row_id: 15, position: 3 },
      { name: "Do Not Call", url: "/contacts/do_not_call/", menu_row_id: 15, position: 4 },
      { name: "Choose After Call Form", url: "/eforms/after_call", menu_row_id: 15, position: 5 },
    ],
  },
} as const satisfies Record<string, CallproofMenuBucket>;

export const menuRowLabels: Record<string, string> = {
  "1": "Settings",
  "2": "CallProof Voice",
  "3": "Quick Links",
  "4": "Tools",
  "13": "Billing",
};

function sortItems(items: CallproofMenuItem[]): CallproofMenuItem[] {
  return [...items].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
}

export type FlyoutSingle = {
  kind: "single";
  title: string;
  items: CallproofMenuItem[];
};

export type FlyoutSections = {
  kind: "sections";
  title: string;
  sections: { heading: string; items: CallproofMenuItem[] }[];
};

export type FlyoutContent = FlyoutSingle | FlyoutSections;

export type SidebarNavFlyoutId =
  | "communication"
  | "people"
  | "sales"
  | "reports"
  | "stats"
  | "subscription"
  | "support"
  | "settings"
  | "personal";

const ROW_ORDER_HOME = ["1", "2", "3", "4", "13"] as const;

export function getFlyoutForNav(navId: SidebarNavFlyoutId): FlyoutContent | null {
  if (navId === "personal") {
    const sections: { heading: string; items: CallproofMenuItem[] }[] = [];
    for (const row of ROW_ORDER_HOME) {
      const raw = callproofSidebarMenu.home[row];
      if (raw?.length) {
        sections.push({ heading: menuRowLabels[row] ?? `Menu ${row}`, items: sortItems(raw as CallproofMenuItem[]) });
      }
    }
    return { kind: "sections", title: "Home", sections };
  }

  const map: Record<
    Exclude<SidebarNavFlyoutId, "personal">,
    { title: string; bucket: keyof typeof callproofSidebarMenu; row: string }
  > = {
    communication: { title: "Communication", bucket: "communication", row: "15" },
    people: { title: "People", bucket: "people", row: "8" },
    sales: { title: "Sales", bucket: "sales", row: "5" },
    reports: { title: "Reports", bucket: "dashboard", row: "6" },
    stats: { title: "Stats", bucket: "stats", row: "9" },
    subscription: { title: "Subscription", bucket: "mail", row: "11" },
    support: { title: "Support", bucket: "support", row: "12" },
    settings: { title: "Settings", bucket: "settings", row: "14" },
  };

  const spec = map[navId as Exclude<SidebarNavFlyoutId, "personal">];
  if (!spec) return null;

  const bucket = callproofSidebarMenu[spec.bucket] as CallproofMenuBucket;
  const items = bucket[spec.row] as CallproofMenuItem[] | undefined;
  const sorted = sortItems(items ?? []);
  return { kind: "single", title: spec.title, items: sorted };
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
