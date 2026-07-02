# Modelo de Datos — Sistema POS Ferretería

**Versión:** 1.0  
**Fecha:** 2026-06-29

---

```mermaid
erDiagram

  CATEGORIAS {
    int id_categoria PK
    varchar nombre UK
    varchar descripcion
    boolean activo
    timestamp creado_en
    timestamp actualizado_en
  }

  USUARIOS {
    int id_usuario PK
    varchar nombre
    varchar email UK
    varchar password_hash
    enum rol
    boolean activo
    timestamp creado_en
    timestamp actualizado_en
  }

  PRODUCTOS {
    int id_producto PK
    varchar sku UK
    varchar nombre
    text descripcion
    int id_categoria FK
    numeric precio_venta
    numeric precio_costo
    int stock_actual
    int stock_minimo
    boolean activo
    timestamp creado_en
    timestamp actualizado_en
  }

  HISTORIAL_PRECIOS {
    int id_historial PK
    int id_producto FK
    int id_usuario FK
    numeric precio_anterior
    numeric precio_nuevo
    timestamp creado_en
  }

  MOVIMIENTOS_INVENTARIO {
    int id_movimiento PK
    int id_producto FK
    int id_usuario FK
    enum tipo_movimiento
    int cantidad
    int stock_anterior
    int stock_nuevo
    varchar referencia
    text motivo
    timestamp creado_en
  }

  TURNOS {
    int id_turno PK
    int id_cajero FK
    int id_supervisor FK
    numeric fondo_inicial
    timestamp apertura
    timestamp cierre
    enum estado
    timestamp creado_en
  }

  VENTAS {
    int id_venta PK
    int id_turno FK
    int id_cajero FK
    varchar folio UK
    enum metodo_pago
    numeric subtotal
    numeric impuesto
    numeric descuento_total
    numeric total
    numeric monto_pagado
    numeric cambio
    enum estado
    boolean es_devolucion
    int id_venta_origen FK
    timestamp creado_en
  }

  DETALLE_VENTA {
    int id_detalle PK
    int id_venta FK
    int id_producto FK
    int cantidad
    numeric precio_unitario
    numeric descuento_pct
    numeric descuento_monto
    numeric subtotal_linea
    numeric impuesto_linea
    numeric total_linea
  }

  DESCUENTOS_APLICADOS {
    int id_descuento PK
    int id_venta FK
    int id_autorizo FK
    enum tipo
    numeric valor
    numeric monto_aplicado
    timestamp creado_en
  }

  CORTES_CAJA {
    int id_corte PK
    int id_turno FK
    int id_supervisor FK
    numeric efectivo_esperado
    numeric efectivo_contado
    numeric diferencia
    numeric total_tarjeta
    numeric total_ventas
    int num_transacciones
    text justificacion
    timestamp creado_en
  }

  CATEGORIAS            ||--o{ PRODUCTOS               : "clasifica"
  PRODUCTOS             ||--o{ DETALLE_VENTA            : "se vende en"
  PRODUCTOS             ||--o{ MOVIMIENTOS_INVENTARIO   : "registra movimiento"
  PRODUCTOS             ||--o{ HISTORIAL_PRECIOS        : "tiene historial"
  USUARIOS              ||--o{ MOVIMIENTOS_INVENTARIO   : "ejecuta"
  USUARIOS              ||--o{ HISTORIAL_PRECIOS        : "modifica precio"
  USUARIOS              ||--o{ VENTAS                   : "procesa"
  USUARIOS              ||--o{ TURNOS                   : "abre turno"
  USUARIOS              ||--o{ TURNOS                   : "supervisa"
  USUARIOS              ||--o{ CORTES_CAJA              : "realiza corte"
  USUARIOS              ||--o{ DESCUENTOS_APLICADOS     : "autoriza"
  TURNOS                ||--o{ VENTAS                   : "contiene"
  TURNOS                ||--|{ CORTES_CAJA              : "cierra con"
  VENTAS                ||--o{ DETALLE_VENTA            : "tiene líneas"
  VENTAS                ||--o{ DESCUENTOS_APLICADOS     : "incluye"
  VENTAS                o|--o{ VENTAS                   : "devolución de"
```

---

## Cardinalidades

| Relación | Tipo | Descripción |
|---|---|---|
| `CATEGORIAS` → `PRODUCTOS` | 1 a muchos | Una categoría agrupa varios productos |
| `PRODUCTOS` → `DETALLE_VENTA` | 1 a muchos | Un producto aparece en múltiples líneas de venta |
| `PRODUCTOS` → `MOVIMIENTOS_INVENTARIO` | 1 a muchos | Cada producto acumula sus entradas/salidas |
| `PRODUCTOS` → `HISTORIAL_PRECIOS` | 1 a muchos | Cada cambio de precio queda registrado |
| `USUARIOS` → `TURNOS` | 1 a muchos | Un cajero puede tener varios turnos |
| `TURNOS` → `VENTAS` | 1 a muchos | Un turno contiene todas las ventas del período |
| `TURNOS` → `CORTES_CAJA` | 1 a exactamente 1 | Cada turno tiene un único corte de caja |
| `VENTAS` → `DETALLE_VENTA` | 1 a muchos | Una venta tiene una o más líneas de producto |
| `VENTAS` → `VENTAS` | 0..1 a muchos | Una venta puede originar devoluciones |

---

## Notas técnicas

- **Baja lógica:** `PRODUCTOS` y `USUARIOS` usan el campo `activo` — nunca se eliminan físicamente.
- **Auditoría inmutable:** `HISTORIAL_PRECIOS` y `MOVIMIENTOS_INVENTARIO` no tienen `UPDATE` ni `DELETE` permitidos por política de aplicación.
- **Devoluciones:** `VENTAS.id_venta_origen` es auto-referencia; `es_devolucion = TRUE` identifica notas de crédito.
- **Corte único:** `CORTES_CAJA.id_turno` tiene restricción `UNIQUE` — un turno sólo puede cerrarse una vez.
- **Precisión monetaria:** Todos los importes usan `NUMERIC(12,2)` para evitar errores de punto flotante.
