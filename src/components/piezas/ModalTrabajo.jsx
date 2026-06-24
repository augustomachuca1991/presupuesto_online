import { useState } from "react";
import { ModalGenerico } from "@/components/ui/ModalGenerico";
import { FormInput, FormSelect } from "@/components/ui/FormComponents";
import { ICONS } from "@/constants/icons";

const ModalTrabajo = ({ trabajo, piezaNombre, onGuardar, onClose, guardando }) => {
  const [nombre, setNombre] = useState(trabajo?.nombre ?? "");
  const [precio, setPrecio] = useState(trabajo?.precio_base ?? "");

  const handleSubmit = async () => {
    if (!nombre.trim() || !precio) return false;
    await onGuardar({ nombre, precio_base: precio });
    return true;
  };

  return (
    <ModalGenerico
      titulo={trabajo ? "Editar trabajo" : "Nuevo trabajo"}
      subtitulo={`Pieza: ${piezaNombre}`}
      iconClass={ICONS.TOOL}
      guardando={guardando}
      hasEditMode={false}
      onSave={handleSubmit}
      onClose={onClose}
    >
      <div className="space-y-4">
        <FormInput
          label="Nombre del trabajo"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="ej: Reparación abolladura, Pintura 2 manos…"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <div className="w-full">
          <FormInput label="Precio base" required type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="28000" min={0} step={100} className="pl-6" />
          {/* Símbolo '$' absoluto posicionado sobre el padding-left del FormInput */}
          <div className="relative -mt-9 h-9 w-6 flex items-center justify-center pointer-events-none text-[13px] text-ant3 font-medium">$</div>
        </div>
      </div>
    </ModalGenerico>
  );
};

export default ModalTrabajo;
