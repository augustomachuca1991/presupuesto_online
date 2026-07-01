# VM - Presupuestos Online

Sistema de presupuestos para taller de chapa y pintura. Gestión de clientes, vehículos, presupuestos con PDF, órdenes de trabajo y catálogo de piezas.

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 |
| **Estado** | Zustand 5 |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **PDF** | html2pdf.js |
| **Formularios** | Formik + Yup |
| **Ruteo** | React Router DOM 7 |
| **Íconos** | Tabler Icons |

## Funcionalidades

- [x] Autenticación (email/password, recuperación de contraseña)
- [x] Presupuestos multi-paso: vehículo → propietario → piezas → trabajos → totales
- [x] IVA 21% seleccionable (opcional)
- [x] Vista previa del presupuesto
- [x] PDF descargable e imprimible
- [x] Compartir por WhatsApp
- [x] Historial de presupuestos con búsqueda
- [x] Máquina de estados: borrador → emitido → aprobado/rechazado/vencido → orden
- [x] Órdenes de trabajo con adjuntos y fotos
- [x] CRUD de vehículos (agrupados por marca)
- [x] CRUD de clientes
- [x] Catálogo de piezas y trabajos
- [x] CRUD de marcas y modelos
- [x] Turnos

## Requisitos

- Node.js 20+
- pnpm 10+
- Cuenta en [Supabase](https://supabase.com)

## Setup

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

# 3. Inicializar base de datos
# Abrir schema.sql en el SQL Editor de Supabase y ejecutar

# 4. Iniciar en desarrollo
pnpm dev
```

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase |

## Base de Datos

Toda la migración está en [`schema.sql`](./schema.sql). Incluye:

- 10 tablas: `marcas`, `modelos`, `clientes`, `vehiculos`, `piezas`, `trabajos_catalogo`, `presupuestos`, `presupuesto_items`, `ordenes_trabajo`, `orden_adjuntos`
- Vista `v_vehiculos` con marca/modelo resueltos y último titular
- Función RPC `insertar_vehiculo_y_cliente` para alta atómica
- Secuencia `seq_presupuesto_nro` para auto-numeración
- Bucket `orden-fotos` para adjuntos

## Comandos

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Iniciar servidor de desarrollo |
| `pnpm build` | Compilar para producción |
| `pnpm preview` | Previsualizar compilado |
| `pnpm lint` | Ejecutar ESLint |

## Estructura del Proyecto

```
src/
├── components/
│   ├── auth/          # Login, registro, recuperación
│   ├── clientes/      # Buscador y modal de propietarios
│   ├── historial/     # Historial de presupuestos
│   ├── logos/         # Logo de la marca VM
│   ├── ordenes/       # Órdenes de trabajo
│   ├── piezas/        # CRUD de piezas y trabajos
│   ├── presupuesto/   # Creación de presupuestos
│   ├── ui/            # Componentes reutilizables
│   └── vehiculo/      # Buscador y modal de vehículos
├── hooks/             # Lógica de negocio y Supabase
├── pages/             # Páginas por sección
├── store/             # Estado global (Zustand)
├── utils/             # Utilidades (formateo, estados, navegación)
├── layouts/           # Layout principal con sidebar
├── routes/            # Definición de rutas
├── lib/               # Cliente Supabase
└── assets/            # SVG, logos de marcas, imágenes
```

## Deployment

El proyecto incluye [`vercel.json`](./vercel.json) para deploy en Vercel con rewrites SPA.

```bash
pnpm build
# Subir la carpeta dist/ o conectar con Vercel desde el repo
```
