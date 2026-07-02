# Plan de Implementación Técnica
## Sistema de Punto de Venta — Ferretería

**Versión:** 1.0
**Fecha:** 2026-06-29
**Basado en:** spec.md v1.0

---

## 1. Stack Tecnológico

### 1.1 Resumen

| Capa | Tecnología | Propósito |
|---|---|---|
| Frontend | **React 18** + **Vite** | Interfaz de usuario (caja, inventario, administración) |
| Backend | **Node.js** + **Express** | API REST, lógica de negocio, autenticación |
| Base de datos | **Supabase (PostgreSQL)** | Persistencia, auth, storage, realtime |
| Estilos | **Tailwind CSS** | Sistema de diseño utilitario |
| Estado del cliente | **TanStack Query** | Cache y sincronización de datos del servidor |
| Validación | **Zod** | Validación de esquemas compartida frontend/backend |
| Autenticación | **Supabase Auth** (JWT) | Login, roles, sesiones |
| Impresión de tickets | **node-thermal-printer** (ESC/POS) | Generación de tickets en backend |
| PDF / reportes | **Puppeteer** o **pdf-lib** | Reportes de corte de caja y conteos |
| Testing | **Vitest** + **Supertest** | Pruebas unitarias e integración |
| Linting / formato | **ESLint** + **Prettier** | Calidad y consistencia de código |
| Contenedores | **Docker** + **docker-compose** | Entorno reproducible de desarrollo |

### 1.2 Justificación de elecciones clave

**Supabase** se elige sobre una instancia PostgreSQL gestionada manualmente porque ofrece autenticación integrada (reduce trabajo en HU de roles y sesiones), políticas de Row Level Security (RLS) que refuerzan el control de acceso por rol descrito en el spec, y suscripciones en tiempo real útiles para alertas de stock mínimo sin necesidad de polling.

**Express** se mantiene como capa intermedia (en lugar de hablar directo desde el frontend a Supabase) para centralizar reglas de negocio sensibles: cálculo de cortes de caja, validación de descuentos con autorización, generación de folios consecutivos y lógica de devoluciones — todo esto requiere lógica que no debe vivir en el cliente.

**Vite** sobre Create React App por tiempos de build y HMR significativamente más rápidos, relevante para una app que se usará en terminales de caja con hardware modesto.

---

## 2. Arquitectura General

```
┌─────────────────┐       HTTPS/REST        ┌──────────────────┐       ┌─────────────────┐
│   Frontend       │ ───────────────────────▶│   Backend         │──────▶│   Supabase        │
│   React + Vite    │◀─────────────────────── │   Node + Express  │◀──────│   PostgreSQL +     │
│   (Terminal POS)  │      JSON / JWT          │   (Lógica negocio)│       │   Auth + Realtime  │
└─────────────────┘                          └──────────────────┘       └─────────────────┘
                                                       │
                                                       ▼
                                              ┌──────────────────┐
                                              │ Impresora térmica │
                                              │ ESC/POS (USB)     │
                                              └──────────────────┘
```

El frontend nunca se conecta directo a Supabase para operaciones de escritura críticas (ventas, cortes, ajustes de inventario); todas pasan por el backend, que valida reglas de negocio antes de persistir. Las consultas de solo lectura no sensibles (catálogo, búsqueda de productos) pueden usar el cliente de Supabase directamente para reducir latencia, sujeto a políticas RLS.

---

## 3. Estructura de Carpetas — Backend

```
pos-ferreteria-backend/
├── src/
│   ├── config/
│   │   ├── env.js                  # Carga y valida variables de entorno
│   │   ├── supabase.js             # Cliente Supabase (admin + anon)
│   │   └── constants.js            # Límites de descuento, umbrales de corte, etc.
│   │
│   ├── modules/
│   │   ├── productos/
│   │   │   ├── productos.routes.js
│   │   │   ├── productos.controller.js
│   │   │   ├── productos.service.js
│   │   │   ├── productos.repository.js
│   │   │   ├── productos.schema.js     # Validación Zod
│   │   │   └── productos.test.js
│   │   │
│   │   ├── categorias/
│   │   │   ├── categorias.routes.js
│   │   │   ├── categorias.controller.js
│   │   │   ├── categorias.service.js
│   │   │   ├── categorias.repository.js
│   │   │   └── categorias.schema.js
│   │   │
│   │   ├── ventas/
│   │   │   ├── ventas.routes.js
│   │   │   ├── ventas.controller.js
│   │   │   ├── ventas.service.js       # Cálculo de totales, folio, descuentos
│   │   │   ├── ventas.repository.js
│   │   │   ├── ventas.schema.js
│   │   │   └── ventas.test.js
│   │   │
│   │   ├── devoluciones/
│   │   │   ├── devoluciones.routes.js
│   │   │   ├── devoluciones.controller.js
│   │   │   ├── devoluciones.service.js
│   │   │   └── devoluciones.repository.js
│   │   │
│   │   ├── inventario/
│   │   │   ├── inventario.routes.js
│   │   │   ├── inventario.controller.js
│   │   │   ├── inventario.service.js   # Entradas, ajustes, conteo físico
│   │   │   ├── inventario.repository.js
│   │   │   └── inventario.schema.js
│   │   │
│   │   ├── turnos/
│   │   │   ├── turnos.routes.js
│   │   │   ├── turnos.controller.js
│   │   │   ├── turnos.service.js
│   │   │   └── turnos.repository.js
│   │   │
│   │   ├── cortes-caja/
│   │   │   ├── cortesCaja.routes.js
│   │   │   ├── cortesCaja.controller.js
│   │   │   ├── cortesCaja.service.js   # Conciliación de efectivo
│   │   │   ├── cortesCaja.repository.js
│   │   │   └── cortesCaja.test.js
│   │   │
│   │   ├── usuarios/
│   │   │   ├── usuarios.routes.js
│   │   │   ├── usuarios.controller.js
│   │   │   ├── usuarios.service.js
│   │   │   └── usuarios.repository.js
│   │   │
│   │   └── reportes/
│   │       ├── reportes.routes.js
│   │       ├── reportes.controller.js
│   │       └── reportes.service.js     # Generación de PDF/CSV
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js          # Verifica JWT de Supabase
│   │   ├── roles.middleware.js         # Restringe acceso por rol
│   │   ├── validate.middleware.js      # Aplica esquemas Zod
│   │   ├── errorHandler.middleware.js
│   │   └── auditLog.middleware.js      # Registra acciones críticas
│   │
│   ├── lib/
│   │   ├── printer/
│   │   │   └── ticketPrinter.js        # Integración ESC/POS
│   │   ├── pdf/
│   │   │   └── pdfGenerator.js
│   │   └── folio/
│   │       └── folioGenerator.js       # Folios consecutivos de venta
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── currency.js                 # Redondeo y formato monetario
│   │   └── dateHelpers.js
│   │
│   ├── app.js                          # Configuración de Express (middlewares globales)
│   └── server.js                       # Punto de entrada, arranque del servidor
│
├── tests/
│   ├── integration/
│   └── fixtures/
│
├── scripts/
│   └── seed.js                         # Datos iniciales de desarrollo
│
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

### 3.1 Patrón por módulo (backend)

Cada módulo de negocio sigue una arquitectura en capas consistente:

- **routes** — define los endpoints HTTP y aplica middlewares.
- **controller** — recibe el request, llama al service, da forma a la respuesta.
- **service** — contiene la lógica de negocio (cálculos, reglas, validaciones cruzadas).
- **repository** — única capa que conoce Supabase/SQL; aísla el acceso a datos.
- **schema** — esquemas Zod para validar entrada de cada endpoint.

Este patrón permite, por ejemplo, testear `ventas.service.js` (cálculo de totales e impuestos) sin necesidad de levantar la base de datos.

---

## 4. Estructura de Carpetas — Frontend

```
pos-ferreteria-frontend/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── ui/                         # Componentes genéricos reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   └── Badge.jsx
│   │   │
│   │   └── layout/
│   │       ├── AppShell.jsx
│   │       ├── Sidebar.jsx
│   │       └── Topbar.jsx
│   │
│   ├── features/
│   │   ├── productos/
│   │   │   ├── components/
│   │   │   │   ├── ProductoForm.jsx
│   │   │   │   └── ProductoTable.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useProductos.js      # TanStack Query
│   │   │   ├── api/
│   │   │   │   └── productos.api.js     # Llamadas fetch al backend
│   │   │   └── pages/
│   │   │       ├── ProductosListPage.jsx
│   │   │       └── ProductoFormPage.jsx
│   │   │
│   │   ├── ventas/
│   │   │   ├── components/
│   │   │   │   ├── CarritoVenta.jsx
│   │   │   │   ├── BuscadorProducto.jsx
│   │   │   │   ├── PanelDescuento.jsx
│   │   │   │   └── TicketPreview.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useVentas.js
│   │   │   ├── api/
│   │   │   │   └── ventas.api.js
│   │   │   └── pages/
│   │   │       └── PuntoVentaPage.jsx
│   │   │
│   │   ├── inventario/
│   │   │   ├── components/
│   │   │   │   ├── EntradaMercanciaForm.jsx
│   │   │   │   ├── AjusteInventarioForm.jsx
│   │   │   │   └── AlertaStockBajo.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useInventario.js
│   │   │   ├── api/
│   │   │   │   └── inventario.api.js
│   │   │   └── pages/
│   │   │       └── InventarioPage.jsx
│   │   │
│   │   ├── corte-caja/
│   │   │   ├── components/
│   │   │   │   ├── ResumenTurno.jsx
│   │   │   │   └── ConciliacionEfectivo.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useCorteCaja.js
│   │   │   ├── api/
│   │   │   │   └── corteCaja.api.js
│   │   │   └── pages/
│   │   │       └── CorteCajaPage.jsx
│   │   │
│   │   └── auth/
│   │       ├── hooks/
│   │       │   └── useAuth.js
│   │       ├── api/
│   │       │   └── auth.api.js
│   │       └── pages/
│   │           └── LoginPage.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── TurnoContext.jsx            # Turno activo del cajero en sesión
│   │
│   ├── lib/
│   │   ├── supabaseClient.js           # Solo para lecturas no sensibles
│   │   └── httpClient.js               # Instancia axios/fetch hacia el backend
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   └── ProtectedRoute.jsx          # Restringe rutas por rol
│   │
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   └── formatDate.js
│   │
│   ├── styles/
│   │   └── globals.css                 # Directivas Tailwind
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

### 4.1 Patrón por feature (frontend)

Cada carpeta dentro de `features/` es autocontenida: agrupa sus componentes, hooks de datos, llamadas a la API y páginas. Esto facilita ubicar todo lo relacionado a HU-05 (registrar venta) o HU-13 (corte de caja) en una sola carpeta, en lugar de saltar entre directorios por tipo de archivo.

---

## 5. Convenciones de Nombres

### 5.1 Archivos y carpetas

| Tipo | Convención | Ejemplo |
|---|---|---|
| Carpetas | `kebab-case` | `corte-caja/`, `detalle-venta/` |
| Componentes React | `PascalCase.jsx` | `CarritoVenta.jsx`, `ProductoForm.jsx` |
| Hooks | `camelCase` con prefijo `use` | `useVentas.js`, `useCorteCaja.js` |
| Archivos de backend (routes/controller/service) | `camelCase.capa.js` | `ventas.controller.js`, `inventario.service.js` |
| Archivos de configuración | `kebab-case` o estándar de la herramienta | `vite.config.js`, `docker-compose.yml` |
| Archivos de prueba | mismo nombre + `.test.js` | `ventas.service.test.js` |

### 5.2 Variables, funciones y clases (JavaScript)

| Elemento | Convención | Ejemplo |
|---|---|---|
| Variables y funciones | `camelCase` | `calcularTotalVenta()`, `stockActual` |
| Constantes globales | `UPPER_SNAKE_CASE` | `MAX_DESCUENTO_PORCENTAJE`, `IVA_RATE` |
| Clases | `PascalCase` | `FolioGenerator`, `TicketPrinter` |
| Componentes React (función) | `PascalCase` | `function ProductoTable() {}` |
| Hooks personalizados | `camelCase` con prefijo `use` | `useProductos`, `useAuth` |
| Booleanos | prefijo `is`, `has`, `puede` | `isLoading`, `hasDescuento`, `puedeAutorizar` |
| Manejadores de eventos | prefijo `handle` | `handleSubmit`, `handleAgregarProducto` |
| Funciones async que llaman la API | sufijo del recurso + verbo | `fetchProductos`, `crearVenta`, `actualizarPrecio` |

### 5.3 Base de datos (alineado con schema.sql)

| Elemento | Convención | Ejemplo |
|---|---|---|
| Tablas | `snake_case`, plural | `productos`, `detalle_venta`, `cortes_caja` |
| Columnas | `snake_case` | `precio_venta`, `stock_minimo`, `creado_en` |
| Llaves primarias | `id_<entidad>` | `id_producto`, `id_venta` |
| Llaves foráneas | `id_<tabla_referenciada>` | `id_categoria`, `id_usuario` |
| Enums | `snake_case`, descriptivo | `tipo_movimiento`, `estado_venta` |
| Índices | `idx_<tabla>_<columna(s)>` | `idx_productos_categoria` |
| Constraints únicos | `uq_<tabla>_<columna>` | `uq_producto_sku` |
| Constraints de validación | `chk_<tabla>_<regla>` | `chk_venta_total` |

### 5.4 Endpoints de la API REST

Los endpoints siguen convención REST estándar, recursos en plural y en inglés para alinearse con prácticas comunes de API, mientras el dominio de negocio (modelos, UI) se mantiene en español:

| Método | Patrón | Ejemplo |
|---|---|---|
| GET | `/api/v1/<recursos>` | `GET /api/v1/productos` |
| GET | `/api/v1/<recursos>/:id` | `GET /api/v1/productos/42` |
| POST | `/api/v1/<recursos>` | `POST /api/v1/ventas` |
| PATCH | `/api/v1/<recursos>/:id` | `PATCH /api/v1/productos/42` |
| DELETE (baja lógica) | `/api/v1/<recursos>/:id` | `DELETE /api/v1/productos/42` |
| Acciones específicas | `/api/v1/<recurso>/:id/<accion>` | `POST /api/v1/turnos/7/cerrar` |

> **Nota:** se eligió inglés para nombres de endpoints y mayormente para identificadores de código (variables, funciones, tablas técnicas internas) porque es el estándar de facto en convenciones REST y en el ecosistema de librerías usado (Express, Supabase, React). Los textos de UI, mensajes de error y nombres de tablas de negocio permanecen en español, conforme al requerimiento de localización del spec (sección 4.4).

### 5.5 Variables de entorno

| Convención | Ejemplo |
|---|---|
| `UPPER_SNAKE_CASE`, con prefijo de capa cuando aplica | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `MAX_DESCUENTO_SIN_AUTORIZACION` |

### 5.6 Ramas y commits (Git)

| Elemento | Convención | Ejemplo |
|---|---|---|
| Ramas de feature | `feature/<modulo>-<descripcion-corta>` | `feature/ventas-aplicar-descuento` |
| Ramas de bugfix | `fix/<descripcion-corta>` | `fix/corte-caja-diferencia-negativa` |
| Commits | Conventional Commits | `feat(ventas): agregar cálculo de descuento por línea` |

---

## 6. Variables de Entorno (referencia)

**Backend (`.env`)**

```
PORT=4000
NODE_ENV=development
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
MAX_DESCUENTO_SIN_AUTORIZACION=20
UMBRAL_DIFERENCIA_CORTE=50
IVA_RATE=0.16
```

**Frontend (`.env`)**

```
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 7. Próximos Pasos Sugeridos

1. Definir contratos de API (OpenAPI/Swagger) por módulo antes de implementar controllers.
2. Configurar políticas RLS en Supabase alineadas a la tabla de roles del spec (sección 1.3).
3. Implementar primero el módulo `productos` (sin dependencias) y luego `ventas`, que depende de `productos`, `turnos` y `usuarios`.
4. Configurar pipeline de CI con lint + tests antes de habilitar despliegues automáticos.

---

*Fin del documento — Versión 1.0*
