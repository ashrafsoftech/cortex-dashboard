// interface SummaryCardProps {
//   label: string;
//   count: number;
//   tier: "green" | "yellow" | "orange" | "red";
// }

// export default function SummaryCard({ label, count, tier }: SummaryCardProps) {
//   return (
//     <div className="summary-card" id={`summary-card-${tier}`}>
//       <p>{label}</p>
//       <p className="cnt" data-tier={tier}>
//         {count}
//       </p>
//     </div>
//   );
// }
interface SummaryCardProps {
  label: string;
  count: number;
  tier: "green" | "yellow" | "orange" | "red";
}

export default function SummaryCard({ label, count, tier }: SummaryCardProps) {
  return (
    <div className={`summary-card tier-bg-${tier}`} id={`summary-card-${tier}`}>
      <p>{label}</p>
      <p className="cnt" data-tier={tier}>
        {count}
      </p>
    </div>
  );
}