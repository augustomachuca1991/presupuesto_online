import { useState } from "react";
import { ModalGenerico } from "@/components/ui/ModalGenerico";
import { FormInput, FormSelect } from "@/components/ui/FormComponents";

const ModalPieza = ({ pieza, categorias, onGuardar, onClose, guardando }) => {
  const [nombre, setNombre] = useState(pieza?.nombre ?? "");
  const [categoria, setCategoria] = useState(pieza?.categoria ?? categorias[0]);

  const handleSubmit = async () => {
    if (!nombre.trim()) return false;
    await onGuardar({ nombre, categoria });
    return true;
  };

  return (
    <ModalGenerico
      titulo={pieza ? "Editar pieza" : "Nueva pieza"}
      subtitulo={pieza ? `Modificá los datos de "${pieza.nombre}"` : "Completá los datos para crearla"}
      iconClass="ti-components"
      guardando={guardando}
      hasEditMode={false} // Va directo al formulario sin modo lectura previo
      onSave={handleSubmit}
      onClose={onClose}
    >
      <div className="space-y-4">
        <FormInput
          label="Nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="ej: Capot, Luneta trasera…"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <FormSelect label="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </FormSelect>
      </div>
    </ModalGenerico>
  );
};

export default ModalPieza;
