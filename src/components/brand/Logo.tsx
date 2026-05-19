import logoUrl from "@/assets/edgrow-logo.png";
import { useTheme } from "@/lib/theme";

export function EdGrowLogo({ size = 36, className = "" }: { size?: number; className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <img
      src={logoUrl}
      alt="EdGrow Tech logo"
      width={size}
      height={size}
      className={`object-contain transition-all duration-300 ${className}`}
      style={{
        width: size,
        height: size,
        // In dark mode, lift the mark so it reads on the dark navbar.
        // In light mode, render natural colors.
        filter: isDark
          ? "brightness(1.15) contrast(1.05) drop-shadow(0 0 6px rgba(15,252,190,0.25))"
          : "drop-shadow(0 1px 2px rgba(16,110,190,0.18))",
        mixBlendMode: isDark ? "screen" : "normal",
      }}
    />
  );
}
