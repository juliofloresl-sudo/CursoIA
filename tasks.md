# Tareas de Implementación — Backend
## Sistema de Punto de Venta — Ferretería

**Versión:** 1.0
**Fecha:** 2026-06-29
**Basado en:** spec.md v1.0, plan.md v1.0

---

## Convenciones de este documento

- Cada tarea es **atómica**: se puede completar, revisar y mergear de forma independiente.
- Cada tarea tiene un **criterio de terminado (DoD)** verificable, no ambiguo.
- El orden refleja dependencias reales; las tareas dentro de una misma fase pueden paralelizarse si no comparten archivos.
- `[BLOQUEA: T-XXX]` indica que la tarea depende de que otra esté terminada.

---

## Fase 0 — Configuración del Proyecto

---

**T-001 — Inicializar repositorio y estructura base de carpetas**

Crear el repositorio `pos-ferreteria-backend` con la estructura de carpetas definida en plan.md sección 3 (`src/config`, `src/modules`, `src/middlewares`, `src/lib`, `src/utils`, `tests/`, `scripts/`).

**Criterio de terminado:**
- La estructura de carpetas existe en el repo, aunque las carpetas estén vacías (con `.gitkeep` si es necesario).
- Existe `package.json` con `"type": "module"` y scripts `dev`, `start`, `test`, `lint`.
- `npm install` corre sin errores.

---

**T-002 — Configurar ESLint y Prettier**

Configurar `.eslintrc.cjs` y `.prettierrc` según convenciones de plan.md (camelCase para JS, etc.).

**Criterio de terminado:**
- `npm run lint` ejecuta sin errores de configuración sobre un archivo de prueba.
- Un archivo con formato incorrecto (indentación, comillas) es detectado por `npm run lint`.
- Existe un `pre-commit hook` (husky o equivalente) opcional documentado en README — no bloqueante para esta tarea.

---

**T-003 — Configurar variables de entorno y carga validada**

Crear `.env.example` con las variables listadas en plan.md sección 6, y `src/config/env.js` que las cargue y valide al arrancar (usando Zod o similar).

**Criterio de terminado:**
- Si falta una variable requerida (`SUPABASE_URL`, `JWT_SECRET`), el servidor falla al arrancar con un mensaje de error explícito indicando cuál variable falta.
- Con todas las variables presentes, `env.js` exporta un objeto tipado/validado sin lanzar error.

---

**T-004 — Configurar cliente de Supabase (admin y anon)**

Crear `src/config/supabase.js` exportando dos clientes: uno con `service_role` (operaciones de backend) y uno `anon` (si se requiere para validar tokens de usuario).

**Criterio de terminado:**
- Una llamada de prueba (`select 1` o `auth.getUser()`) contra el cliente admin retorna respuesta exitosa usando credenciales del proyecto de desarrollo.
- El archivo no expone `service_role` key fuera de este módulo (no se importa en frontend ni se loggea).

---

**T-005 — Levantar esqueleto de Express (`app.js` y `server.js`)**

Crear la app de Express con middlewares globales: `cors`, `express.json()`, `helmet`, logger de requests.

**Criterio de terminado:**
- `npm run dev` levanta el servidor en el puerto definido por `PORT`.
- `GET /health` responde `200` con `{ "status": "ok" }`.
- Una request sin `Content-Type: application/json` a un endpoint POST no rompe el servidor.

---

**T-006 — Configurar Docker y docker-compose para desarrollo**

Crear `Dockerfile` y `docker-compose.yml` que levanten el backend (Supabase se consume como servicio externo, no se dockeriza localmente salvo que se use Supabase CLI).

**Criterio de terminado:**
- `docker compose up` levanta el contenedor del backend y responde en `GET /health`.
- Los cambios en código se reflejan sin reconstruir la imagen (volumen montado + nodemon).

---

**T-007 — Aplicar `schema.sql` a la base de datos de desarrollo**

Ejecutar el script `schema.sql` (ya generado previamente) contra el proyecto Supabase de desarrollo.

**Criterio de terminado:**
- Las 10 tablas (`categorias`, `usuarios`, `productos`, `historial_precios`, `movimientos_inventario`, `turnos`, `ventas`, `detalle_venta`, `descuentos_aplicados`, `cortes_caja`) existen en el esquema `public`.
- Los triggers `trg_producto_precio` y los de `actualizado_en` están activos (verificable con `\d productos` en psql o el panel de Supabase).
- Las vistas `v_stock_bajo` y `v_resumen_turno` retornan resultados sin error sobre datos vacíos.

---

## Fase 1 — Autenticación y Autorización

`[BLOQUEA: T-004, T-005]`

---

**T-008 — Middleware de autenticación (verificación de JWT)**

Crear `src/middlewares/auth.middleware.js` que valide el JWT de Supabase en el header `Authorization: Bearer <token>` y adjunte el usuario decodificado a `req.user`.

**Criterio de terminado:**
- Una request sin token a una ruta protegida responde `401` con mensaje claro.
- Una request con token inválido o expirado responde `401`.
- Una request con token válido permite continuar al siguiente middleware/controller, con `req.user.id` poblado.
- Test unitario cubre los 3 casos anteriores.

---

**T-009 — Middleware de autorización por rol**

Crear `src/middlewares/roles.middleware.js` con una función `requireRole(...roles)` reusable.

**Criterio de terminado:**
- Una request de un usuario con rol `cajero` a una ruta protegida con `requireRole('administrador')` responde `403`.
- Una request de un usuario con rol permitido continúa normalmente.
- Test unitario cubre ambos casos para al menos 2 combinaciones de rol distintas.

---

**T-010 — Endpoint de login y obtención de perfil**

Implementar `POST /api/v1/auth/login` (delega a Supabase Auth) y `GET /api/v1/auth/me` (retorna usuario autenticado con su rol).

**Criterio de terminado:**
- `POST /api/v1/auth/login` con credenciales válidas retorna `200` y un token.
- `POST /api/v1/auth/login` con credenciales inválidas retorna `401` sin filtrar si el usuario existe o no.
- `GET /api/v1/auth/me` con token válido retorna `{ id, nombre, email, rol }`.

---

**T-011 — Middleware de manejo centralizado de errores**

Crear `src/middlewares/errorHandler.middleware.js` que capture errores lanzados en controllers/services y devuelva respuestas JSON consistentes.

**Criterio de terminado:**
- Un error de validación (Zod) capturado por este middleware responde `400` con detalle de campos inválidos.
- Un error no controlado (excepción genérica) responde `500` sin exponer el stack trace en producción (`NODE_ENV=production`).
- En `NODE_ENV=development`, el stack trace sí se incluye en la respuesta para depuración.

---

**T-012 — Middleware de validación con Zod**

Crear `src/middlewares/validate.middleware.js` que reciba un schema Zod y valide `body`, `params` o `query` según se indique.

**Criterio de terminado:**
- Aplicado a una ruta de prueba, un payload inválido responde `400` con el listado de errores de campo.
- Un payload válido pasa al controller sin modificaciones inesperadas.

---

## Fase 2 — Módulo de Productos (HU-01 a HU-04)

`[BLOQUEA: T-008, T-009, T-011, T-012]`

---

**T-013 — Repositorio de categorías (CRUD)**

Implementar `categorias.repository.js` con funciones `crear`, `listar`, `obtenerPorId`, `actualizar`, `desactivar`.

**Criterio de terminado:**
- Cada función ejecuta una query contra Supabase y retorna datos tipados (no el objeto crudo de la librería).
- Test de integración crea una categoría, la lista, y confirma que aparece en el resultado.
- Intentar crear una categoría con nombre duplicado lanza un error identificable (violación de `uq_categoria_nombre`).

---

**T-014 — Endpoints de categorías**

Implementar rutas `GET /api/v1/categorias`, `POST /api/v1/categorias`, `PATCH /api/v1/categorias/:id`.

**Criterio de terminado:**
- `POST` con rol `cajero` responde `403` (solo administrador gestiona categorías).
- `POST` con datos válidos y rol `administrador` responde `201` con la categoría creada.
- `GET` responde `200` con array de categorías activas por defecto.

---

**T-015 — Repositorio de productos (CRUD + búsqueda)**

Implementar `productos.repository.js` con `crear`, `listar` (con filtro por nombre/SKU/categoría), `obtenerPorId`, `obtenerPorSku`, `actualizar`, `desactivar`.

**Criterio de terminado:**
- `obtenerPorSku('XYZ')` retorna `null` (no error) si no existe.
- `listar({ busqueda: 'martillo' })` retorna solo productos cuyo nombre o SKU coincide.
- Test de integración cubre creación exitosa y rechazo por SKU duplicado.

---

**T-016 — Validación de SKU único (HU-01, criterio de error)**

Implementar en `productos.service.js` la verificación explícita de SKU duplicado antes de delegar al repositorio, devolviendo un error de negocio claro.

**Criterio de terminado:**
- `POST /api/v1/productos` con un SKU ya existente responde `409 Conflict` con mensaje `"El SKU ya está registrado"`.
- No se inserta ningún registro duplicado en la base de datos (verificable contando filas antes/después).

---

**T-017 — Endpoint: crear producto (HU-01)**

Implementar `POST /api/v1/productos` con validación Zod (nombre, SKU, categoría, precio venta, precio costo requeridos).

**Criterio de terminado:**
- Request válida con rol `administrador` responde `201`, el producto creado tiene `stock_actual = 0`.
- Request sin `precio_venta` responde `400` con el campo señalado como faltante.
- El producto creado es inmediatamente consultable vía `GET /api/v1/productos/:id`.

---

**T-018 — Endpoint: editar precio de producto con historial (HU-02)**

Implementar `PATCH /api/v1/productos/:id/precio`. El trigger de base de datos ya registra el historial automáticamente (ver T-007); este endpoint solo debe disparar el `UPDATE` correctamente.

**Criterio de terminado:**
- `PATCH` con `precio_venta: 0` o negativo responde `400` con mensaje `"El precio debe ser mayor a cero"`.
- `PATCH` con precio válido responde `200`, y una consulta a `historial_precios` para ese producto muestra una fila nueva con `precio_anterior`, `precio_nuevo` y el usuario que hizo el cambio.

---

**T-019 — Endpoint: desactivar producto (HU-03)**

Implementar `PATCH /api/v1/productos/:id/desactivar`.

**Criterio de terminado:**
- Tras desactivar, `GET /api/v1/productos?busqueda=<nombre>` (endpoint usado por ventas) ya no incluye el producto.
- `GET /api/v1/productos?incluirInactivos=true` sí lo incluye, con `activo: false`.
- El producto sigue siendo consultable por `GET /api/v1/productos/:id` directamente (no se borra el registro).

---

**T-020 — Endpoints de gestión de categorías en productos (HU-04)**

Confirmar que `productos` soporta filtrado por `id_categoria` y que el endpoint de categorías está disponible como filtro.

**Criterio de terminado:**
- `GET /api/v1/productos?categoria=<id>` retorna únicamente productos de esa categoría.
- Categoría sin productos asociados retorna array vacío, no error.

---

**T-021 — Tests de integración del módulo productos**

Cubrir con Supertest los flujos completos de HU-01 a HU-04 contra una base de datos de pruebas (o esquema aislado).

**Criterio de terminado:**
- `npm run test -- productos` pasa sin fallos.
- Cobertura de los archivos `productos.service.js` y `productos.controller.js` ≥ 80% (verificable con reporte de cobertura).

---

## Fase 3 — Módulo de Turnos (prerrequisito de Ventas y Corte de Caja)

`[BLOQUEA: T-008, T-009]`

---

**T-022 — Repositorio y service de turnos**

Implementar `turnos.repository.js` y `turnos.service.js` con `abrirTurno(idCajero, fondoInicial)` y `obtenerTurnoActivo(idCajero)`.

**Criterio de terminado:**
- `abrirTurno` falla si el cajero ya tiene un turno con `estado = 'abierto'` (no se permiten dos turnos simultáneos).
- `obtenerTurnoActivo` retorna `null` si no hay turno abierto para ese cajero.

---

**T-023 — Endpoint: abrir turno (HU-15)**

Implementar `POST /api/v1/turnos`.

**Criterio de terminado:**
- Request con `fondo_inicial` negativo responde `400`.
- Request válida responde `201` con el turno en estado `abierto`.
- Un segundo intento de abrir turno para el mismo cajero sin cerrar el anterior responde `409`.

---

**T-024 — Endpoint: consultar turno activo del cajero autenticado**

Implementar `GET /api/v1/turnos/activo`.

**Criterio de terminado:**
- Si el cajero autenticado tiene turno abierto, responde `200` con sus datos.
- Si no tiene turno abierto, responde `404` con mensaje claro (usado por el frontend para forzar apertura de turno antes de vender).

---

## Fase 4 — Módulo de Ventas (HU-05 a HU-08)

`[BLOQUEA: T-015, T-022]`

---

**T-025 — Generador de folios consecutivos**

Implementar `src/lib/folio/folioGenerator.js` que genere folios tipo `VTA-0000001` sin colisiones bajo escritura concurrente.

**Criterio de terminado:**
- Generar 100 folios en paralelo (test de concurrencia) no produce duplicados.
- El formato del folio coincide exactamente con `VTA-XXXXXXX` (7 dígitos con padding de ceros).

---

**T-026 — Service: cálculo de totales de venta**

Implementar en `ventas.service.js` la función `calcularTotales(lineas, impuestoRate)` que calcule subtotal, impuesto y total por línea y globales.

**Criterio de terminado:**
- Test unitario con 3 líneas de distintos productos y cantidades produce el total esperado calculado a mano.
- El redondeo de centavos sigue la misma regla en todos los cálculos (verificado con un caso de prueba con decimales como `$19.99 × 3`).

---

**T-027 — Validación de stock antes de agregar línea de venta (HU-05, criterio de error)**

Implementar verificación de `stock_actual > 0` (y `>= cantidad solicitada`) antes de permitir la venta.

**Criterio de terminado:**
- Intentar vender un producto con `stock_actual = 0` responde `409` con mensaje `"Producto sin existencia"`.
- Intentar vender una cantidad mayor al stock disponible responde `409` indicando el stock disponible.

---

**T-028 — Endpoint: registrar venta completa (HU-05)**

Implementar `POST /api/v1/ventas` que: valide stock de cada línea, calcule totales, genere folio, inserte `ventas` + `detalle_venta` en una transacción, y descuente inventario registrando el movimiento correspondiente en `movimientos_inventario`.

**Criterio de terminado:**
- Una venta exitosa responde `201` con folio, total y detalle.
- El `stock_actual` de cada producto vendido disminuye exactamente en la cantidad vendida (verificable consultando `productos` después).
- Se crea una fila en `movimientos_inventario` con `tipo_movimiento = 'salida_venta'` por cada producto vendido.
- Si cualquier línea falla validación de stock, **ninguna** línea se inserta (atomicidad transaccional verificable: el conteo de filas en `ventas` no cambia).
- La venta solo se permite si el cajero tiene un turno `abierto` (de lo contrario responde `409`).

---

**T-029 — Service: validación y aplicación de descuento (HU-06)**

Implementar lógica de descuento porcentual o fijo, con verificación de límite máximo configurado (`MAX_DESCUENTO_SIN_AUTORIZACION`).

**Criterio de terminado:**
- Descuento dentro del límite se aplica sin requerir campo de autorización adicional.
- Descuento que excede el límite responde `403` si no se incluye `id_autorizo` de un usuario con rol `supervisor` o `administrador` válido.
- Con autorización válida, se inserta una fila en `descuentos_aplicados` referenciando al autorizador.

---

**T-030 — Endpoint: aplicar descuento a venta (HU-06)**

Implementar `POST /api/v1/ventas/:id/descuento` (o integrarlo al payload de `POST /ventas`, según diseño final del equipo).

**Criterio de terminado:**
- El ticket resultante (respuesta del endpoint) incluye precio original, monto de descuento y precio final por línea o total, según corresponda.
- Test cubre el caso límite exacto (descuento = límite permitido, debe pasar sin autorización) y límite + 1 (debe requerir autorización).

---

**T-031 — Service: procesar devolución (HU-07)**

Implementar `devoluciones.service.js`: localizar venta original por folio, validar antigüedad (≤ 30 días), crear venta de tipo devolución referenciando la original, reintegrar stock.

**Criterio de terminado:**
- Devolución de una venta con más de 30 días de antigüedad responde `409` con mensaje claro.
- Devolución exitosa crea una fila en `ventas` con `es_devolucion = true` e `id_venta_origen` apuntando a la venta original.
- El `stock_actual` de los productos devueltos se incrementa en la cantidad devuelta.
- Se registra un movimiento `tipo_movimiento = 'devolucion'` en `movimientos_inventario`.

---

**T-032 — Endpoint: registrar devolución (HU-07)**

Implementar `POST /api/v1/devoluciones`.

**Criterio de terminado:**
- Devolución parcial (menos productos que la venta original) es aceptada y solo afecta las líneas indicadas.
- Devolución sin autorización de supervisor (`id_autorizo` ausente o rol inválido) responde `403`.
- Devolución exitosa responde `201` con el folio de la nota de crédito generada.

---

**T-033 — Endpoint: reimprimir ticket (HU-08)**

Implementar `GET /api/v1/ventas/:id/ticket` que retorne el payload necesario para reimpresión (no modifica datos).

**Criterio de terminado:**
- La respuesta incluye un indicador `reimpresion: true` quemado en el payload o metadata, sin alterar la venta original en base de datos.
- Buscar la venta por folio inexistente responde `404`.

---

**T-034 — Tests de integración del módulo ventas**

Cubrir HU-05 a HU-08 con Supertest, incluyendo casos de error de cada criterio de aceptación del spec.

**Criterio de terminado:**
- `npm run test -- ventas` pasa sin fallos.
- Existe al menos un test por cada bloque Given/When/Then de HU-05 a HU-08 en spec.md (8 escenarios mínimo).

---

## Fase 5 — Módulo de Inventario (HU-09 a HU-12)

`[BLOQUEA: T-015]`

---

**T-035 — Endpoint: registrar entrada de mercancía (HU-09)**

Implementar `POST /api/v1/inventario/entradas`.

**Criterio de terminado:**
- `stock_actual` del producto se incrementa exactamente en la cantidad recibida.
- Se crea movimiento `tipo_movimiento = 'entrada'` con `referencia` igual al número de factura del proveedor capturado.
- Entrada con cantidad negativa o cero responde `400`.

---

**T-036 — Endpoint: registrar ajuste de inventario (HU-10)**

Implementar `POST /api/v1/inventario/ajustes` aceptando motivo (`merma`, `extravio`, `error_conteo`, `muestra`).

**Criterio de terminado:**
- Ajuste sin `motivo` válido (fuera del enum permitido) responde `400`.
- El movimiento generado tiene el `tipo_movimiento` correspondiente y el usuario autenticado queda registrado.
- `stock_actual` nunca queda en negativo: un ajuste que lo provocaría responde `409`.

---

**T-037 — Endpoint: consultar productos con stock bajo (HU-11)**

Implementar `GET /api/v1/inventario/stock-bajo` consumiendo la vista `v_stock_bajo`.

**Criterio de terminado:**
- Un producto con `stock_actual <= stock_minimo` aparece en la respuesta.
- Un producto con stock por encima del mínimo no aparece.
- La respuesta incluye `unidades_faltantes` calculado correctamente.

---

**T-038 — Service: iniciar y registrar conteo físico (HU-12)**

Implementar tabla/lógica de conteo físico (sesión de conteo con líneas capturadas) y comparación contra `stock_actual` del sistema.

**Criterio de terminado:**
- Al finalizar un conteo, el sistema devuelve, por producto, la diferencia (`cantidad_fisica - stock_actual`).
- Aprobar un ajuste automático desde el conteo genera un movimiento `tipo_movimiento = 'ajuste_conteo'` y actualiza el stock.
- Rechazar una línea individual del conteo no afecta el stock de ese producto.

---

**T-039 — Endpoint: generar reporte PDF de conteo físico (HU-12)**

Implementar `GET /api/v1/inventario/conteos/:id/reporte`.

**Criterio de terminado:**
- La respuesta es un archivo PDF válido (verificable abriendo el binario con una librería de validación de PDF o confirmando el header `%PDF-`).
- El PDF incluye todos los productos contados con su diferencia, fecha y usuario responsable.

---

**T-040 — Tests de integración del módulo inventario**

Cubrir HU-09 a HU-12 con Supertest.

**Criterio de terminado:**
- `npm run test -- inventario` pasa sin fallos.
- Test específico verifica que un movimiento de salida (venta) dispara correctamente la alerta de `v_stock_bajo` cuando cruza el umbral.

---

## Fase 6 — Módulo de Corte de Caja (HU-13 a HU-15)

`[BLOQUEA: T-022, T-028]`

---

**T-041 — Service: cálculo de resumen de turno**

Implementar `cortesCaja.service.js` → `calcularResumenTurno(idTurno)`, reutilizando o adaptando la vista `v_resumen_turno`.

**Criterio de terminado:**
- Para un turno con ventas conocidas (fixture de prueba), el resumen calculado coincide exactamente con la suma esperada por método de pago.
- Un turno sin ventas retorna totales en cero, no error ni `null`.

---

**T-042 — Service: cálculo de diferencia de corte**

Implementar la lógica `efectivo_contado - efectivo_esperado`, donde `efectivo_esperado = fondo_inicial + ventas_efectivo`.

**Criterio de terminado:**
- Test unitario con fondo inicial $500, ventas en efectivo $1,200 y conteo físico $1,690 produce diferencia de `-$10` (faltante).
- Test unitario con conteo exacto produce diferencia `$0`.

---

**T-043 — Endpoint: realizar corte de caja (HU-13)**

Implementar `POST /api/v1/turnos/:id/corte`.

**Criterio de terminado:**
- Confirmar el corte cambia el `estado` del turno a `cerrado` y registra `cierre = NOW()`.
- Tras el corte, intentar `POST /api/v1/ventas` con ese turno responde `409` (turno cerrado, no se permiten más ventas).
- Si `|diferencia| > UMBRAL_DIFERENCIA_CORTE` y no se envía `justificacion`, la request responde `400` exigiéndola.
- Corte exitoso responde `201` con el resumen completo (ventas por método de pago, diferencia, transacciones).
- Un segundo intento de corte sobre el mismo turno responde `409` (ya existe corte, por `uq_corte_turno`).

---

**T-044 — Endpoint: consultar historial de cortes (HU-14)**

Implementar `GET /api/v1/cortes-caja` con filtros `fechaInicio`, `fechaFin`, `idCajero`.

**Criterio de terminado:**
- Filtrar por rango de fechas retorna únicamente cortes dentro de ese rango.
- Filtrar por `idCajero` retorna únicamente cortes de turnos de ese cajero.
- Solo accesible para roles `administrador` y `supervisor` (cajero responde `403`).

---

**T-045 — Endpoint: detalle de un corte específico (HU-14)**

Implementar `GET /api/v1/cortes-caja/:id`.

**Criterio de terminado:**
- Responde `200` con el detalle completo incluyendo `justificacion` si existe.
- Responde `404` para un `id` inexistente.

---

**T-046 — Generación de PDF de corte de caja (HU-13, criterio de exportación)**

Implementar `GET /api/v1/cortes-caja/:id/reporte`.

**Criterio de terminado:**
- El archivo retornado es un PDF válido con el resumen de ventas por método de pago, diferencia, y datos del supervisor.
- El nombre de archivo sugerido sigue convención `corte-<id_turno>-<fecha>.pdf`.

---

**T-047 — Tests de integración del módulo corte de caja**

Cubrir HU-13 a HU-15 con Supertest, incluyendo el flujo completo: abrir turno → vender → cerrar turno → corte → consulta de historial.

**Criterio de terminado:**
- `npm run test -- cortes-caja` pasa sin fallos.
- Existe un test end-to-end que recorre el flujo completo descrito arriba y verifica consistencia de los totales en cada paso.

---

## Fase 7 — Auditoría, Seguridad y Hardening

`[BLOQUEA: T-028, T-036, T-043]`

---

**T-048 — Middleware de auditoría para acciones críticas**

Implementar `auditLog.middleware.js` que registre en log estructurado (o tabla dedicada) cada acción de: aplicar descuento, procesar devolución, ajustar inventario, realizar corte de caja.

**Criterio de terminado:**
- Cada una de las 4 acciones genera una entrada de log/auditoría con `usuario`, `accion`, `timestamp`, `payload relevante`.
- El log es consultable (vía archivo o tabla) sin necesidad de reproducir la acción.

---

**T-049 — Expiración de sesión por inactividad**

Configurar expiración de JWT/sesión a 30 minutos según spec.md sección 3.3.

**Criterio de terminado:**
- Un token con más de 30 minutos de antigüedad es rechazado por `auth.middleware.js` con `401`.
- Test unitario simula un token expirado (timestamp manipulado) y confirma el rechazo.

---

**T-050 — Hash de contraseñas con bcrypt (salt factor ≥ 12)**

Verificar que la creación de usuarios (vía Supabase Auth o tabla `usuarios`) use bcrypt con el salt factor mínimo requerido.

**Criterio de terminado:**
- Crear un usuario de prueba y confirmar que `password_hash` almacenado tiene el prefijo `$2a$12$` o superior.
- Ningún endpoint retorna `password_hash` en sus respuestas JSON (verificable inspeccionando todas las respuestas de `usuarios.controller.js`).

---

**T-051 — Restricción de acceso por rol en todos los endpoints sensibles**

Auditoría cruzada: confirmar que cada endpoint de configuración de productos, precios, descuentos fuera de límite, ajustes de inventario y cortes de caja tiene `requireRole(...)` aplicado.

**Criterio de terminado:**
- Checklist manual (documentada en este mismo PR) que enumera cada endpoint sensible y el rol mínimo requerido, contrastado contra la tabla de roles de spec.md sección 1.3.
- Test automatizado que recorre la lista de endpoints sensibles y confirma `403` para un rol `cajero` en cada uno.

---

**T-052 — Rate limiting básico en endpoints de autenticación**

Implementar `express-rate-limit` (o similar) en `POST /api/v1/auth/login`.

**Criterio de terminado:**
- Más de N intentos fallidos (configurable, ej. 5 en 1 minuto) desde la misma IP responde `429`.
- Un login exitoso no cuenta hacia el límite de forma permanente (el contador se resetea o no penaliza éxito).

---

## Fase 8 — Reportes y Exportación

`[BLOQUEA: T-044, T-046]`

---

**T-053 — Endpoint: exportar ventas a CSV**

Implementar `GET /api/v1/reportes/ventas?formato=csv` con filtros por rango de fechas.

**Criterio de terminado:**
- El archivo CSV generado abre correctamente en una herramienta de hojas de cálculo sin errores de formato.
- Las columnas incluyen al menos: folio, fecha, cajero, total, método de pago.

---

**T-054 — Endpoint: exportar movimientos de inventario a CSV**

Implementar `GET /api/v1/reportes/inventario?formato=csv`.

**Criterio de terminado:**
- El CSV incluye producto, tipo de movimiento, cantidad, usuario y fecha por cada fila.
- Filtrar por rango de fechas excluye correctamente movimientos fuera del rango.

---

## Fase 9 — Documentación y Cierre

---

**T-055 — Documentar API con OpenAPI/Swagger**

Generar especificación OpenAPI (manual o con `swagger-jsdoc`) cubriendo todos los endpoints implementados.

**Criterio de terminado:**
- El archivo `openapi.yaml` (o JSON) es válido (verificable con un linter de OpenAPI).
- Accesible vía `GET /api/v1/docs` en ambiente de desarrollo (Swagger UI o equivalente).
- Cada endpoint documentado incluye al menos un ejemplo de request y de response de error.

---

**T-056 — README del backend con instrucciones de arranque**

Escribir `README.md` con pasos de instalación, variables de entorno requeridas, comandos de desarrollo y testing.

**Criterio de terminado:**
- Un desarrollador nuevo, siguiendo únicamente el README, logra levantar el backend localmente y obtener `200` en `GET /health` sin asistencia adicional.

---

**T-057 — Script de seed para entorno de desarrollo**

Completar `scripts/seed.js` con datos de prueba: usuarios de cada rol, productos de ejemplo, una venta completa y un corte de caja cerrado.

**Criterio de terminado:**
- `node scripts/seed.js` corre sin errores contra una base de datos limpia.
- Tras ejecutarlo, es posible hacer login con al menos un usuario de cada rol (`administrador`, `supervisor`, `cajero`, `encargado_inventario`) usando credenciales documentadas en el script.

---

**T-058 — Pipeline de CI (lint + test) en cada Pull Request**

Configurar GitHub Actions (o equivalente) para ejecutar `npm run lint` y `npm run test` en cada PR.

**Criterio de terminado:**
- Un PR con un error de lint falla el check de CI y bloquea el merge (si la rama está protegida).
- Un PR con un test roto falla el check de CI.
- Un PR limpio pasa ambos checks en menos de 5 minutos.

---

## Resumen de Trazabilidad (Tareas → Historias de Usuario)

| Historia de Usuario | Tareas relacionadas |
|---|---|
| HU-01 Registrar producto | T-015, T-016, T-017 |
| HU-02 Editar precio | T-018 |
| HU-03 Desactivar producto | T-019 |
| HU-04 Gestionar categorías | T-013, T-014, T-020 |
| HU-05 Registrar venta | T-025, T-026, T-027, T-028 |
| HU-06 Aplicar descuento | T-029, T-030 |
| HU-07 Procesar devolución | T-031, T-032 |
| HU-08 Reimprimir ticket | T-033 |
| HU-09 Entrada de mercancía | T-035 |
| HU-10 Ajuste de inventario | T-036 |
| HU-11 Alerta de stock mínimo | T-037 |
| HU-12 Conteo físico | T-038, T-039 |
| HU-13 Corte de caja | T-041, T-042, T-043, T-046 |
| HU-14 Historial de cortes | T-044, T-045 |
| HU-15 Fondo de caja inicial | T-022, T-023, T-024 |

---

*Fin del documento — Versión 1.0*
