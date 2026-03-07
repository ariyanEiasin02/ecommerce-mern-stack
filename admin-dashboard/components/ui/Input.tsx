import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className={`ui-input-group ${error ? "ui-input-group--error" : ""} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="ui-input-group__label">
            {label}
          </label>
        )}
        <div className="ui-input-group__wrapper">
          {icon && <i className={`fi ${icon} ui-input-group__icon`} />}
          <input
            ref={ref}
            id={inputId}
            className={`ui-input ${icon ? "ui-input--with-icon" : ""}`}
            {...props}
          />
        </div>
        {error && <span className="ui-input-group__error">{error}</span>}
        {helperText && !error && <span className="ui-input-group__helper">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
