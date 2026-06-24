import { ICONS } from "@/constants/icons";
import { S } from "@/components/auth/AuthStyles";

export function RecoverySent({ email, onBack }) {
  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f7f6f1] border border-[#e2e0d8] mb-4">
        <i className={`${ICONS.MAIL_CHECK} text-[#ef9f27] text-2xl`} />
      </div>
      <h2 className={S.sectionTitle}>Revisá tu email</h2>
      <p className="text-[#5f5e5a] text-[12px] mb-4">
        Te enviamos un link a <span className="font-medium text-[#2c2c2a]">{email}</span>.
      </p>
      <button onClick={onBack} className={`${S.btnGhost} mx-auto`}>
        <i className={`${ICONS.ARROW_LEFT} text-[12px]`} /> Volver al login
      </button>
    </div>
  );
}
