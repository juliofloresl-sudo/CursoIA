# 📚 Documentación Swagger/OpenAPI - Integración Completada

## ✅ Resumen de cambios

La documentación Swagger/OpenAPI ha sido integrada exitosamente en tu API REST de Punto de Venta. La documentación es interactiva, completa y lista para producción.

## 🎯 Acceso a la documentación

### Opción 1: Swagger UI Interactiva (RECOMENDADO)
```
http://localhost:3000/api-docs
```

### Opción 2: Guía HTML de inicio rápido
Abre el archivo: `Backend/SWAGGER_GUIDE.html` en tu navegador

### Opción 3: Documentación completa en Markdown
Lee el archivo: `Backend/SWAGGER.md`

## 📦 Archivos agregados

```
Backend/
├── src/
│   └── config/
│       └── swagger.js              ← Configuración OpenAPI 3.0
├── app.js (actualizado)            ← Integración swagger-ui-express
├── package.json (actualizado)      ← Agregada dependencia
├── SWAGGER.md                       ← Guía completa en Markdown
├── SWAGGER_GUIDE.html              ← Guía visual interactiva
└── test-api.sh                     ← Script de prueba
```

## 🚀 Cómo usar

### 1. Instalar dependencias (ya hecho)
```bash
cd Backend
npm install swagger-ui-express@^4.6.0
```

### 2. Iniciar servidor
```bash
npm start
# O si tienes script de desarrollo:
npm run dev
```

### 3. Acceder a Swagger
```
http://localhost:3000/api-docs
```

### 4. Probar endpoints
1. Haz clic en cualquier endpoint
2. Haz clic en "Try it out"
3. Completa los parámetros
4. Haz clic en "Execute"

## 📖 Documentación incluida

### Especificación OpenAPI 3.0
- ✅ Info completa: título, descripción, versión, contacto
- ✅ Servidores: desarrollo y producción
- ✅ Esquemas JSON para todos los tipos de datos
- ✅ Endpoints documentados con descripción detallada
- ✅ Parámetros, requestBody, responses
- ✅ Ejemplos de request/response
- ✅ Códigos de error (200, 201, 400, 401, 403, 404, 409, 500)
- ✅ Seguridad: Bearer Token JWT

### Módulos documentados

#### 🏥 Health (público)
- `GET /health` - Verificar estado del servidor

#### 🔐 Autenticación
- `POST /api/v1/auth/login` - Login y obtener JWT
- `GET /api/v1/auth/me` - Información del usuario actual

#### 🏷️ Categorías
- `GET /api/v1/categorias` - Listar categorías
- `POST /api/v1/categorias` - Crear categoría (admin)
- `PATCH /api/v1/categorias/{id}` - Actualizar categoría (admin)

#### 📦 Productos
- `GET /api/v1/productos` - Listar productos con filtros
- `GET /api/v1/productos/{id}` - Obtener producto
- `POST /api/v1/productos` - Crear producto (admin)
- `PATCH /api/v1/productos/{id}/precio` - Actualizar precio (admin)
- `PATCH /api/v1/productos/{id}/desactivar` - Desactivar (admin)
- `POST /api/v1/productos/totales` - Calcular totales

#### ⏰ Turnos
- `POST /api/v1/turnos` - Abrir turno
- `GET /api/v1/turnos/activo` - Obtener turno activo

#### 💰 Ventas
- `POST /api/v1/ventas` - Registrar venta
- `POST /api/v1/ventas/{id}/descuento` - Aplicar descuento
- `GET /api/v1/ventas/{id}/ticket` - Obtener ticket

#### 📊 Corte de Caja
- `POST /api/v1/cortes` - Crear corte (supervisor)
- `GET /api/v1/cortes` - Historial de cortes (admin/supervisor)

#### 📈 Inventario
- `POST /api/v1/inventario/entradas` - Entrada de mercancía
- `POST /api/v1/inventario/ajustes` - Ajuste de stock
- `GET /api/v1/inventario/stock-bajo` - Productos con stock bajo

## 🔐 Autenticación

### En Swagger UI
1. Haz clic en el botón **"Authorize"** (parte superior derecha)
2. Ingresa: `Bearer YOUR_JWT_TOKEN`
3. Haz clic en "Authorize"
4. Ahora puedes usar endpoints protegidos

### En cURL
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/v1/auth/me
```

## 📝 Ejemplo de workflow completo

### 1. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ferreteria.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ferreteria.com",
    "rol": "cajero"
  }
}
```

### 2. Listar productos
```bash
curl http://localhost:3000/api/v1/productos
```

### 3. Registrar venta
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/v1/ventas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
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

## 📊 Estructura de respuestas

### Respuesta exitosa (200/201)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Martillo",
    "precio": 99.99
  }
}
```

### Respuesta con error (4xx/5xx)
```json
{
  "success": false,
  "error": "Mensaje de error descriptivo",
  "statusCode": 400
}
```

## 🔍 Características especiales

### Filtros en listados
```bash
# Listar por categoría
GET /api/v1/productos?id_categoria=1

# Filtrar por estado
GET /api/v1/productos?estado=activo

# Buscar por nombre o SKU
GET /api/v1/productos?buscar=martillo
```

### Soporte de múltiples métodos de pago
- `efectivo`
- `tarjeta`
- `transferencia`

### Roles con permisos
- `cajero` - Registra ventas
- `administrador` - Gestión total
- `supervisor` - Cortes de caja
- `encargado_inventario` - Gestión de stock

## 🧪 Ejecutar pruebas

### Script de prueba
```bash
bash Backend/test-api.sh
```

El script muestra:
- Estado del servidor
- Rutas disponibles
- Ejemplos de cURL
- Instrucciones de autenticación

## 🛠️ Personalización

Para modificar la documentación, edita:
```
Backend/src/config/swagger.js
```

Puedes cambiar:
- Título, descripción, versión
- Servidores (desarrollo/producción)
- Esquemas y ejemplos
- Descripción de endpoints
- Códigos de error

Ejemplo:
```javascript
info: {
  title: 'Mi API',
  description: 'Nueva descripción',
  version: '2.0.0'
}
```

Luego reinicia el servidor para ver los cambios.

## 🌐 Desplegar en producción

### Actualizar servidor de producción
En `swagger.js`, agrega tu URL de producción:
```javascript
servers: [
  {
    url: 'http://localhost:3000',
    description: 'Desarrollo'
  },
  {
    url: 'https://api.tudominio.com',
    description: 'Producción'
  }
]
```

### CORS para producción
```javascript
app.use(cors({
  origin: ['https://tudominio.com', 'https://www.tudominio.com'],
  credentials: true
}));
```

## 📱 Acceso desde dispositivos

### Misma red local
```
http://IP_DEL_SERVIDOR:3000/api-docs
```

Ejemplo: `http://192.168.1.100:3000/api-docs`

### Internet
1. Configura port forwarding en tu router
2. Usa tu IP pública o dominio
3. ⚠️ Asegúrate de usar HTTPS en producción

## 🐛 Troubleshooting

### Swagger no carga
```bash
# 1. Verifica que swagger esté instalado
npm list swagger-ui-express

# 2. Reinicia el servidor
npm start

# 3. Borra caché del navegador (Ctrl+F5)
```

### Token no funciona
```
1. Obtén un nuevo token en /api/v1/auth/login
2. En Swagger: Haz clic en "Authorize"
3. Ingresa: "Bearer " + tu token completo
4. Haz clic en "Authorize"
```

### CORS error
- Verifica que CORS esté habilitado en `app.js`
- Solución rápida: accede desde `localhost`

## 📚 Recursos

- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [JWT.io](https://jwt.io/)
- [Postman](https://www.postman.com/) - Alternativa a Swagger

## ✨ Lo que hace especial esta documentación

✅ **Especificación completa OpenAPI 3.0**
- Todos los endpoints documentados
- Esquemas JSON para request/response
- Ejemplos realistas

✅ **Autenticación integrada**
- Bearer token JWT
- Soporte directo en Swagger

✅ **Códigos de error detallados**
- Cada endpoint especifica qué errores puede retornar
- Ejemplos de respuestas de error

✅ **Fácil de mantener**
- Un único archivo `swagger.js`
- Cambios reflejados inmediatamente

✅ **Interfaz moderna**
- Swagger UI 4.x
- Responsive y fácil de usar
- Pruebas interactivas

---

**🎉 ¡Documentación lista para usar!**

Abre: `http://localhost:3000/api-docs`

**Fecha**: 2026-07-02  
**Versión**: 1.0  
**Estado**: ✅ Producción
