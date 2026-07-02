# 📚 Documentación Swagger/OpenAPI - API Punto de Venta

## 🎯 Acceso a la documentación interactiva

Una vez que el servidor esté corriendo, accede a la documentación Swagger en:

```
http://localhost:3000/api-docs
```

## 🚀 Características

La documentación Swagger incluye:

- ✅ **Especificación OpenAPI 3.0.0** completa
- ✅ **Todos los endpoints** documentados con descripción detallada
- ✅ **Ejemplos de request/response** para cada operación
- ✅ **Esquemas JSON** para todos los tipos de datos
- ✅ **Autenticación JWT** integrada
- ✅ **Códigos de error** documentados para cada endpoint
- ✅ **Interfaz interactiva** para probar endpoints en vivo

## 📋 Estructura de la API

### Módulo de Autenticación (`/api/v1/auth`)
- `POST /login` - Iniciar sesión y obtener JWT token
- `GET /me` - Obtener información del usuario actual

### Módulo de Categorías (`/api/v1/categorias`)
- `GET /` - Listar todas las categorías
- `POST /` - Crear nueva categoría (admin)
- `PATCH /{id}` - Actualizar categoría (admin)

### Módulo de Productos (`/api/v1/productos`)
- `GET /` - Listar productos con filtros
- `GET /{id}` - Obtener producto por ID
- `POST /` - Crear nuevo producto (admin)
- `PATCH /{id}/precio` - Actualizar precio (admin)
- `PATCH /{id}/desactivar` - Desactivar producto (admin)
- `POST /totales` - Calcular totales del inventario

### Módulo de Turnos (`/api/v1/turnos`)
- `POST /` - Abrir nuevo turno
- `GET /activo` - Obtener turno activo del usuario

### Módulo de Ventas (`/api/v1/ventas`)
- `POST /` - Registrar nueva venta
- `POST /{id}/descuento` - Aplicar descuento a venta
- `GET /{id}/ticket` - Obtener ticket de venta

### Módulo de Corte de Caja (`/api/v1/cortes`)
- `POST /` - Crear corte de caja (supervisor)
- `GET /` - Obtener historial de cortes (admin/supervisor)

### Módulo de Inventario (`/api/v1/inventario`)
- `POST /entradas` - Registrar entrada de mercancía
- `POST /ajustes` - Registrar ajuste de inventario
- `GET /stock-bajo` - Obtener productos con stock bajo

## 🔐 Autenticación

Todos los endpoints (excepto login) requieren autenticación con JWT token.

### En Swagger:
1. Haz clic en el botón **"Authorize"** en la parte superior derecha
2. Ingresa el token en el formato: `Bearer YOUR_JWT_TOKEN`
3. Haz clic en **"Authorize"**

### En código:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/v1/auth/me
```

## 📝 Ejemplos de uso

### 1. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ferreteria.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ferreteria.com",
    "rol": "cajero",
    "estado": "activo"
  }
}
```

### 2. Crear producto
```bash
curl -X POST http://localhost:3000/api/v1/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nombre": "Martillo de acero",
    "sku": "SKU001",
    "id_categoria": 1,
    "precio_costo": 50.00,
    "precio_venta": 99.99,
    "descripcion": "Martillo de acero forjado",
    "stock_minimo": 10
  }'
```

### 3. Registrar venta
```bash
curl -X POST http://localhost:3000/api/v1/ventas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "lineas": [
      {
        "id_producto": 1,
        "cantidad": 2,
        "precio_unitario": 99.99
      }
    ],
    "metodo_pago": "efectivo"
  }'
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "sale": {
      "id_venta": 1,
      "folio": "FOLIO001",
      "total": 351.98,
      "estado": "completada"
    },
    "total": 351.98
  }
}
```

### 4. Corte de caja
```bash
curl -X POST http://localhost:3000/api/v1/cortes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id_turno": 1,
    "id_supervisor": 2,
    "efectivo_contado": 5050.00,
    "efectivo_esperado": 5000.00,
    "total_tarjeta": 1500.00,
    "total_ventas": 6550.00,
    "num_transacciones": 25,
    "justificacion": "Sobrante por redondeos"
  }'
```

## 🔍 Códigos de error

| Código | Descripción | Ejemplo |
|--------|-------------|---------|
| **200** | Éxito en GET/PATCH | Obtener usuario |
| **201** | Recurso creado exitosamente | Crear producto |
| **400** | Solicitud inválida | Parámetros faltantes |
| **401** | No autorizado - Token inválido | Falta Bearer token |
| **403** | Prohibido - Rol insuficiente | Cajero intenta crear producto |
| **404** | Recurso no encontrado | Producto con ID inexistente |
| **409** | Conflicto - Stock insuficiente | Vender producto sin stock |
| **500** | Error del servidor | Error en BD |

## 🧪 Pruebas interactivas en Swagger

1. **Abre** http://localhost:3000/api-docs en tu navegador
2. **Haz clic** en cualquier endpoint
3. **Completa** los campos requeridos
4. **Haz clic** en "Try it out" → "Execute"
5. **Ve** la respuesta en tiempo real

## 📊 Esquemas documentados

### Roles de usuario
- `cajero` - Registra ventas
- `administrador` - Gestiona productos, precios, usuarios
- `supervisor` - Realiza cortes de caja
- `encargado_inventario` - Gestiona entradas y ajustes

### Estados
- **Productos**: `activo`, `inactivo`
- **Turnos**: `abierto`, `cerrado`
- **Ventas**: `completada`, `cancelada`
- **Usuarios**: `activo`, `inactivo`

### Métodos de pago
- `efectivo`
- `tarjeta`
- `transferencia`

## 🔧 Configuración personalizada

Para modificar la documentación, edita el archivo:
```
Backend/src/config/swagger.js
```

Puedes cambiar:
- Título y descripción
- Servidores (desarrollo/producción)
- Esquemas y ejemplos
- Descripción de parámetros
- Códigos de error

## 📚 Recursos adicionales

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [JWT Documentation](https://jwt.io/)

## 🐛 Troubleshooting

### Swagger no aparece en `/api-docs`
1. Verifica que `swagger-ui-express` esté instalado: `npm list swagger-ui-express`
2. Reinicia el servidor: `npm start`
3. Borra el caché del navegador

### Token no funciona en Swagger
1. Obtén un nuevo token en `/api/v1/auth/login`
2. Copia el token completo (sin "Bearer")
3. En Swagger, haz clic en **Authorize**
4. Ingresa: `Bearer YOUR_TOKEN` (con la palabra Bearer)

### CORS error en navegador
1. Verifica que CORS esté habilitado en `app.js`
2. Solución: Accede a Swagger desde el mismo dominio

---

**Versión**: 1.0  
**Última actualización**: 2026-07-02  
**Estado**: ✅ Listo para usar
