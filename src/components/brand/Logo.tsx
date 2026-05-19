export function EdGrowLogo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative grid place-items-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.62_0.17_248)] text-primary-foreground shadow-soft ${className}`}
      style={{ width: size, height: size }}
      aria-label="EdGrow Tech logo"
    >
      <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none">
        <path d="M4 14 L12 4 L20 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="17" r="2.2" fill="var(--mint)" />
        <path d="M6 18 L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  );
}
