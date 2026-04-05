interface FloatingCardProps {
  label: string;
  value: string;
  className?: string;
}

export default function FloatingCard({ label, value, className = "" }: FloatingCardProps) {
  return (
    <div className={`floating-card ${className}`}>
      <span className="fc-value">{value}</span>
      <span className="fc-label">{label}</span>
    </div>
  );
}
