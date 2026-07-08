export interface Machine {
  name: string;
  area: string;
  type: string;
  cond: number;
  trend: number;
  history: number;
  confidence: number;
  trendLabel: string;
  tth: string;
  action: string;
  owner: string;
  score?: number;
  crs?: number;
  criticality?: number;
}

export type TierKey = "green" | "yellow" | "orange" | "red";

export interface TierInfo {
  key: TierKey;
  label: string;
  cls: string;
}

export interface Weights {
  cond: number;
  trend: number;
  history: number;
  criticality: number;
}
