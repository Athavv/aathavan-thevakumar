interface FloatingCardProps {
  label: string;
  value: string;
  icon?: string;
  className?: string;
}

export default function FloatingCard({ label, value, icon, className = "" }: FloatingCardProps) {
  return (
    <div
      className={`floating-card ${className}`}
      style={{
        background: "rgba(15, 16, 32, 0.82)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "14px",
        padding: "14px 18px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "4px",
        minWidth: "140px",
      }}
    >
      {icon && <span style={{ fontSize: "1.1rem" }}>{icon}</span>}
      <span
        style={{
          fontFamily: "Clash Display, sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "var(--fg)",
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.65rem",
          color: "var(--fg-muted)",
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
