import { useRegisterSW } from "virtual:pwa-register/react";

export default function SWUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true });

  if (!needRefresh) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      background: "#2a2a2a",
      color: "#fff",
      padding: "14px 24px",
      borderRadius: 10,
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      gap: 16,
      fontFamily: "system-ui, sans-serif",
      fontSize: 14,
    }}>
      <span>Nueva versi&oacute;n disponible</span>
      <button
        onClick={() => updateServiceWorker(true)}
        style={{
          background: "#c0392b",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "8px 18px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        Actualizar
      </button>
    </div>
  );
}
