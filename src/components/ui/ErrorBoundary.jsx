import { Component } from "react";
import { ICONS } from "@/constants/icons";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
          <div className="w-14 h-14 rounded bg-red-900/30 flex items-center justify-center">
            <i className={`${ICONS.ALERT_TRIANGLE} text-[26px] text-red-400`} />
          </div>
          <h1 className="text-[15px] font-semibold text-antl mb-2">Error inesperado</h1>
          <p className="text-[13px] text-antm max-w-sm">{this.state.error?.message ?? "Ocurrió un error al cargar este componente."}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 h-9 rounded-md bg-yel text-yeld hover:bg-yelm transition-colors cursor-pointer"
          >
            <i className={ICONS.REFRESH} /> Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
