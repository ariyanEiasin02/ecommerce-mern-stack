import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ${fullWidth ? "ui-btn--full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="ui-btn__spinner" />
      ) : icon ? (
        typeof icon === "string" ? <i className={`fi ${icon}`} /> : icon
      ) : null}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
