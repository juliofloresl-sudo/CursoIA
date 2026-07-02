# tasks-frontend.md

## 📌 Resumen de Convenciones Aplicadas (skill-ith-backend)

* **Archivos:** Minúsculas, inglés, separados por guiones (ej. `product-form.jsx`, `use-products.js`).
* **Variables y Funciones:** Inglés, `camelCase` (ej. `productList`, `handleCheckout`).
* **Comentarios:** Estrictamente en español dentro del código fuente.
* **Estructura:** Modular por características (`features/`).

---

## Módulo 1: Autenticación y Estructura Base (Layout)

### Tarea 1.1: Pantalla de Login (`login-page.jsx`)

* **Descripción:** Interfaz limpia con formulario centralizado para ingreso de credenciales de usuario (Cajero, Administrador, Supervisor, Encargado). Consume el endpoint de autenticación.
* **Archivo:** `src/features/auth/pages/login-page.jsx`
* **Criterio de Verificación Visual:**
* **Given:** El usuario no ha iniciado sesión y navega a la raíz de la aplicación.
* **When:** Ingresa un usuario inexistente y hace clic en el botón de ingresar.
* **Then:** El sistema muestra un mensaje de alerta rojo que dice `"Error: Credenciales inválidas"`.



### Tarea 1.2: Barra Lateral de Navegación Dinámica (`sidebar.jsx`)

* **Descripción:** Menú de navegación lateral que renderiza las opciones disponibles basándose estrictamente en el rol del usuario autenticado (RLS/Token JWT).
* **Archivo:** `src/components/layout/sidebar.jsx`
* **Criterio de Verificación Visual:**
* **Given:** Un usuario ha iniciado sesión con el rol de `Cajero`.
* **When:** Se renderiza el panel principal (`AppShell`).
* **Then:** La barra lateral muestra únicamente los accesos a "Punto de Venta" y "Reimpresión de Tickets", ocultando las secciones de "Inventario" y "Configuración".



---

## Módulo 2: Administración de Catálogo (Productos y Categorías)

### Tarea 2.1: Lista de Productos con Filtros (`product-list-page.jsx`)

* **Descripción:** Tabla interactiva que muestra el catálogo general de productos, con soporte para búsquedas por SKU, nombre y filtros por categoría (HU-01, HU-03).
* **Archivo:** `src/features/products/pages/product-list-page.jsx`
* **Criterio de Verificación Visual:**
* **Given:** El administrador se encuentra en la pantalla de catálogo de productos.
* **When:** Escribe un SKU existente en la barra de búsqueda rápida.
* **Then:** La tabla se filtra instantáneamente mostrando únicamente la fila del producto coincidente en menos de 2 segundos.



### Tarea 2.2: Formulario de Registro y Edición de Producto (`product-form.jsx`)

* **Descripción:** Formulario para altas de nuevos insumos y edición de precios de costo/venta. Incluye validaciones del lado del cliente mediante esquemas Zod (HU-01, HU-02).
* **Archivo:** `src/features/products/components/product-form.jsx`
* **Criterio de Verificación Visual:**
* **Given:** El administrador está editando el precio de un artículo.
* **When:** Modifica el campo `precio de venta` colocándolo en `-10.00` u `0` y presiona guardar.
* **Then:** El input se tiñe de rojo y despliega el texto de error `"El precio debe ser mayor a cero"`.



---

## Módulo 3: Punto de Venta (Ventas y Devoluciones)

### Tarea 3.1: Terminal POS - Buscador e Inserción al Carrito (`pos-terminal-page.jsx`)

* **Descripción:** Pantalla principal de caja optimizada para operar sin ratón. Permite buscar por SKU/código de barras mediante input enfocado automáticamente e ir acumulando artículos en caliente (HU-05).
* **Archivo:** `src/features/sales/pages/pos-terminal-page.jsx`
* **Criterio de Verificación Visual:**
* **Given:** El lector de código de barras escanea un SKU cuyo stock en el backend/sistema es `0`.
* **When:** Se dispara el evento de inserción automática al carrito.
* **Then:** Aparece un aviso flotante tipo Toast de color amarillo con el texto `"Producto sin existencia"` y el carrito permanece intacto.



### Tarea 3.2: Modal de Descuento Autorizado (`discount-modal.jsx`)

* **Descripción:** Ventana emergente que interrumpe el flujo actual para solicitar el PIN confidencial del Supervisor si se desea aplicar una rebaja porcentual sobre el ticket (HU-06).
* **Archivo:** `src/features/sales/components/discount-modal.jsx`
* **Criterio de Verificación Visual:**
* **Given:** El cajero presiona el botón para aplicar un `15%` de descuento.
* **When:** El supervisor introduce un PIN válido en el formulario de confirmación.
* **Then:** El modal se cierra, y el bloque de totales del carrito recalculados muestra de forma explícita el descuento aplicado y el nuevo neto a pagar.



### Tarea 3.3: Módulo de Devoluciones y Notas de Crédito (`return-manager.jsx`)

* **Descripción:** Interfaz para buscar folios de venta históricos (máximo 30 días) y seleccionar qué piezas específicas se reintegrarán al stock físico (HU-07).
* **Archivo:** `src/features/sales/components/return-manager.jsx`
* **Criterio de Verificación Visual:**
* **Given:** El cajero visualiza el detalle de una venta efectuada hace 5 días.
* **When:** Selecciona 2 unidades de un artículo y pulsa el botón "Procesar Devolución".
* **Then:** Se despliega en pantalla una previsualización de la Nota de Crédito generada con su respectivo folio consecutivo y estatus aprobado.



---

## Módulo 4: Control de Inventarios y Almacén

### Tarea 4.1: Registro de Entrada de Mercancía (`stock-entry-form.jsx`)

* **Descripción:** Formulario para abastecimiento de inventario que exige asociar las cantidades al número de factura del proveedor externo (HU-09).
* **Archivo:** `src/features/inventory/components/stock-entry-form.jsx`
* **Criterio de Verificación Visual:**
* **Given:** El encargado está en la pestaña de carga de existencias.
* **When:** Completa las cantidades recibidas, digita la factura del proveedor y confirma el envío del formulario.
* **Then:** Se muestra un banner verde indicando `"Movimiento de inventario registrado con éxito"` y los campos se limpian para una nueva captura.



### Tarea 4.2: Panel de Alertas de Stock Mínimo (`low-stock-alert.jsx`)

* **Descripción:** Widget crítico en el Dashboard del administrador que se suscribe en tiempo real a cambios en Supabase para listar productos por debajo de su umbral (HU-11).
* **Archivo:** `src/features/inventory/components/low-stock-alert.jsx`
* **Criterio de Verificación Visual:**
* **Given:** Un artículo se queda con 2 unidades (siendo su stock mínimo configurado de 5).
* **When:** Se efectúa la venta que causa esta baja de inventario.
* **Then:** El elemento aparece inmediatamente en la lista del panel con un indicador visual (Badge) intermitente que lee `"Stock bajo"`.



### Tarea 4.3: Conteo Físico y Conciliación (`physical-count-page.jsx`)

* **Descripción:** Interfaz de auditoría de pasillos donde el supervisor vacía las unidades contadas a mano contra el reporte del sistema (HU-12).
* **Archivo:** `src/features/inventory/pages/physical-count-page.jsx`
* **Criterio de Verificación Visual:**
* **Given:** El supervisor finaliza la captura de datos en la tabla de auditoría.
* **When:** El sistema calcula las discrepancias del inventario real contra el teórico.
* **Then:** Las celdas con diferencias negativas se formatean en color rojo, y se habilita el botón para exportar el reporte directamente a formato PDF.



---

## Módulo 5: Gestión de Turnos y Cortes de Caja

### Tarea 5.1: Apertura de Turno - Fondo de Caja (`cash-opening-modal.jsx`)

* **Descripción:** Bloqueo de seguridad que impide la venta en la caja registradora hasta que un supervisor declare formalmente el efectivo inicial de operaciones (HU-15).
* **Archivo:** `src/features/cash-control/components/cash-opening-modal.jsx`
* **Criterio de Verificación Visual:**
* **Given:** Un cajero inicia sesión por primera vez en el día con la caja vacía.
* **When:** Intenta ingresar al módulo Punto de Venta sin un turno activo.
* **Then:** Se despliega de manera forzada un modal solicitando el ingreso del `"Monto de fondo de caja inicial ($MXN)"`.



### Tarea 5.2: Cierre de Turno y Arqueo (`cash-closing-page.jsx`)

* **Descripción:** Pantalla de conciliación de fin de jornada laboral donde se compara lo recopilado físicamente en la gaveta contra el reporte del sistema (HU-13).
* **Archivo:** `src/features/cash-control/pages/cash-closing-page.jsx`
* **Criterio de Verificación Visual:**
* **Given:** El conteo físico ingresado arroja un faltante mayor al límite permitido configurado en el archivo `.env`.
* **When:** El supervisor presiona el botón "Confirmar corte de caja".
* **Then:** El sistema bloquea el envío y muestra un cuadro de texto obligatorio con la leyenda `"Por favor, ingrese una nota de justificación para la diferencia detectada"`.