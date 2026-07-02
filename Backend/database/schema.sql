-- =============================================================
-- Sistema de Punto de Venta - Ferretería
-- Script de creación de base de datos
-- Motor: PostgreSQL 15+ (compatible con MySQL 8 con ajustes menores)
-- Versión: 1.0  |  Fecha: 2026-06-29
-- =============================================================

-- -------------------------------------------------------------
-- EXTENSIONES (PostgreSQL)
-- -------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Para gen_random_uuid() si se migra a UUID

-- =============================================================
-- 1. CATEGORIAS
--    Agrupación de productos (Herramientas, Electricidad, etc.)
-- =============================================================
CREATE TABLE categorias (
    id_categoria   SERIAL          PRIMARY KEY,
    nombre         VARCHAR(100)    NOT NULL,
    descripcion    VARCHAR(255),
    activo         BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMP       NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_categoria_nombre UNIQUE (nombre)
);

-- =============================================================
-- 2. USUARIOS
--    Cajeros, supervisores, administradores, encargados
-- =============================================================
CREATE TYPE rol_usuario AS ENUM (
    'administrador',
    'supervisor',
    'cajero',
    'encargado_inventario'
);

CREATE TABLE usuarios (
    id_usuario     SERIAL          PRIMARY KEY,
    nombre         VARCHAR(150)    NOT NULL,
    email          VARCHAR(200)    NOT NULL,
    password_hash  VARCHAR(255)    NOT NULL,   -- bcrypt, salt factor >= 12
    rol            rol_usuario     NOT NULL,
    activo         BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMP       NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_usuario_email UNIQUE (email)
);

-- =============================================================
-- 3. PRODUCTOS
--    Catálogo maestro de artículos de la ferretería
-- =============================================================
CREATE TABLE productos (
    id_producto    SERIAL          PRIMARY KEY,
    sku            VARCHAR(50)     NOT NULL,
    nombre         VARCHAR(200)    NOT NULL,
    descripcion    TEXT,
    id_categoria   INTEGER         NOT NULL
                                   REFERENCES categorias (id_categoria)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,
    precio_venta   NUMERIC(12, 2)  NOT NULL CHECK (precio_venta > 0),
    precio_costo   NUMERIC(12, 2)  NOT NULL CHECK (precio_costo >= 0),
    stock_actual   INTEGER         NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo   INTEGER         NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    activo         BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMP       NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_producto_sku UNIQUE (sku)
);

-- Índices de búsqueda frecuente
CREATE INDEX idx_productos_nombre       ON productos (nombre);
CREATE INDEX idx_productos_categoria    ON productos (id_categoria);
CREATE INDEX idx_productos_stock_alerta ON productos (stock_actual, stock_minimo)
    WHERE activo = TRUE;

-- =============================================================
-- 4. HISTORIAL_PRECIOS
--    Auditoría de cada cambio de precio de venta
-- =============================================================
CREATE TABLE historial_precios (
    id_historial   SERIAL          PRIMARY KEY,
    id_producto    INTEGER         NOT NULL
                                   REFERENCES productos (id_producto)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,
    id_usuario     INTEGER         NOT NULL
                                   REFERENCES usuarios (id_usuario)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,
    precio_anterior NUMERIC(12, 2) NOT NULL,
    precio_nuevo    NUMERIC(12, 2) NOT NULL CHECK (precio_nuevo > 0),
    creado_en      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historial_precios_producto ON historial_precios (id_producto);

-- =============================================================
-- 5. MOVIMIENTOS_INVENTARIO
--    Registro de entradas, salidas y ajustes de stock
-- =============================================================
CREATE TYPE tipo_movimiento AS ENUM (
    'entrada',          -- Recepción de mercancía de proveedor
    'salida_venta',     -- Descuento automático por venta
    'devolucion',       -- Reintegro por devolución de cliente
    'ajuste_merma',     -- Pérdida por daño o vencimiento
    'ajuste_extravio',  -- Pérdida por robo o extravío
    'ajuste_conteo',    -- Corrección tras conteo físico
    'muestra'           -- Salida como muestra sin cargo
);

CREATE TABLE movimientos_inventario (
    id_movimiento  SERIAL          PRIMARY KEY,
    id_producto    INTEGER         NOT NULL
                                   REFERENCES productos (id_producto)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,
    id_usuario     INTEGER         NOT NULL
                                   REFERENCES usuarios (id_usuario)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,
    tipo_movimiento tipo_movimiento NOT NULL,
    cantidad       INTEGER         NOT NULL,    -- Positivo = entrada, negativo = salida
    stock_anterior INTEGER         NOT NULL,
    stock_nuevo    INTEGER         NOT NULL,
    referencia     VARCHAR(100),               -- Núm. factura proveedor, folio venta, etc.
    motivo         TEXT,
    creado_en      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movimientos_producto  ON movimientos_inventario (id_producto);
CREATE INDEX idx_movimientos_fecha     ON movimientos_inventario (creado_en);
CREATE INDEX idx_movimientos_usuario   ON movimientos_inventario (id_usuario);

-- =============================================================
-- 6. TURNOS
--    Período de trabajo de un cajero (apertura → corte de caja)
-- =============================================================
CREATE TYPE estado_turno AS ENUM (
    'abierto',
    'cerrado'
);

CREATE TABLE turnos (
    id_turno       SERIAL          PRIMARY KEY,
    id_cajero      INTEGER         NOT NULL
                                   REFERENCES usuarios (id_usuario)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,
    id_supervisor  INTEGER
                                   REFERENCES usuarios (id_usuario)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,
    fondo_inicial  NUMERIC(12, 2)  NOT NULL DEFAULT 0 CHECK (fondo_inicial >= 0),
    apertura       TIMESTAMP       NOT NULL DEFAULT NOW(),
    cierre         TIMESTAMP,
    estado         estado_turno    NOT NULL DEFAULT 'abierto',
    creado_en      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_turnos_cajero ON turnos (id_cajero);
CREATE INDEX idx_turnos_estado ON turnos (estado);

-- =============================================================
-- 7. VENTAS
--    Cabecera de cada transacción de venta o devolución
-- =============================================================
CREATE TYPE metodo_pago AS ENUM (
    'efectivo',
    'tarjeta_debito',
    'tarjeta_credito',
    'mixto'
);

CREATE TYPE estado_venta AS ENUM (
    'completada',
    'cancelada',
    'devuelta',
    'devuelta_parcial'
);

CREATE TABLE ventas (
    id_venta        SERIAL          PRIMARY KEY,
    id_turno        INTEGER         NOT NULL
                                    REFERENCES turnos (id_turno)
                                    ON UPDATE CASCADE
                                    ON DELETE RESTRICT,
    id_cajero       INTEGER         NOT NULL
                                    REFERENCES usuarios (id_usuario)
                                    ON UPDATE CASCADE
                                    ON DELETE RESTRICT,
    folio           VARCHAR(20)     NOT NULL,   -- Consecutivo: VTA-0000001
    metodo_pago     metodo_pago     NOT NULL,
    subtotal        NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    impuesto        NUMERIC(12, 2)  NOT NULL DEFAULT 0,   -- IVA
    descuento_total NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    total           NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    monto_pagado    NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    cambio          NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    estado          estado_venta    NOT NULL DEFAULT 'completada',
    es_devolucion   BOOLEAN         NOT NULL DEFAULT FALSE,
    id_venta_origen INTEGER                                -- FK a la venta original si es devolución
                                    REFERENCES ventas (id_venta)
                                    ON UPDATE CASCADE
                                    ON DELETE RESTRICT,
    creado_en       TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_venta_folio   UNIQUE (folio),
    CONSTRAINT chk_venta_total  CHECK (total >= 0),
    CONSTRAINT chk_venta_cambio CHECK (cambio >= 0)
);

CREATE INDEX idx_ventas_turno    ON ventas (id_turno);
CREATE INDEX idx_ventas_cajero   ON ventas (id_cajero);
CREATE INDEX idx_ventas_fecha    ON ventas (creado_en);
CREATE INDEX idx_ventas_folio    ON ventas (folio);
CREATE INDEX idx_ventas_estado   ON ventas (estado);
CREATE INDEX idx_ventas_origen   ON ventas (id_venta_origen) WHERE id_venta_origen IS NOT NULL;

-- =============================================================
-- 8. DETALLE_VENTA
--    Líneas de productos dentro de cada venta
-- =============================================================
CREATE TABLE detalle_venta (
    id_detalle      SERIAL          PRIMARY KEY,
    id_venta        INTEGER         NOT NULL
                                    REFERENCES ventas (id_venta)
                                    ON UPDATE CASCADE
                                    ON DELETE RESTRICT,
    id_producto     INTEGER         NOT NULL
                                    REFERENCES productos (id_producto)
                                    ON UPDATE CASCADE
                                    ON DELETE RESTRICT,
    cantidad        INTEGER         NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12, 2)  NOT NULL CHECK (precio_unitario >= 0),
    descuento_pct   NUMERIC(5, 2)   NOT NULL DEFAULT 0
                                    CHECK (descuento_pct >= 0 AND descuento_pct <= 100),
    descuento_monto NUMERIC(12, 2)  NOT NULL DEFAULT 0 CHECK (descuento_monto >= 0),
    subtotal_linea  NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    impuesto_linea  NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    total_linea     NUMERIC(12, 2)  NOT NULL DEFAULT 0
);

CREATE INDEX idx_detalle_venta   ON detalle_venta (id_venta);
CREATE INDEX idx_detalle_producto ON detalle_venta (id_producto);

-- =============================================================
-- 9. DESCUENTOS_APLICADOS
--    Registro de cada descuento con autorización de supervisor
-- =============================================================
CREATE TYPE tipo_descuento AS ENUM (
    'porcentaje',
    'monto_fijo'
);

CREATE TABLE descuentos_aplicados (
    id_descuento   SERIAL          PRIMARY KEY,
    id_venta       INTEGER         NOT NULL
                                   REFERENCES ventas (id_venta)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,
    id_autorizo    INTEGER         NOT NULL
                                   REFERENCES usuarios (id_usuario)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,
    tipo           tipo_descuento  NOT NULL,
    valor          NUMERIC(10, 2)  NOT NULL CHECK (valor > 0),     -- % o monto fijo
    monto_aplicado NUMERIC(12, 2)  NOT NULL CHECK (monto_aplicado >= 0),
    creado_en      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_descuentos_venta ON descuentos_aplicados (id_venta);

-- =============================================================
-- 10. CORTES_CAJA
--     Cierre de turno y conciliación de efectivo
-- =============================================================
CREATE TABLE cortes_caja (
    id_corte          SERIAL          PRIMARY KEY,
    id_turno          INTEGER         NOT NULL
                                      REFERENCES turnos (id_turno)
                                      ON UPDATE CASCADE
                                      ON DELETE RESTRICT,
    id_supervisor     INTEGER         NOT NULL
                                      REFERENCES usuarios (id_usuario)
                                      ON UPDATE CASCADE
                                      ON DELETE RESTRICT,
    efectivo_esperado NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    efectivo_contado  NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    diferencia        NUMERIC(12, 2)  NOT NULL DEFAULT 0,  -- contado - esperado
    total_tarjeta     NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    total_ventas      NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    num_transacciones INTEGER         NOT NULL DEFAULT 0,
    justificacion     TEXT,           -- Obligatorio cuando |diferencia| > umbral
    creado_en         TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_corte_turno UNIQUE (id_turno)   -- Un solo corte por turno
);

CREATE INDEX idx_cortes_supervisor ON cortes_caja (id_supervisor);
CREATE INDEX idx_cortes_fecha      ON cortes_caja (creado_en);

-- =============================================================
-- TRIGGERS
-- =============================================================

-- Actualizar timestamp automáticamente en categorias y productos
CREATE OR REPLACE FUNCTION fn_set_actualizado_en()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_categorias_actualizado_en
    BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION fn_set_actualizado_en();

CREATE TRIGGER trg_productos_actualizado_en
    BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION fn_set_actualizado_en();

-- Registrar historial de precios automáticamente al cambiar precio_venta
CREATE OR REPLACE FUNCTION fn_historial_precio()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.precio_venta <> OLD.precio_venta THEN
        INSERT INTO historial_precios (
            id_producto, id_usuario, precio_anterior, precio_nuevo
        ) VALUES (
            NEW.id_producto,
            current_setting('app.usuario_actual', TRUE)::INTEGER,
            OLD.precio_venta,
            NEW.precio_venta
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_producto_precio
    BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION fn_historial_precio();

-- =============================================================
-- VISTA: Productos con alerta de stock bajo
-- =============================================================
CREATE OR REPLACE VIEW v_stock_bajo AS
SELECT
    p.id_producto,
    p.sku,
    p.nombre,
    c.nombre          AS categoria,
    p.stock_actual,
    p.stock_minimo,
    (p.stock_minimo - p.stock_actual) AS unidades_faltantes
FROM productos p
JOIN categorias c ON c.id_categoria = p.id_categoria
WHERE p.activo = TRUE
  AND p.stock_actual <= p.stock_minimo
ORDER BY unidades_faltantes DESC;

-- =============================================================
-- VISTA: Resumen de ventas por turno
-- =============================================================
CREATE OR REPLACE VIEW v_resumen_turno AS
SELECT
    t.id_turno,
    u.nombre          AS cajero,
    t.apertura,
    t.cierre,
    t.estado,
    t.fondo_inicial,
    COUNT(v.id_venta)                                          AS num_ventas,
    COALESCE(SUM(v.total) FILTER (WHERE v.estado = 'completada'), 0) AS total_ventas,
    COALESCE(SUM(v.total) FILTER (WHERE v.metodo_pago = 'efectivo'
                                    AND v.estado = 'completada'), 0) AS ventas_efectivo,
    COALESCE(SUM(v.total) FILTER (WHERE v.metodo_pago IN ('tarjeta_debito','tarjeta_credito')
                                    AND v.estado = 'completada'), 0) AS ventas_tarjeta
FROM turnos t
JOIN usuarios u ON u.id_usuario = t.id_cajero
LEFT JOIN ventas v ON v.id_turno = t.id_turno
GROUP BY t.id_turno, u.nombre, t.apertura, t.cierre, t.estado, t.fondo_inicial;

-- =============================================================
-- DATOS INICIALES (seed)
-- =============================================================

-- Categorías base de ferretería
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Herramientas manuales',  'Llaves, desarmadores, martillos, pinzas'),
    ('Herramientas eléctricas','Taladros, esmeriles, sierras eléctricas'),
    ('Electricidad',           'Cable, contactos, centros de carga, focos'),
    ('Plomería',               'Tubería, llaves de paso, conexiones PVC'),
    ('Ferretería general',     'Tornillería, anclajes, remaches, bisagras'),
    ('Pinturas y acabados',    'Pintura vinílica, esmalte, brochas, rodillos'),
    ('Adhesivos y selladores', 'Silicón, pegamento, cintas, selladores'),
    ('Seguridad industrial',   'EPP: cascos, guantes, lentes, chalecos');

-- Usuario administrador por defecto (contraseña: cambiar en producción)
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
    ('Administrador Sistema',
     'admin@ferreteria.local',
     '$2a$12$placeholderHashCambiarEnProduccion',
     'administrador');

-- =============================================================
-- COMENTARIOS EN TABLAS Y COLUMNAS (documentación inline)
-- =============================================================
COMMENT ON TABLE  categorias                   IS 'Agrupación de productos del catálogo';
COMMENT ON TABLE  usuarios                     IS 'Usuarios del sistema con autenticación y rol';
COMMENT ON TABLE  productos                    IS 'Catálogo maestro de artículos en venta';
COMMENT ON TABLE  historial_precios            IS 'Auditoría inmutable de cambios de precio';
COMMENT ON TABLE  movimientos_inventario       IS 'Registro de todas las entradas y salidas de stock';
COMMENT ON TABLE  turnos                       IS 'Períodos de caja por cajero';
COMMENT ON TABLE  ventas                       IS 'Cabecera de transacciones de venta y devolución';
COMMENT ON TABLE  detalle_venta                IS 'Líneas de producto por venta';
COMMENT ON TABLE  descuentos_aplicados         IS 'Descuentos autorizados aplicados a ventas';
COMMENT ON TABLE  cortes_caja                  IS 'Conciliación de efectivo al cierre de turno';

COMMENT ON COLUMN ventas.folio                 IS 'Consecutivo único del ticket: VTA-0000001';
COMMENT ON COLUMN ventas.id_venta_origen       IS 'Referencia a la venta original en caso de devolución';
COMMENT ON COLUMN ventas.es_devolucion         IS 'TRUE indica que este registro es una nota de crédito';
COMMENT ON COLUMN movimientos_inventario.cantidad IS 'Positivo = entrada de stock, negativo = salida';
COMMENT ON COLUMN cortes_caja.diferencia       IS 'efectivo_contado - efectivo_esperado; negativo = faltante';
COMMENT ON COLUMN usuarios.password_hash       IS 'Hash bcrypt con salt factor mínimo 12';
