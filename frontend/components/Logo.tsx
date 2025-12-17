'use client';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-16" }: LogoProps) {
  return (
    <img 
      src="/images/logo.png" 
      alt="Logo" 
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
