import React from "react";

const CAMPO_BASE =
  "w-full px-3 h-9 rounded-md border border-border bg-ant2 text-[13px] text-antl placeholder:text-ant3 focus:outline-none focus:border-yel focus:ring-1 focus:ring-yel/30 transition disabled:opacity-50 disabled:bg-ant2/50";
const LABEL_BASE = "block text-[11px] font-semibold text-antm uppercase tracking-wide mb-1";
const VISTA_TEXTO_BASE = "w-full px-3 h-9 rounded-md border border-transparent bg-ant2/40 text-[13px] text-antl/70 flex items-center";

export function Label({ children, required, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className={LABEL_BASE}>
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

export function FormInput({ label, required, error, formik, name, isEditing = true, valueText, className = "", ...props }) {
  const fieldProps = formik && name ? formik.getFieldProps(name) : {};
  const fieldError = error ?? (formik && name && formik.touched[name] && formik.errors[name]);
  const inputId = name || props.id;

  return (
    <div className="w-full">
      {label && <Label htmlFor={inputId} required={required}>{label}</Label>}

      {isEditing ? (
        <input
          id={inputId}
          name={name}
          className={`${CAMPO_BASE} ${fieldError ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""} ${className}`}
          {...fieldProps}
          {...props}
        />
      ) : (
        <div className={`${VISTA_TEXTO_BASE} ${className}`}>{valueText || props.value || fieldProps.value || "—"}</div>
      )}

      {isEditing && fieldError && <p className="text-[11px] text-red-400 mt-1">{fieldError}</p>}
    </div>
  );
}

export function FormSelect({ label, required, error, formik, name, isEditing = true, valueText, children, className = "", ...props }) {
  const fieldProps = formik && name ? formik.getFieldProps(name) : {};
  const fieldError = error ?? (formik && name && formik.touched[name] && formik.errors[name]);
  const selectId = name || props.id;

  return (
    <div className="w-full">
      {label && <Label htmlFor={selectId} required={required}>{label}</Label>}

      {isEditing ? (
        <select id={selectId} name={name} className={`${CAMPO_BASE} ${fieldError ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""} ${className}`} {...fieldProps} {...props}>
          {children}
        </select>
      ) : (
        <div className={`${VISTA_TEXTO_BASE} ${className}`}>{valueText || "—"}</div>
      )}

      {isEditing && fieldError && <p className="text-[11px] text-red-400 mt-1">{fieldError}</p>}
    </div>
  );
}
