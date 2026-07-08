import { useState, useMemo } from "react";
import { PRECOMPUTED_MACHINES, tierOf } from "./data";
import { Machine, TierKey } from "./types";
import SummaryCard from "./components/SummaryCard";
import MachineCard from "./components/MachineCard";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  // Filters and Sorting State
  const [filterMode, setFilterMode] = useState<"all" | "alert">("all");
  const [isSorted, setIsSorted] = useState<boolean>(false);
  
  // Accordion state for open items
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  // 1. Tier counts always reflect the full dataset, not the filtered view
  const summaryCounts = useMemo(() => {
    const counts: Record<TierKey, number> = { green: 0, yellow: 0, orange: 0, red: 0 };
    PRECOMPUTED_MACHINES.forEach((m) => {
      const tier = tierOf(m.score).key;
      counts[tier]++;
    });
    return counts;
  }, []);

  // 2. Filter & sort logic matching the original script exactly
  const processedMachines = useMemo(() => {
    let result = [...PRECOMPUTED_MACHINES];

    if (filterMode === "alert") {
      // "Show yellow and above" filters out score < 25 and forces descending sort
      result = result.filter((m) => m.score >= 25);
      result.sort((a, b) => b.score - a.score);
    } else if (isSorted) {
      // "Sort by risk score" sorts the current array descending
      result.sort((a, b) => b.score - a.score);
    }

    return result as Required<Machine>[];
  }, [filterMode, isSorted]);

  // Toggle card helper
  const handleToggleCard = (name: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  // Click handlers
  const handleSortScore = () => {
    setIsSorted(true);
    // If we sort score, we keep the current filter mode (all or alert)
  };

  const handleFilterAlert = () => {
    setFilterMode("alert");
    setIsSorted(true); // Alert mode automatically triggers sorting
  };

  const handleFilterAll = () => {
    setFilterMode("all");
    setIsSorted(false); // Resets sorting back to original list ordering
  };

  return (
    <div className="wrap">
      {/* Top Header Section with Title, Description, and Theme Toggle */}
      <div className="header-container" id="dashboard-header">
        <div>
          <h1>Reliability early-warning dashboard</h1>
          <p className="subhead">
            Risk scores computed live from sub-score inputs — click any row to see the breakdown.
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Summary Score Metrics Grid */}
      <div className="summary" id="summary-section">
        <SummaryCard label="Green" count={summaryCounts.green} tier="green" />
        <SummaryCard label="Yellow" count={summaryCounts.yellow} tier="yellow" />
        <SummaryCard label="Orange" count={summaryCounts.orange} tier="orange" />
        <SummaryCard label="Red" count={summaryCounts.red} tier="red" />
      </div>

      {/* Control Actions Row */}
      <div className="controls" id="dashboard-controls">
        <button
          id="sortScore"
          onClick={handleSortScore}
          className={`control-btn ${isSorted && filterMode !== "alert" ? "active" : ""}`}
        >
          Sort by risk score
        </button>
        <button
          id="filterAlert"
          onClick={handleFilterAlert}
          className={`control-btn ${filterMode === "alert" ? "active" : ""}`}
        >
          Show yellow and above
        </button>
        <button
          id="filterAll"
          onClick={handleFilterAll}
          className={`control-btn ${filterMode === "all" && !isSorted ? "active" : ""}`}
        >
          Show all
        </button>
      </div>

      {/* Equipment Risk Cards List */}
      <div id="rows" className="space-y-2">
        {processedMachines.map((m) => (
          <MachineCard
            key={m.name}
            machine={m}
            isOpen={openIds.has(m.name)}
            onToggle={() => handleToggleCard(m.name)}
          />
        ))}
      </div>
    </div>
  );
}
