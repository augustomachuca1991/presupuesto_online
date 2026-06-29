import { ICONS } from "@/constants/icons";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg px-4">
      <div className="text-center max-w-md w-full bg-ant2 p-8 rounded-2xl shadow-sm border border-border">
        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-red-900/20 rounded-full text-red-400 mb-6">
          <i className={`${ICONS.ROAD_SIGN} text-5xl`}></i>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </div>

        <h1 className="text-7xl font-black text-antl tracking-tight mb-2">404</h1>

        <h2 className="text-xl font-bold text-antm mb-3">¡Ruta equivocada! Pagina no encontrada</h2>

        <p className="text-ant3 text-sm leading-relaxed mb-8">El camino que estás buscando no existe o el presupuesto fue movido de lugar. Hagamos una parada en boxes para volver a la pista.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm font-medium text-antm bg-ant hover:bg-antm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className={`${ICONS.ARROW_LEFT} text-base`}></i>
            Volver atrás
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 text-sm font-medium text-white bg-ant hover:bg-ant2 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className={`${ICONS.HOME} text-base`}></i>
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
