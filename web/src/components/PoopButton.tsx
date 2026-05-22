import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

interface PoopButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  href?: string;
  size?: "md" | "lg";
}

const sizes = {
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function PoopButton({
  variant = "primary",
  children,
  href,
  size = "md",
  className = "",
  ...props
}: PoopButtonProps) {
  const classes = `poop-btn ${variant === "primary" ? "poop-btn-primary" : "poop-btn-secondary"} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={`inline-block text-center ${classes}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
