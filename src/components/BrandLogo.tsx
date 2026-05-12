type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const logoSizes = {
  sm: "h-9 w-9",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

export function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  return (
    <div
      className={`${logoSizes[size]} shrink-0 overflow-hidden rounded-full border border-neon/40 bg-black shadow-[0_0_24px_oklch(0.86_0.22_148/0.18)] ${className}`}
    >
      <img
        src="/hello-kitty-fitness-logo.png"
        alt="ValkyrFit"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
