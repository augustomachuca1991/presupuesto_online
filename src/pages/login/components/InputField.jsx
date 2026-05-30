import { S } from "@/pages/login/components/Styles";

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
          <i className={`ti ${icon} text-[14px]`} />
        </span>
        <input id={id} type={type} placeholder={placeholder} {...field} className={S.input(hasError)} />
      </div>
      {hasError && (
        <p className={S.fieldError}>
          <i className="ti ti-alert-circle text-[12px]" />
          {meta.error}
        </p>
      )}
    </div>
  );
}
