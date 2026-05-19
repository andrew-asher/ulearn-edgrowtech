import logoUrl from "@/assets/edgrow-logo.png";

export function EdGrowLogo({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="EdGrow Tech logo"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
