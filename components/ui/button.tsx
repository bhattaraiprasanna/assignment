"use client";

import React, { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring transition-colors";

  const variantClass = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-300",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-300",
  }[variant];
  

  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={cn(base, variantClass, sizeClass, loading && "opacity-60 cursor-not-allowed", className)}
      {...props}
    >
      {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-white border-gray-200" />}
      {children}
    </button>
  );
};

export default Button;