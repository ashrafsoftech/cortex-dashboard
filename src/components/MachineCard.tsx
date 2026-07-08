import { Machine } from "../types";
import { tierOf } from "../data";

interface MachineCardProps {
  machine: Required<Machine>;
  isOpen: boolean;
  onToggle: () => void;
  key?: string | number;
}

export default function MachineCard({ machine, isOpen, onToggle }: MachineCardProps) {
  const t = tierOf(machine.score);

  return (
    <div className={`card animate-fade-in ${isOpen ? "open" : ""}`} id={`machine-card-${machine.name.toLowerCase().replace(/\s+/g, "-")}`}>
      {/* Clickable Header Row */}
      <div className="row" onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onToggle(); } }}>
        <div className={`score-box ${t.cls}`} id={`score-box-${machine.name.toLowerCase().replace(/\s+/g, "-")}`}>
          <span>{machine.score}</span>
        </div>
        
        <div className="row-main">
          <div className="title-line">
            <p>{machine.name}</p>
            <span className={`badge ${t.cls}`}>{t.label}</span>
          </div>
          <p className="sub">
            {machine.area} &middot; trend {machine.trendLabel} &middot; time-to-critical {machine.tth}
          </p>
        </div>

        <div className="row-action">
          <p title={machine.action}>{machine.action}</p>
          <p>{machine.owner}</p>
        </div>

        {/* Precise replica of original SVG chevron for 100% design fidelity */}
        <svg className="chevron" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Expandable Detail Panel */}
      <div className="detail" style={{ maxHeight: isOpen ? "400px" : "0" }}>
        <div className="detail-inner">
          <p className="detail-label">Sub-scores feeding this result</p>
          
          <div className="subscores">
            <div className="subscore-item">
              <p>
                Condition <span className="weight">(40%)</span>
              </p>
              <p>{machine.cond}</p>
            </div>
            <div className="subscore-item">
              <p>
                Trend <span className="weight">(30%)</span>
              </p>
              <p>{machine.trend}</p>
            </div>
            <div className="subscore-item">
              <p>
                History <span className="weight">(15%)</span>
              </p>
              <p>{machine.history}</p>
            </div>
            <div className="subscore-item">
              <p>
                Criticality <span className="weight">(15%)</span>
              </p>
              <p>{machine.criticality}</p>
            </div>
          </div>

          <div className="formula-row">
            <span>
              CRS = {machine.crs} &middot; Final = min(100, CRS &times; confidence)
            </span>
            <span className="confidence-pill">
              Confidence {(machine.confidence * 100).toFixed(0)}%
            </span>
          </div>
          
          <p className="assumption-note">
            Sub-scores and confidence are current placeholder values, not yet from live sensors.
          </p>
        </div>
      </div>
    </div>
  );
}
