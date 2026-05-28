// src/pages/PresupuestoPage.jsx

import { useState, useRef } from "react";
import { PropietarioBuscador } from "@/components/clientes/PropietarioBuscador";

import { useVehiculos } from "@/hooks/useVehiculos";
import { usePresupuesto } from "@/hooks/usePresupuesto";
import { useHistorial } from "@/hooks/useHistorial";
import { useToast } from "@/hooks/useToast";
import { useClientes } from "@/hooks/useClientes";
import { useCatalogo } from "@/hooks/useCatalogo";

import { Toasts } from "@/components/ui/Toasts";
import { VehiculoBuscador } from "@/components/vehiculo/VehiculoBuscador";
import { ModalVehiculo } from "@/components/vehiculo/ModalVehiculo";
import { PiezasGrid } from "@/components/presupuesto/PiezasGrid";
import { TrabajosPanel } from "@/components/presupuesto/TrabajosPanel";
import { DetalleItems } from "@/components/presupuesto/DetalleItems";
import { PDFPreview } from "@/components/presupuesto/PDFPreview";
import { HistorialPanel } from "@/components/historial/HistorialPanel";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

import { AppLayout } from "@/layouts/AppLayout";

export default function PresupuestoPage() {
  const [tab, setTab] = useState("nuevo");
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [dominioInput, setDominioInput] = useState("");
  const [alertState, setAlertState] = useState({ msg: "", type: "" });
  const alertTimer = useRef(null);

  const alerta = (msg, type) => {
    setAlertState({ msg, type });
    clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => setAlertState({ msg: "", type: "" }), 3200);
  };

  const { toasts, toast } = useToast();

  const { piezas, trabajosDe, isLoading: cargandoCatalogo } = useCatalogo();
  const { vehiculoActual, isLoading: buscando, buscarVehiculo, sugerencias, sugerirVehiculos, agregarVehiculo, resetVehiculo, agregarVehiculoYPropietario } = useVehiculos();
  const {
    nuevoCliente,
    propietarioActual, // cliente seleccionado
    propietarioQuery, // texto del input
    setPropietarioQuery, // actualiza el texto
    buscandoPropietario, // loading bool
    sugerenciasPropietario, // array filtrado
    buscarPropietario, // busca por query exacto
    sugerirPropietarios, // filtra mientras se escribe
    seleccionarPropietario, // selecciona desde dropdown
    resetPropietario,
  } = useClientes();

  const {
    nro,
    items,
    descuento,
    obs,
    setObs,
    piezaSelId,
    piezaSeleccionada,
    trabajosDePiezaSel,
    bruto,
    ahorro,
    neto,
    seleccionarPieza,
    cerrarPieza,
    toggleTrabajo,
    editarPrecio,
    cambiarDescuento,
    construirRegistro,
    resetPresupuesto,
    cantPorPieza,
    trabajoSeleccionado,
    DESCUENTO_MAX,
  } = usePresupuesto({ piezas, trabajosDe });

  const { historialFiltrado, busqueda, setBusqueda, agregarRegistro, totalGuardados, cargando, cambiarEstado, generarOrden } = useHistorial();

  const handleBuscar = async (dom) => {
    const { encontrado } = await buscarVehiculo(dom ?? dominioInput);
    alerta(encontrado ? "Vehículo cargado." : 'No encontrado. Usá "Nuevo" para darlo de alta.', encontrado ? "o" : "i");
  };

  const handleGuardarVehiculoYPropietario = async (datos) => {
    const { ok, cliente, error } = await agregarVehiculoYPropietario(datos);
    if (ok) {
      setDominioInput(datos.dominio);
      setModalOpen(false);
      seleccionarPropietario(cliente); // ← esta línea es el fix
      toast.success("Vehículo y propietario registrados correctamente.");
    } else {
      toast.error(error ?? "No se pudo guardar el vehículo.");
    }
  };

  const handleVerPDF = () => {
    if (!items.length) {
      toast.error("Seleccioná al menos un trabajo.");
      return;
    }
    setPdfVisible(true);
  };

  const handleGuardarYPDF = async () => {
    if (!items.length) {
      toast.error("Seleccioná al menos un trabajo.");
      return;
    }
    const ok = await agregarRegistro(construirRegistro(vehiculoActual, propietarioActual)); // ← await
    if (ok) {
      setPdfVisible(true);
      toast.success("Presupuesto guardado correctamente.");
    } else {
      toast.error("No se pudo guardar el presupuesto.");
    }
  };

  const handleConfirmarGuardar = async () => {
    const registro = construirRegistro(vehiculoActual, propietarioActual);
    const ok = await agregarRegistro(registro);
    if (ok) {
      setPdfVisible(false);
      resetPresupuesto();
      resetVehiculo();
      setDominioInput("");
      toast.success("Presupuesto guardado correctamente.");
    } else {
      toast.error("No se pudo guardar el presupuesto.");
    }
  };

  const handleLimpiar = () => {
    resetPresupuesto();
    resetVehiculo();
    resetPropietario(); // ← que esté esta línea
    setDominioInput("");
    setAlertState({ msg: "", type: "" });
    setPdfVisible(false);
    toast.info("Formulario reiniciado.");
  };

  const handleQuitarVehiculo = () => {
    resetVehiculo();
    setDominioInput("");
    setAlertState({ msg: "", type: "" });
  };

  const handleBuscarPropietario = async () => {
    await buscarPropietario(propietarioQuery);
  };

  const puedeGuardar = !!vehiculoActual && items.length > 0;

  return (
    <>
      <Toasts toasts={toasts} />

      <div className="max-w-[620px] mx-auto px-3 sm:px-4 pt-4 pb-12">
        <Breadcrumbs />
        {/* Header — apilado en mobile */}
        <div className="flex items-center gap-3 px-4 py-3 bg-ant rounded-xl mb-5 shadow-md">
          <i className="ti ti-car-crash text-[24px] text-yel shrink-0" />
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-antl tracking-tight truncate">Taller Chapa &amp; Pintura</div>
            <div className="text-[11px] text-antm">Sistema de presupuestos</div>
          </div>
          <div className="ml-auto text-right shrink-0">
            <span className="text-[10px] text-antm block">Nro.</span>
            <strong className="text-[14px] font-semibold text-yel font-mono">#{String(nro).padStart(4, "0")}</strong>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-5">
          {[
            { id: "nuevo", label: "Nuevo presupuesto", icon: "ti-file-plus" },
            { id: "historial", label: "Historial", icon: "ti-history" },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border-b-2 -mb-px cursor-pointer transition-colors
                ${tab === id ? "text-ant border-yel" : "text-ant3 border-transparent hover:text-ant"}`}
            >
              <i className={`ti ${icon}`} />
              {label}
              {id === "historial" && totalGuardados > 0 && <span className="text-[10px] font-semibold bg-yel text-yeld px-1.5 py-0.5 rounded-full">{totalGuardados}</span>}
            </button>
          ))}
        </div>

        {/* Panel: Nuevo */}
        {tab === "nuevo" && (
          <div>
            <VehiculoBuscador
              dominio={dominioInput}
              onDominioChange={setDominioInput}
              onBuscar={handleBuscar}
              onNuevo={() => setModalOpen(true)}
              isLoading={buscando}
              vehiculoActual={vehiculoActual}
              alertState={alertState}
              sugerencias={sugerencias}
              onSugerir={sugerirVehiculos}
              onQuitarVehiculo={handleQuitarVehiculo}
              onSeleccionarSugerencia={(dom) => {
                setDominioInput(dom);
                handleBuscar(dom);
              }}
            />

            <PropietarioBuscador
              query={propietarioQuery}
              onQueryChange={setPropietarioQuery}
              onBuscar={handleBuscarPropietario}
              isLoading={buscandoPropietario}
              propietarioActual={propietarioActual}
              sugerencias={sugerenciasPropietario}
              onSugerir={sugerirPropietarios}
              onSeleccionarSugerencia={seleccionarPropietario}
              onQuitarPropietario={resetPropietario}
            />

            <PiezasGrid piezas={piezas} isLoading={cargandoCatalogo} piezaSelId={piezaSelId} onSeleccionar={seleccionarPieza} cantPorPieza={cantPorPieza} />

            <TrabajosPanel pieza={piezaSeleccionada} trabajos={trabajosDePiezaSel} onToggle={toggleTrabajo} onCerrar={cerrarPieza} trabajoSeleccionado={trabajoSeleccionado} />
            <DetalleItems
              items={items}
              descuento={descuento}
              descuentoMax={DESCUENTO_MAX}
              bruto={bruto}
              ahorro={ahorro}
              neto={neto}
              obs={obs}
              onEditarPrecio={editarPrecio}
              onQuitarItem={toggleTrabajo}
              onDescuento={cambiarDescuento}
              onObs={setObs}
            />

            {/* Acciones */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleVerPDF}
                disabled={!puedeGuardar}
                className={`text-[13px] font-semibold px-4 h-9 rounded-md flex items-center gap-1.5 transition-colors
    ${puedeGuardar ? "bg-yel text-yeld hover:bg-yelm cursor-pointer" : "bg-border text-ant3 cursor-not-allowed"}`}
              >
                <i className="ti ti-eye" /> Vista previa
              </button>
              <button onClick={handleLimpiar} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-antl cursor-pointer">
                <i className="ti ti-refresh" /> Limpiar
              </button>
            </div>

            {pdfVisible && <PDFPreview nro={nro} vehiculo={vehiculoActual} items={items} descuento={descuento} obs={obs} onClose={() => setPdfVisible(false)} />}
          </div>
        )}

        {/* Panel: Historial */}
        {tab === "historial" && (
          <HistorialPanel
            historialFiltrado={historialFiltrado}
            totalGuardados={totalGuardados}
            busqueda={busqueda}
            onBusqueda={setBusqueda}
            cargando={cargando}
            cambiarEstado={cambiarEstado}
            generarOrden={generarOrden}
          />
        )}
      </div>

      {modalOpen && <ModalVehiculo dominioInicial={dominioInput} onClose={() => setModalOpen(false)} onSave={handleGuardarVehiculoYPropietario} />}
      {pdfVisible && (
        <PDFPreview
          nro={nro}
          vehiculo={vehiculoActual}
          cliente={propietarioActual}
          items={items}
          descuento={descuento}
          obs={obs}
          onClose={() => setPdfVisible(false)}
          onGuardar={handleConfirmarGuardar}
        />
      )}
    </>
  );
}
