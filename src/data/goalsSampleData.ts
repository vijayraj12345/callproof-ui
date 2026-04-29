export type GoalStatus = "Ongoing" | "Completed" | "Cancelled";

export type SalesGoal = {
  id: number;
  userMarket: string;
  /** e.g. "34 (Dollar)" or "51 (Points)" */
  goalSummary: string;
  endDate: string;
  status: GoalStatus;
  /** Primary progress line, e.g. "0/34" or "1240/51" */
  resultSummary: string;
  notes: string;
  completed: boolean;
  dollarTarget: number | null;
  pointsTarget: number | null;
  maximumTarget: number | null;
  restartWhenComplete: boolean;
};

export const goalsSampleData: SalesGoal[] = [
  {
    id: 44,
    userMarket: "Plusapp prod",
    goalSummary: "34 (Dollar)",
    endDate: "Jan 22, 2026, 11:37 PM",
    status: "Completed",
    resultSummary: "0/34",
    notes: "test new",
    completed: true,
    dollarTarget: 34,
    pointsTarget: null,
    maximumTarget: 34,
    restartWhenComplete: false,
  },
  {
    id: 43,
    userMarket: "Demo Rep",
    goalSummary: "67 (Dollar)",
    endDate: "Jan 30, 2026, 11:37 PM",
    status: "Completed",
    resultSummary: "0/67",
    notes: "adding goals",
    completed: true,
    dollarTarget: 67,
    pointsTarget: null,
    maximumTarget: 67,
    restartWhenComplete: false,
  },
  {
    id: 42,
    userMarket: "AITECH AIT",
    goalSummary: "51 (Points)",
    endDate: "Jan 30, 2026, 11:37 PM",
    status: "Ongoing",
    resultSummary: "1240/51",
    notes: "test notes",
    completed: false,
    dollarTarget: null,
    pointsTarget: 51,
    maximumTarget: 45,
    restartWhenComplete: true,
  },
  {
    id: 41,
    userMarket: "Demo Rep",
    goalSummary: "22 (Dollar)",
    endDate: "Jan 30, 2026, 11:37 PM",
    status: "Cancelled",
    resultSummary: "0/22",
    notes: "test",
    completed: false,
    dollarTarget: 22,
    pointsTarget: null,
    maximumTarget: 22,
    restartWhenComplete: true,
  },
  {
    id: 40,
    userMarket: "Demo Rep",
    goalSummary: "45 (Dollar)",
    endDate: "Jan 29, 2026, 11:37 PM",
    status: "Cancelled",
    resultSummary: "0/45",
    notes: "test",
    completed: false,
    dollarTarget: 45,
    pointsTarget: null,
    maximumTarget: 45,
    restartWhenComplete: false,
  },
  {
    id: 8,
    userMarket: "Rep AITECH",
    goalSummary: "1000 (Points)",
    endDate: "Aug 31, 2022, 12:00 AM",
    status: "Completed",
    resultSummary: "11/1000",
    notes: "editing notes",
    completed: true,
    dollarTarget: null,
    pointsTarget: 1000,
    maximumTarget: 1000,
    restartWhenComplete: false,
  },
  {
    id: 6,
    userMarket: "Kalaiselvan Django",
    goalSummary: "1000 (Dollar)",
    endDate: "Jul 22, 2022, 12:00 AM",
    status: "Completed",
    resultSummary: "961676.81/1000",
    notes: "",
    completed: true,
    dollarTarget: 1000,
    pointsTarget: null,
    maximumTarget: 1000,
    restartWhenComplete: false,
  },
];
