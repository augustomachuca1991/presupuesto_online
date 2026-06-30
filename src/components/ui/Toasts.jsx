const TYPE_CLASSES = {
  ok: "bg-green-900/50 text-green-300 border border-green-700",
  err: "bg-red-900/50 text-red-300 border border-red-700",
  info: "bg-ant2 text-antl border border-border",
  warn: "bg-yell text-yel border border-yel/30",
};

export function Toasts({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`${TYPE_CLASSES[t.type] ?? TYPE_CLASSES.info} px-[14px] py-[9px] rounded-md text-[13px] font-medium shadow-lg max-w-[280px]`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
