import { ICONS } from "@/constants/icons";
import { Component } from "react";

class ErrorBoundaryInner extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    error.__ErrorBoundary = true;
    window.__COMPONENT_ERROR__?.(error, errorInfo);
    console.log("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state?.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-4">
          <div className="text-center p-8 max-w-md">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
                <i className={ICONS.ALERT_TRIANGLE + " text-red-500 text-2xl"} />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-ant mb-2">Error inesperado</h1>
            <p className="text-[13px] text-ant3 leading-relaxed">
              Algo salió mal. Si el problema persiste, contactá al administrador.
            </p>
            <button
              onClick={() => { window.location.href = "/"; }}
              className="mt-6 bg-yel text-yeld text-[13px] font-semibold px-4 h-9 rounded-md inline-flex items-center gap-1.5 hover:bg-yelm transition-colors"
            >
               <i className={ICONS.HOME + " text-[14px]"} /> Volver al inicio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = ({ children }) => {
  return <ErrorBoundaryInner>{children}</ErrorBoundaryInner>;
};

export default ErrorBoundary;
