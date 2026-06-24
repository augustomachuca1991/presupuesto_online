// src/components/Field.jsx
import { ICONS } from "@/constants/icons";
import React from "react";

// Agregamos valores por defecto (= false) para hacerlos opcionales
const Field = ({ label, required = false, error = null, touched = false, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] text-ant3 font-medium">
        {label}
        {required && <span className="text-[#a32d2d] font-bold ml-0.5">*</span>}
      </label>

      {children}

      {touched && error && (
        <div className="flex items-center gap-1 text-[11px] text-[#a32d2d] mt-0.5">
          <i className={ICONS.ALERT_CIRCLE + " text-[13px]"} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Field;
