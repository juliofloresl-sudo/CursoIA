#!/bin/bash

# Script de prueba interactiva de endpoints de la API

API_URL="http://localhost:3000"
TOKEN=""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║    Script de Prueba - API Punto de Venta                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que el servidor esté corriendo
echo "🔍 Verificando estado del servidor..."
if ! curl -s -f "$API_URL/health" > /dev/null; then
  echo "❌ El servidor no está corriendo en $API_URL"
  echo "   Inicia el servidor con: npm start"
  exit 1
fi
echo "✅ Servidor activo en $API_URL"
echo ""

# Mostrar rutas disponibles
echo "📋 Rutas disponibles:"
echo "   - 🏥 Health: GET $API_URL/health"
echo "   - 📚 Swagger: $API_URL/api-docs"
echo "   - 🔐 Auth: $API_URL/api/v1/auth"
echo "   - 📦 Productos: $API_URL/api/v1/productos"
echo "   - 🏷️  Categorías: $API_URL/api/v1/categorias"
echo "   - 💰 Ventas: $API_URL/api/v1/ventas"
echo "   - 📊 Cortes: $API_URL/api/v1/cortes"
echo "   - 📈 Inventario: $API_URL/api/v1/inventario"
echo "   - ⏰ Turnos: $API_URL/api/v1/turnos"
echo ""

# 1. Test Health
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Probando endpoint /health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "$API_URL/health" | jq '.' 2>/dev/null || echo "Response: OK"
echo ""

# 2. Test Login (si hay credenciales de prueba)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Para obtener token JWT, usa:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "POST /api/v1/auth/login"
echo "Body:"
echo "{"
echo '  "email": "tu_email@ferreteria.com",'
echo '  "password": "tu_contraseña"'
echo "}"
echo ""

# 3. Instrucciones para acceder a Swagger
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Acceder a Swagger UI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Abre en tu navegador:"
echo "   $API_URL/api-docs"
echo ""
echo "📝 En Swagger:"
echo "   1. Haz clic en 'Authorize' (botón azul)"
echo "   2. Ingresa: Bearer YOUR_JWT_TOKEN"
echo "   3. Haz clic en un endpoint"
echo "   4. Haz clic en 'Try it out'"
echo "   5. Completa los parámetros"
echo "   6. Haz clic en 'Execute'"
echo ""

# 4. Ejemplos de uso con curl
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Ejemplos de uso con cURL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Listar productos:"
echo "   curl $API_URL/api/v1/productos"
echo ""
echo "📚 Listar categorías:"
echo "   curl $API_URL/api/v1/categorias"
echo ""
echo "🔒 Con autenticación:"
echo "   curl -H 'Authorization: Bearer YOUR_TOKEN' $API_URL/api/v1/auth/me"
echo ""

# 5. Estructura de respuesta
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Estructura estándar de respuestas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Respuesta exitosa (200/201):"
echo "{"
echo '  "success": true,'
echo '  "data": { ... }'
echo "}"
echo ""
echo "❌ Respuesta con error (4xx/5xx):"
echo "{"
echo '  "success": false,'
echo '  "error": "Mensaje de error",'
echo '  "statusCode": 400'
echo "}"
echo ""

# 6. Códigos de error
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  Códigos de error comunes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "200 OK           - Solicitud exitosa (GET/PATCH)"
echo "201 Created      - Recurso creado (POST)"
echo "400 Bad Request  - Parámetros inválidos"
echo "401 Unauthorized - Token faltante o inválido"
echo "403 Forbidden    - Rol insuficiente"
echo "404 Not Found    - Recurso no encontrado"
echo "409 Conflict     - Conflicto (ej: stock insuficiente)"
echo "500 Server Error - Error interno del servidor"
echo ""

# 7. Autenticación
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  Información de autenticación"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Roles disponibles:"
echo "  • cajero                 - Registra ventas"
echo "  • administrador          - Gestiona productos y usuarios"
echo "  • supervisor             - Realiza cortes de caja"
echo "  • encargado_inventario   - Gestiona inventario"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ ¡Documentación interactiva lista!"
echo "   Abre: $API_URL/api-docs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
