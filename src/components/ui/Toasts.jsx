// src/components/ui/Toasts.jsx

const TYPE_CLASSES = {
  ok: "bg-green-50 text-green-700",
  err: "bg-red-50 text-red-600",
  info: "bg-antl text-ant2",
  warn: "bg-yell text-yeld",
};

export function Toasts({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`${TYPE_CLASSES[t.type] ?? TYPE_CLASSES.info} px-[14px] py-[9px] rounded-md text-[13px] font-medium shadow-md max-w-[280px]`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
