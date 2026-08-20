type LogoProps = {
  size?: number;
};

export function LogoMark({ size = 30 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="20" width="5" height="6" rx="1.5" fill="var(--logo-step)" opacity={0.6} />
      <rect x="10" y="16" width="5" height="10" rx="1.5" fill="var(--logo-step)" opacity={0.8} />
      <rect x="17" y="12" width="5" height="14" rx="1.5" fill="var(--logo-step)" />
      <rect x="24" y="6" width="5" height="20" rx="1.5" fill="var(--logo-found)" />
    </svg>
  );
}

export function Logo({ size = 30 }: LogoProps) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-word" style={{ fontSize: size * 0.86 }}>
        tradefinder
      </span>
    </span>
  );
}
