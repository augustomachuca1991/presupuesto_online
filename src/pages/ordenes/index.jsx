// src/pages/ordenes.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import DetalleOrden from "@/components/ordenes/DetalleOrden";
import ListaOrdenes from "@/components/ordenes/ListaOrdenes";

export default function Ordenes({ detalle }) {
  const { id } = useParams();
  return detalle && id ? <DetalleOrden id={id} /> : <ListaOrdenes />;
}
