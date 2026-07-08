import { Machine, Weights, TierInfo, TierKey } from "./types";

export const WEIGHTS: Weights = {
  cond: 0.40,
  trend: 0.30,
  history: 0.15,
  criticality: 0.15,
};

export const CRITICALITY_TABLE: Record<string, number> = {
  "Kiln": 95,
  "Coal Mill": 75,
  "Raw Mill": 55,
  "Cement Mill": 45,
  "Crusher": 35,
  "Packer Line": 25,
};

export const INITIAL_MACHINES: Machine[] = [
  {
    name: "Kiln 1",
    area: "Pyroprocessing",
    type: "Kiln",
    cond: 85,
    trend: 85,
    history: 60,
    confidence: 1.0,
    trendLabel: "+",
    tth: "6.8 hrs",
    action: "Reduce load 15%, isolate for maintenance at shift end",
    owner: "Plant manager",
  },
  {
    name: "Coal Mill 2",
    area: "Fuel prep",
    type: "Coal Mill",
    cond: 70,
    trend: 75,
    history: 30,
    confidence: 0.9,
    trendLabel: "+",
    tth: "~10 hrs",
    action: "Schedule inspection this shift",
    owner: "Maintenance supervisor",
  },
  {
    name: "Raw Mill 1",
    area: "Raw grinding",
    type: "Raw Mill",
    cond: 50,
    trend: 55,
    history: 15,
    confidence: 0.8,
    trendLabel: "+",
    tth: "~2 days",
    action: "Add to next inspection round",
    owner: "Area technician",
  },
  {
    name: "Crusher 3",
    area: "Crushing",
    type: "Crusher",
    cond: 25,
    trend: 30,
    history: 0,
    confidence: 0.7,
    trendLabel: "flat",
    tth: "-",
    action: "Increase monitoring frequency",
    owner: "Area technician",
  },
  {
    name: "Cement Mill 1",
    area: "Finish grinding",
    type: "Cement Mill",
    cond: 15,
    trend: 10,
    history: 0,
    confidence: 0.6,
    trendLabel: "-",
    tth: "-",
    action: "Routine monitoring",
    owner: "-",
  },
  {
    name: "Packer Line 2",
    area: "Packing",
    type: "Packer Line",
    cond: 10,
    trend: 10,
    history: 0,
    confidence: 0.5,
    trendLabel: "flat",
    tth: "-",
    action: "Routine monitoring",
    owner: "-",
  },
];

export function computeScore(m: Machine): { crs: number; criticality: number; final: number } {
  const criticality = CRITICALITY_TABLE[m.type] || 0;
  const crs =
    WEIGHTS.cond * m.cond +
    WEIGHTS.trend * m.trend +
    WEIGHTS.history * m.history +
    WEIGHTS.criticality * criticality;
  const final = Math.min(100, crs * m.confidence);
  return {
    crs: Math.round(crs * 100) / 100,
    criticality,
    final: Math.round(final),
  };
}

export function tierOf(score: number): TierInfo {
  if (score >= 75) return { key: "red", label: "Critical", cls: "tier-red" };
  if (score >= 50) return { key: "orange", label: "Elevated", cls: "tier-orange" };
  if (score >= 25) return { key: "yellow", label: "Watch", cls: "tier-yellow" };
  return { key: "green", label: "Normal", cls: "tier-green" };
}

// Compute full precalculated objects
export const PRECOMPUTED_MACHINES: Required<Machine>[] = INITIAL_MACHINES.map((m) => {
  const result = computeScore(m);
  return {
    ...m,
    score: result.final,
    crs: result.crs,
    criticality: result.criticality,
  } as Required<Machine>;
});
