import React from "react";

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    error.__ErrorBoundary = true;
    window.__COMPONENT_ERROR__?.(error, errorInfo);
    console.log("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    // ESTA ES LA LÍNEA CLAVE: Extraemos 't' de las props
    const { children } = this.props;

    if (this.state?.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center p-8 max-w-md">
            <div className="flex justify-center items-center mb-2">
              <div className="p-4 bg-destructive/10 text-destructive rounded-2xl">icon</div>
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-medium text-neutral-800">title</h1>
              <p className="text-neutral-600 text-base w w-8/12 mx-auto">descripcion</p>
            </div>
            <div className="flex justify-center items-center mt-6">
              <button
                className="bg-primary hover:bg-primay text-white font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200 shadow-sm"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// El Wrapper funcional que sí puede usar hooks
const ErrorBoundary = ({ children }) => {
  return <ErrorBoundaryInner>{children}</ErrorBoundaryInner>;
};

export default ErrorBoundary;
