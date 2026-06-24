// src/pages/auth/InputField.jsx
// Campo de input reutilizable para formularios de auth
import { ICONS } from "@/constants/icons";
import { S } from "@/components/auth/AuthStyles";

export function InputField({ id, label, type = "text", placeholder, field, meta, icon, right }) {
  const hasError = meta.touched && meta.error;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className={S.label}>
          {label}
        </label>
        {right}
      </div>
      <div className="relative">
        <span className={S.inputIcon}>
          <i className={`${icon} text-[14px]`} />
        </span>
        <input id={id} type={type} placeholder={placeholder} {...field} className={S.input(hasError)} />
      </div>
      {hasError && (
        <p className={S.fieldError}>
          <i className={`${ICONS.ALERT_CIRCLE} text-[12px]`} />
          {meta.error}
        </p>
      )}
    </div>
  );
}
