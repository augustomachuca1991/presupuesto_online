import { useNavigate } from "react-router-dom"; // O de la librería de rutas que uses

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] px-4">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-[#e2e8f0]">
        {/* Icono Principal Estilo Taller */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full text-red-500 mb-6">
          <i className="ti ti-road-sign text-5xl"></i>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </div>

        {/* Código de Error */}
        <h1 className="text-7xl font-black text-slate-800 tracking-tight mb-2">404</h1>

        {/* Título */}
        <h2 className="text-xl font-bold text-slate-700 mb-3">¡Ruta equivocada! Pagina no encontrada</h2>

        {/* Descripción */}
        <p className="text-slate-500 text-sm leading-relaxed mb-8">El camino que estás buscando no existe o el presupuesto fue movido de lugar. Hagamos una parada en boxes para volver a la pista.</p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <i className="ti ti-arrow-left text-base"></i>
            Volver atrás
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <i className="ti ti-home text-base"></i>
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
