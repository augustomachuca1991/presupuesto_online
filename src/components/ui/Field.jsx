import { ICONS } from "@/constants/icons";
import React from "react";

const Field = ({ label, required = false, error = null, touched = false, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] text-antm font-medium">
        {label}
        {required && <span className="text-red-400 font-bold ml-0.5">*</span>}
      </label>

      {children}

      {touched && error && (
        <div className="flex items-center gap-1 text-[11px] text-red-400 mt-0.5">
          <i className={`${ICONS.ALERT_CIRCLE} text-[13px]`} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Field;
