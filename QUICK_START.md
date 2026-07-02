# 🚀 Guía rápida de inicio - 5 minutos

Sigue estos pasos para tener el proyecto corriendo localmente.

## ✅ Paso 1: Verificar requisitos

```bash
node --version    # Debe ser 18+
npm --version     # Debe ser 9+
git --version
```

Si no los tienes, instala desde:
- Node.js: https://nodejs.org/ (descarga LTS)
- Git: https://git-scm.com/

## ✅ Paso 2: Clonar repositorio

```bash
git clone <URL_DEL_REPO>
cd CursoIA/PuntoDeVenta
```

## ✅ Paso 3: Obtener credenciales Supabase

1. Ve a https://supabase.com/
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. En **Settings → API**, copia:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
5. Guarda estos valores en un lugar seguro

## ✅ Paso 4: Configurar Backend

```bash
cd Backend

# Copiar plantilla de .env
cp .env.example .env

# Editar .env con tus valores
# SUPABASE_URL=https://tu-proyecto.supabase.co
# SUPABASE_ANON_KEY=tu_anon_key
# SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
# JWT_SECRET=tu_secreto_jwt (generar con: openssl rand -base64 32)

# Instalar dependencias
npm install

# Ejecutar schema.sql en Supabase (copiar contenido de database/schema.sql)
```

## ✅ Paso 5: Configurar Frontend

```bash
cd ../FrontEnd

# Copiar plantilla de .env
cp .env.example .env

# Editar .env con:
# VITE_API_URL=http://localhost:3000/api/v1

# Instalar dependencias
npm install
```

## ✅ Paso 6: Ejecutar proyecto

### Opción A: Dos terminales (recomendado para desarrollo)

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
# Esperado: "Server running on port 3000"
```

**Terminal 2 - Frontend:**
```bash
cd FrontEnd
npm run dev
# Esperado: "Local: http://localhost:5173/"
```

### Opción B: Una terminal con npm workspaces

```bash
npm start
# Ejecuta ambos en paralelo
```

## ✅ Paso 7: Verificar que funciona

Abre en tu navegador:
- **Frontend**: http://localhost:5173
- **API Health**: http://localhost:3000/health
- **Swagger API Docs**: http://localhost:3000/api-docs

## 🎯 Primeros pasos en la app

1. **Login** (si hay usuarios de prueba en BD)
   - Email: admin@ferreteria.com
   - Password: (check en BD Supabase)

2. **Crear un turno** (si eres cajero)
   - Ve a Turnos
   - Abre nuevo turno

3. **Registrar una venta** (si eres cajero)
   - Ve a POS Terminal
   - Agrega productos
   - Completa venta

4. **Cierre de caja** (si eres supervisor)
   - Ve a Corte de Caja
   - Completa datos
   - Realiza corte

## 🐛 Problemas comunes

### "Cannot connect to Supabase"
- Verifica SUPABASE_URL incluya https://
- Copia completa la ANON_KEY
- Verifica conexión a internet

### "Port 3000 already in use"
```bash
# Usa otro puerto
PORT=3001 npm start
```

### "npm install falla"
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### "Module not found: swagger.js"
- Asegúrate que el archivo existe: Backend/src/config/swagger.js
- Reinicia terminal

## 📚 Documentación

- `README.md` - Documentación completa
- `Backend/SWAGGER.md` - Guía API
- `Backend/SWAGGER_GUIDE.html` - UI visual de API
- `spec.md` - Especificación funcional
- `modelo.md` - Modelo de datos

## 💡 Tips

- **Hotreload**: Ambos (Backend y Frontend) se recargan al guardar
- **Swagger**: Prueba todos los endpoints en http://localhost:3000/api-docs
- **DevTools**: Abre DevTools del navegador (F12) para ver errores
- **Logs**: Mira la terminal para ver logs del servidor

## 🔑 Generar JWT_SECRET seguro

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
```

---

¿Todavía hay problemas? 📖 Lee `README.md` sección **Troubleshooting**

**Versión**: 1.0  
**Fecha**: 2026-07-02
