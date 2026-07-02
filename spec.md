# Especificación de Requerimientos de Software
## Sistema de Punto de Venta — Ferretería

**Versión:** 1.0  
**Fecha:** 2026-06-29  
**Estado:** Borrador  
**Autor:** Análisis de Requerimientos

---

## 1. Visión General del Sistema

### 1.1 Propósito

El sistema de Punto de Venta (POS) para ferretería tiene como objetivo digitalizar y centralizar las operaciones de venta, control de inventario, administración de productos y cierre de caja, reemplazando procesos manuales propensos a errores y brindando visibilidad en tiempo real del negocio.

### 1.2 Alcance

El sistema abarca cuatro módulos principales:

- **Módulo de Productos:** catálogo, precios y categorías.
- **Módulo de Ventas:** registro de transacciones en caja, aplicación de descuentos y generación de tickets.
- **Módulo de Inventario:** control de existencias, alertas de stock mínimo y movimientos.
- **Módulo de Corte de Caja:** cierre de turno, conciliación de efectivo y reportes de cierre.

### 1.3 Usuarios del Sistema

| Rol | Responsabilidad |
|---|---|
| Cajero | Registra ventas, aplica descuentos, maneja cobros |
| Encargado de Inventario | Gestiona entradas/salidas de mercancía |
| Administrador | Configura productos, precios, usuarios y genera reportes |
| Supervisor | Realiza cortes de caja y consulta reportes gerenciales |

---

## 2. Historias de Usuario

### 2.1 Módulo de Productos

---

**HU-01 — Registrar nuevo producto**

> Como **administrador**, quiero registrar un nuevo producto en el catálogo para que esté disponible para su venta e inventario.

**Criterios de aceptación:**

```
Dado que el administrador está en el formulario de nuevo producto
  Y ha ingresado nombre, SKU único, categoría, precio de venta y precio de costo
Cuando hace clic en "Guardar producto"
Entonces el producto aparece en el catálogo activo
  Y se puede consultar por nombre, SKU o categoría
  Y el stock inicial queda registrado como 0 unidades.
```

```
Dado que el administrador intenta guardar un producto con un SKU ya existente
Cuando hace clic en "Guardar producto"
Entonces el sistema muestra el error "El SKU ya está registrado"
  Y no se duplica el producto.
```

---

**HU-02 — Editar precio de un producto**

> Como **administrador**, quiero actualizar el precio de venta de un producto para reflejar cambios en el mercado o en costos.

**Criterios de aceptación:**

```
Dado que el administrador localiza un producto en el catálogo
  Y modifica su precio de venta a un valor mayor a $0
Cuando guarda los cambios
Entonces el nuevo precio se refleja inmediatamente en el punto de venta
  Y queda registrado en el historial de cambios de precio con fecha, hora y usuario.
```

```
Dado que el administrador intenta guardar un precio de $0 o negativo
Cuando hace clic en "Guardar"
Entonces el sistema muestra el error "El precio debe ser mayor a cero"
  Y no se aplica el cambio.
```

---

**HU-03 — Desactivar un producto**

> Como **administrador**, quiero desactivar un producto sin eliminarlo para que no aparezca en ventas pero conserve su historial.

**Criterios de aceptación:**

```
Dado que el administrador selecciona un producto activo
Cuando cambia su estado a "Inactivo" y confirma
Entonces el producto deja de aparecer en búsquedas del módulo de ventas
  Y sigue visible en reportes históricos y en el listado de productos inactivos.
```

---

**HU-04 — Gestionar categorías de productos**

> Como **administrador**, quiero agrupar productos por categorías (p. ej. Herramientas, Electricidad, Plomería) para facilitar búsquedas y reportes.

**Criterios de aceptación:**

```
Dado que el administrador crea una nueva categoría con nombre único
Cuando la guarda
Entonces puede asignarse a productos nuevos o existentes
  Y aparece como filtro en el catálogo y en reportes de ventas.
```

---

### 2.2 Módulo de Ventas

---

**HU-05 — Registrar una venta**

> Como **cajero**, quiero registrar los productos que compra un cliente para generar el cobro y el ticket correspondiente.

**Criterios de aceptación:**

```
Dado que el cajero busca un producto por nombre o SKU
  Y lo agrega al carrito con la cantidad requerida
Cuando confirma la venta y selecciona el método de pago (efectivo, tarjeta)
Entonces el sistema calcula el total con impuestos aplicables
  Y descuenta las unidades vendidas del inventario en tiempo real
  Y genera un ticket con folio consecutivo, detalle de productos, subtotal, impuesto y total.
```

```
Dado que el cajero intenta agregar un producto al carrito
  Y el producto tiene stock 0
Cuando intenta agregarlo
Entonces el sistema muestra la advertencia "Producto sin existencia"
  Y no permite continuar con esa línea de venta.
```

---

**HU-06 — Aplicar descuento a una venta**

> Como **cajero**, quiero aplicar un descuento porcentual o en monto fijo a una venta o a una línea específica, previa autorización del supervisor.

**Criterios de aceptación:**

```
Dado que el cajero solicita un descuento en la venta actual
  Y el supervisor ingresa su PIN de autorización
  Y el porcentaje de descuento está entre 1% y el máximo configurado (p. ej. 20%)
Cuando se confirma el descuento
Entonces el precio de la línea o del total se recalcula con el descuento aplicado
  Y el ticket impreso refleja el precio original, el descuento y el precio final.
```

```
Dado que el cajero intenta aplicar un descuento mayor al máximo permitido
Cuando ingresa el porcentaje
Entonces el sistema muestra "Descuento fuera del límite permitido"
  Y requiere autorización de administrador para continuar.
```

---

**HU-07 — Procesar devolución**

> Como **cajero**, quiero registrar la devolución total o parcial de una venta para reembolsar al cliente y reintegrar el inventario.

**Criterios de aceptación:**

```
Dado que el cajero localiza una venta por folio dentro de los últimos 30 días
  Y selecciona los productos a devolver con su cantidad
Cuando confirma la devolución con autorización del supervisor
Entonces se genera una nota de crédito con folio propio referenciando la venta original
  Y las unidades devueltas se reintegran al inventario
  Y el método de reembolso queda registrado.
```

---

**HU-08 — Reimprimir ticket de venta**

> Como **cajero**, quiero reimprimir el ticket de una venta ya registrada en caso de que el cliente lo solicite.

**Criterios de aceptación:**

```
Dado que el cajero busca una venta por folio o fecha
Cuando selecciona "Reimprimir ticket"
Entonces se genera el mismo ticket con la leyenda "REIMPRESIÓN" visible
  Y no se modifica ningún dato de la venta original.
```

---

### 2.3 Módulo de Inventario

---

**HU-09 — Registrar entrada de mercancía**

> Como **encargado de inventario**, quiero registrar la entrada de productos al almacén para que el stock se actualice correctamente.

**Criterios de aceptación:**

```
Dado que el encargado selecciona uno o varios productos
  Y captura la cantidad recibida y el número de factura del proveedor
Cuando confirma la entrada
Entonces el stock de cada producto se incrementa con las unidades recibidas
  Y se registra el movimiento con fecha, hora, usuario y referencia del proveedor
  Y el historial de entradas queda disponible para auditoría.
```

---

**HU-10 — Registrar salida o ajuste de inventario**

> Como **encargado de inventario**, quiero registrar mermas, extravíos o ajustes manuales para mantener el inventario exacto.

**Criterios de aceptación:**

```
Dado que el encargado selecciona un producto y captura una cantidad de ajuste con motivo
  (Merma, Extravío, Error de conteo, Muestra)
Cuando confirma el ajuste con su usuario y contraseña
Entonces el stock se actualiza con la cantidad ajustada
  Y el movimiento queda registrado con tipo "Ajuste", cantidad, motivo y usuario responsable.
```

---

**HU-11 — Recibir alerta de stock mínimo**

> Como **administrador**, quiero recibir alertas cuando el stock de un producto caiga por debajo del mínimo configurado para gestionar reabastecimiento a tiempo.

**Criterios de aceptación:**

```
Dado que el stock actual de un producto es menor o igual al stock mínimo configurado
Cuando el cajero o el sistema realiza cualquier movimiento de salida
Entonces aparece en el panel de administración una alerta con el producto, stock actual y stock mínimo
  Y el producto se muestra con indicador visual de "Stock bajo" en el catálogo.
```

---

**HU-12 — Realizar conteo físico (inventario)**

> Como **supervisor**, quiero comparar el inventario físico contra el sistema para detectar diferencias y generar un reporte de discrepancias.

**Criterios de aceptación:**

```
Dado que el supervisor inicia un conteo físico para una categoría o todos los productos
  Y captura las cantidades físicas contadas
Cuando finaliza el conteo
Entonces el sistema muestra la diferencia (física vs. sistema) por producto
  Y permite al supervisor aprobar ajustes automáticos o rechazarlos individualmente
  Y genera un reporte PDF del conteo con firmas digitales de responsables.
```

---

### 2.4 Módulo de Corte de Caja

---

**HU-13 — Realizar corte de caja al cierre de turno**

> Como **supervisor**, quiero realizar el corte de caja al término del turno para conciliar las ventas del día con el efectivo real en caja.

**Criterios de aceptación:**

```
Dado que el supervisor inicia el corte de caja para un turno cerrado
  Y captura el monto de efectivo contado físicamente
Cuando confirma el corte
Entonces el sistema calcula: ventas en efectivo esperadas, monto contado, diferencia (sobrante/faltante)
  Y muestra el resumen de ventas por método de pago
  Y bloquea la apertura de nuevas ventas para ese turno
  Y genera un reporte de corte que puede imprimirse o exportarse a PDF.
```

```
Dado que existe una diferencia mayor a $X (configurado por el administrador)
Cuando el supervisor intenta confirmar el corte
Entonces el sistema exige una nota de justificación antes de autorizar el cierre.
```

---

**HU-14 — Consultar historial de cortes de caja**

> Como **administrador**, quiero consultar los cortes de caja anteriores para auditorías o revisiones gerenciales.

**Criterios de aceptación:**

```
Dado que el administrador accede al historial de cortes
  Y filtra por rango de fechas o por cajero
Cuando aplica el filtro
Entonces se listan los cortes con fecha, turno, cajero, total de ventas y diferencia
  Y puede ver el detalle completo de cada corte o descargarlo en PDF.
```

---

**HU-15 — Configurar fondo de caja inicial**

> Como **supervisor**, quiero registrar el fondo inicial de caja al inicio de cada turno para llevar un control exacto del efectivo.

**Criterios de aceptación:**

```
Dado que el supervisor abre un turno nuevo
  Y registra el monto del fondo inicial en efectivo
Cuando inicia el turno
Entonces el fondo queda registrado y se toma en cuenta en el cálculo del corte
  Y el cajero solo puede comenzar a vender después de que el turno esté activo.
```

---

## 3. Requerimientos No Funcionales

### 3.1 Rendimiento

- El sistema debe registrar una venta completa (búsqueda + cobro + ticket) en menos de **5 segundos** en condiciones normales de red.
- Las búsquedas de productos deben retornar resultados en menos de **2 segundos** con catálogos de hasta 10,000 artículos.
- Los reportes de corte de caja deben generarse en menos de **10 segundos**.

### 3.2 Disponibilidad

- El sistema debe estar disponible **99.5%** del tiempo en horario operativo (6:00–22:00).
- Debe soportar operación **offline** para registro de ventas en caso de pérdida de conectividad, sincronizando datos al restablecer la conexión.

### 3.3 Seguridad

- Todos los usuarios deben autenticarse con usuario y contraseña; las contraseñas se almacenan con hash bcrypt (salt factor ≥ 12).
- Las sesiones expiran tras **30 minutos** de inactividad.
- Cada acción crítica (descuentos, devoluciones, ajustes, cortes) queda registrada en un log de auditoría inmutable con usuario, fecha y hora.
- El acceso a los módulos está controlado por roles; ningún cajero puede acceder a configuración de precios o reportes financieros.

### 3.4 Usabilidad

- La interfaz del cajero debe ser operable con teclado y lector de código de barras sin necesidad de ratón.
- Los mensajes de error deben ser claros, en español, y orientados a la acción correctiva.
- El flujo de venta completo no debe requerir más de **4 pasos** desde la búsqueda del producto hasta el ticket impreso.

### 3.5 Escalabilidad

- La arquitectura debe soportar al menos **5 terminales de caja** simultáneas sin degradación de rendimiento.
- El catálogo debe manejar hasta **50,000 productos** activos.

---

## 4. Restricciones Técnicas

### 4.1 Plataforma

- Aplicación de escritorio o web-app responsiva compatible con **Windows 10/11** y **navegadores modernos** (Chrome 110+, Edge 110+).
- Impresión de tickets compatible con impresoras **térmicas ESC/POS** de 58 mm y 80 mm.
- Lectura de código de barras mediante lectores HID estándar (USB, Bluetooth).

### 4.2 Base de Datos

- Base de datos relacional: **PostgreSQL 15+** o **MySQL 8+**.
- Se requieren respaldos automáticos diarios con retención mínima de **30 días**.
- Los registros de ventas y movimientos de inventario no pueden eliminarse físicamente; solo se permite baja lógica.

### 4.3 Integraciones

- Generación de **CFDI (Factura Electrónica)** mediante integración con un PAC certificado por el SAT (México) cuando el cliente la solicite.
- Exportación de reportes en formatos **PDF** y **CSV/Excel**.
- API REST para futura integración con sistemas contables (ERP) o e-commerce.

### 4.4 Idioma y Localización

- Idioma de la interfaz: **Español (México)**.
- Formato de moneda: **MXN ($)**, con dos decimales.
- Formato de fecha: **DD/MM/AAAA**.
- Zona horaria configurable por sucursal.

### 4.5 Cumplimiento Normativo

- El sistema debe cumplir con los lineamientos del **SAT** para el registro de ventas y emisión de comprobantes.
- Los datos de clientes (cuando se capturen para facturación) deben tratarse conforme a la **Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)**.

---

## 5. Flujos Principales del Sistema

### 5.1 Flujo de Venta Estándar

```
Inicio de turno (fondo de caja)
    ↓
Autenticación del cajero
    ↓
Búsqueda de producto (nombre / SKU / código de barras)
    ↓
Agregar al carrito → Ajustar cantidad
    ↓
¿Descuento? → Sí → Autorización supervisor
    ↓
Selección de método de pago (efectivo / tarjeta / mixto)
    ↓
Cálculo de cambio (si aplica)
    ↓
Confirmar venta → Actualización de inventario
    ↓
Impresión de ticket / Envío digital
    ↓
¿Factura? → Sí → Captura de datos fiscales → Generación CFDI
```

### 5.2 Flujo de Corte de Caja

```
Supervisor inicia cierre de turno
    ↓
Sistema calcula ventas por método de pago
    ↓
Supervisor cuenta efectivo físico → Captura monto
    ↓
Sistema calcula diferencia (sobrante / faltante)
    ↓
¿Diferencia mayor al límite? → Sí → Captura justificación
    ↓
Confirmar corte → Turno cerrado → Reporte generado
```

---

## 6. Glosario

| Término | Definición |
|---|---|
| SKU | Stock Keeping Unit. Código único de identificación de un producto |
| Stock mínimo | Nivel de inventario por debajo del cual se genera una alerta de reabastecimiento |
| Corte de caja | Proceso de cierre de turno que concilia las ventas registradas con el efectivo físico |
| Fondo de caja | Monto en efectivo disponible al inicio de un turno |
| PAC | Proveedor Autorizado de Certificación, empresa certificada por el SAT para validar CFDIs |
| CFDI | Comprobante Fiscal Digital por Internet (Factura Electrónica en México) |
| Baja lógica | Marcado de un registro como inactivo/eliminado sin borrar los datos físicamente de la base |
| ESC/POS | Conjunto de comandos estándar para controlar impresoras térmicas de recibos |
| Turno | Período de trabajo de un cajero delimitado por apertura y corte de caja |

---

## 7. Supuestos y Dependencias

- El negocio opera con **una sola sucursal** en la versión inicial; multi-sucursal es un alcance futuro.
- Se asume conexión a internet para facturación electrónica; las ventas sin factura funcionan en modo offline.
- La ferretería ya cuenta con hardware de cómputo básico; el proveedor del sistema no provee hardware.
- Los precios incluyen IVA o se configuran con impuesto desglosado según la política del negocio.
- La integración con proveedores para órdenes de compra está fuera del alcance de esta versión.

---

## 8. Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Pérdida de conectividad durante ventas | Alta | Alto | Modo offline con sincronización posterior |
| Error en integración con PAC para CFDI | Media | Medio | Pruebas en ambiente de certificación del SAT; proveedor PAC con SLA |
| Resistencia del personal al cambio | Media | Alto | Capacitación y manual de usuario en español |
| Inconsistencias de inventario por operación concurrente | Baja | Alto | Bloqueo optimista (optimistic locking) en transacciones de stock |
| Pérdida de datos por falla de hardware | Baja | Crítico | Respaldos automáticos diarios en la nube |

---

*Fin del documento — Versión 1.0*