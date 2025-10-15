import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default:
        "bg-slate-900 text-slate-50 hover:bg-slate-800 active:bg-slate-950 shadow-sm",
      outline:
        "border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-900 active:bg-slate-100",
      ghost: "hover:bg-slate-100 text-slate-700 active:bg-slate-200",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
    };

  const sizes = {
    default: "h-9 sm:h-10 px-3 sm:px-4 py-2 text-xs sm:text-sm",
    sm: "h-8 px-2 sm:px-3 text-xs",
    lg: "h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base",
    icon: "h-9 w-9 sm:h-10 sm:w-10",
  };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
