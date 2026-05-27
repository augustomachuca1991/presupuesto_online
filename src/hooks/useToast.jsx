// src/hooks/useToast.js

import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const toast = {
    success: (m) => add(m, "ok"),
    error: (m) => add(m, "err"),
    info: (m) => add(m, "info"),
    warning: (m) => add(m, "warn"),
  };

  return { toasts, toast };
}
