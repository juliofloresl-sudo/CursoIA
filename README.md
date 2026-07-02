# 🛒 Sistema de Punto de Venta (POS) - Ferretería

> Sistema completo de gestión para punto de venta de ferretería con control de inventario, ventas, devoluciones y corte de caja.

[![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)]()
[![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)]()
[![Licencia](https://img.shields.io/badge/Licencia-MIT-green)]()
[![Node](https://img.shields.io/badge/Node-18%2B-green)]()
[![React](https://img.shields.io/badge/React-19-blue)]()

---

## 📋 Tabla de contenidos

- [Descripción del proyecto](#-descripción-del-proyecto)
- [Características principales](#-características-principales)
- [Stack tecnológico](#-stack-tecnológico)
- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Cómo ejecutar en desarrollo](#-cómo-ejecutar-en-desarrollo)
- [Scripts disponibles](#-scripts-disponibles)
- [Testing](#-testing)
- [Documentación API](#-documentación-api)
- [Troubleshooting](#-troubleshooting)
- [Contribuciones](#-contribuciones)

---

## 📌 Descripción del proyecto

Sistema integral de Punto de Venta (POS) diseñado específicamente para ferreterías. Digitaliza y centraliza operaciones de:

- **Ventas**: Registro de transacciones en tiempo real con múltiples métodos de pago
- **Inventario**: Control de existencias, alertas de stock bajo y movimientos
- **Productos**: Catálogo completo con categorías, precios y costos
- **Corte de caja**: Cierre de turno con conciliación de efectivo
- **Devoluciones**: Gestión de devoluciones y reembolsos
- **Reportes**: Visibilidad en tiempo real del negocio

### Objetivo

Reemplazar procesos manuales propensos a errores, mejorar la precisión operacional y proporcionar datos para toma de decisiones.

---

## ✨ Características principales

### 🏪 Módulo de Ventas
- ✅ Registro de transacciones rápido y eficiente
- ✅ Soporte para múltiples métodos de pago (efectivo, tarjeta, transferencia)
- ✅ Aplicación de descuentos con control de permisos
- ✅ Cálculo automático de impuestos (IVA configurable)
- ✅ Generación de tickets con folio consecutivo
- ✅ Gestión de devoluciones integrada

### 📦 Módulo de Inventario
- ✅ Control de stock en tiempo real
- ✅ Alertas automáticas de stock bajo
- ✅ Movimientos de entrada/salida trazables
- ✅ Ajustes manuales con justificación
- ✅ Historial completo de movimientos

### 🏷️ Módulo de Productos
- ✅ Catálogo completo con categorización
- ✅ Precios de venta y costo independientes
- ✅ Búsqueda por nombre o SKU
- ✅ Gestión de categorías
- ✅ Activación/desactivación de productos
- ✅ Historial de cambios de precio

### 📊 Módulo de Corte de Caja
- ✅ Cierre automático de turno
- ✅ Conciliación de efectivo
- ✅ Resumen de ventas del día
- ✅ Reporte de múltiples métodos de pago
- ✅ Justificación de diferencias
- ✅ Historial de cortes

### 🔐 Seguridad
- ✅ Autenticación con JWT
- ✅ Control de roles (cajero, admin, supervisor, encargado inventario)
- ✅ Permisos granulares por endpoint
- ✅ Encriptación de contraseñas (bcryptjs)
- ✅ Headers de seguridad (Helmet)

---

## 🛠️ Stack tecnológico

### Backend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express** | 5.2.1 | Framework web |
| **Supabase** | 2.110.0 | Base de datos PostgreSQL |
| **JWT** | 9.0.3 | Autenticación |
| **bcryptjs** | 3.0.3 | Encriptación contraseñas |
| **Helmet** | 8.2.0 | Seguridad HTTP |
| **Morgan** | 1.11.0 | Logging de requests |
| **Zod** | 4.4.3 | Validación de esquemas |
| **CORS** | 2.8.6 | Manejo de CORS |
| **Swagger UI** | 4.6.0 | Documentación API |

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 19.2.7 | Framework UI |
| **Vite** | 8.1.1 | Build tool |
| **React Router** | 7.18.1 | Routing |
| **Axios** | 1.18.1 | HTTP client |
| **Lucide React** | 1.23.0 | Iconografía |
| **Zod** | 4.4.3 | Validación |

### Testing
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Jest** | 29.7.0 | Testing framework |
| **Babel** | 7.29.7 | Transpilación ES6+ |

### Base de datos
- **PostgreSQL** (via Supabase)
- Tablas: usuarios, productos, categorías, ventas, detalles_venta, turnos, cortes_caja, movimientos_inventario, etc.

---

## 📦 Requisitos previos

Antes de instalar, asegúrate de tener:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (o yarn)
- **Git**
- **Cuenta en Supabase** (base de datos PostgreSQL)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Verificar versiones

```bash
# Verificar Node.js
node --version
# v18.x.x o superior

# Verificar npm
npm --version
# 9.x.x o superior
```

---

## 📥 Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd CursoIA/PuntoDeVenta
```

### 2. Instalar dependencias

#### Backend
```bash
cd Backend
npm install
```

#### Frontend
```bash
cd FrontEnd
npm install
```

### 3. Configurar variables de entorno

Ver sección [Variables de entorno](#-variables-de-entorno)

### 4. Inicializar base de datos

```bash
# Supabase proporciona un script SQL en Backend/database/schema.sql
# Ejecuta el script en tu proyecto de Supabase
```

---

## 🔑 Variables de entorno

### Backend - Archivo `.env`

Crea un archivo `.env` en el directorio `Backend/` con las siguientes variables:

```bash
# 🌐 Servidor
PORT=3000
NODE_ENV=development

# 🗄️ Base de datos Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# 🔐 JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
JWT_EXPIRY=7d

# 💰 Configuración de negocio
IVA_RATE=0.16
MAX_DISCOUNT_PERCENT=10

# 📧 (Opcional) Email para notificaciones
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_contraseña_aqui
```

### Frontend - Archivo `.env`

Crea un archivo `.env` en el directorio `FrontEnd/` con:

```bash
# 🌐 API
VITE_API_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=10000

# 🌐 Ambiente
VITE_ENV=development
```

### Obtener credenciales Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto o selecciona uno existente
3. En **Settings → API**, copia:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Pega en tu archivo `.env`

---

## 📂 Estructura del proyecto

```
CursoIA/PuntoDeVenta/
│
├── Backend/                          # 🔧 API REST Node.js/Express
│   ├── src/
│   │   ├── app.js                    # Configuración de Express
│   │   ├── config/
│   │   │   ├── env.js                # Variables de entorno
│   │   │   ├── supabase.js           # Cliente Supabase
│   │   │   └── swagger.js            # Configuración Swagger/OpenAPI
│   │   ├── controllers/              # Lógica de negocio
│   │   │   ├── auth-controller.js
│   │   │   ├── product-controller.js
│   │   │   ├── sale-controller.js
│   │   │   ├── turn-controller.js
│   │   │   ├── cash-close-controller.js
│   │   │   ├── category-controller.js
│   │   │   └── inventory-controller.js
│   │   ├── models/                   # Modelos de datos
│   │   │   ├── user-model.js
│   │   │   ├── product-model.js
│   │   │   ├── sale-model.js
│   │   │   ├── turn-model.js
│   │   │   └── category-model.js
│   │   ├── routes/                   # Rutas API
│   │   │   ├── auth-routes.js
│   │   │   ├── product-routes.js
│   │   │   ├── sale-routes.js
│   │   │   ├── turn-routes.js
│   │   │   ├── cash-close-routes.js
│   │   │   ├── category-routes.js
│   │   │   ├── inventory-routes.js
│   │   │   └── return-routes.js
│   │   ├── middleware/               # Middleware Express
│   │   │   ├── auth.js               # Autenticación JWT
│   │   │   ├── error-handler.js      # Manejo de errores
│   │   │   └── validate.js           # Validación con Zod
│   │   ├── lib/
│   │   │   └── folio-generator.js    # Generador de folios
│   │   └── utils/
│   │       └── response.js           # Utilidades de respuesta
│   ├── database/
│   │   └── schema.sql                # Script de BD
│   ├── __tests__/                    # Pruebas Jest
│   │   ├── sale-controller.test.js
│   │   ├── cash-close-controller.test.js
│   │   ├── product-model.test.js
│   │   └── integration.test.js
│   ├── babel.config.js               # Configuración Babel
│   ├── jest.config.js                # Configuración Jest
│   ├── package.json
│   ├── server.js                     # Punto de entrada
│   ├── .env                          # ⚠️ Variables de entorno
│   ├── .env.example                  # Plantilla de .env
│   └── .gitignore
│
├── FrontEnd/                         # 🎨 Interfaz React + Vite
│   ├── src/
│   │   ├── main.jsx                  # Punto de entrada
│   │   ├── App.jsx                   # Componente principal
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── sidebar.jsx       # Navegación
│   │   ├── context/
│   │   │   └── auth-context.jsx      # Contexto de autenticación
│   │   ├── features/                 # Módulos por funcionalidad
│   │   │   ├── auth/
│   │   │   │   └── pages/
│   │   │   │       └── login-page.jsx
│   │   │   ├── products/
│   │   │   │   ├── components/
│   │   │   │   │   └── product-form.jsx
│   │   │   │   └── pages/
│   │   │   │       └── product-list-page.jsx
│   │   │   ├── sales/
│   │   │   │   ├── components/
│   │   │   │   │   ├── discount-modal.jsx
│   │   │   │   │   └── return-manager.jsx
│   │   │   │   └── pages/
│   │   │   │       └── pos-terminal-page.jsx
│   │   │   ├── cash-control/
│   │   │   │   ├── components/
│   │   │   │   │   └── cash-opening-modal.jsx
│   │   │   │   └── pages/
│   │   │   │       └── cash-closing-page.jsx
│   │   │   └── inventory/
│   │   │       ├── components/
│   │   │       │   ├── low-stock-alert.jsx
│   │   │       │   └── stock-entry-form.jsx
│   │   │       └── pages/
│   │   │           └── physical-count-page.jsx
│   │   ├── services/
│   │   │   └── api.js                # Cliente HTTP (Axios)
│   │   └── assets/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env                          # ⚠️ Variables de entorno
│   ├── .env.example                  # Plantilla de .env
│   └── .gitignore
│
├── tests/                            # 📋 Pruebas globales
│
├── README.md                         # 👈 Este archivo
├── spec.md                           # Especificación de requerimientos
├── modelo.md                         # Modelo de datos
├── plan.md                           # Plan de desarrollo
├── package.json                      # Root package.json
└── .gitignore

```

### Descripción por carpeta

| Carpeta | Propósito |
|---------|-----------|
| `Backend/src/controllers/` | Lógica de negocio por módulo |
| `Backend/src/models/` | Acceso a base de datos |
| `Backend/src/routes/` | Definición de endpoints |
| `Backend/src/middleware/` | Validación, autenticación, manejo de errores |
| `FrontEnd/src/features/` | Módulos de funcionalidad agrupados |
| `FrontEnd/src/services/` | Integración con API |
| `FrontEnd/src/context/` | Estado global con React Context |

---

## 🚀 Cómo ejecutar en desarrollo

### Opción 1: Ejecutar Backend y Frontend por separado

#### Terminal 1 - Backend

```bash
cd Backend
npm install              # Primera vez
npm start               # Inicia el servidor
```

El servidor estará disponible en `http://localhost:3000`

Endpoints de prueba:
- Health: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/api-docs`

#### Terminal 2 - Frontend

```bash
cd FrontEnd
npm install              # Primera vez
npm run dev             # Inicia servidor Vite
```

La aplicación estará disponible en `http://localhost:5173`

### Opción 2: Desde la raíz con npm workspaces (recomendado)

```bash
# Instalar todo
npm install

# Ejecutar ambos en paralelo
npm start
```

---

## 📜 Scripts disponibles

### Backend

```bash
cd Backend

# Desarrollo
npm start                    # Inicia el servidor

# Testing
npm test                    # Ejecuta todas las pruebas
npm run test:watch         # Modo watch (reinicia en cambios)
npm run test:coverage      # Genera reporte de cobertura

# Linting (si está configurado)
npm run lint               # Valida código
npm run lint:fix           # Corrige automáticamente
```

### Frontend

```bash
cd FrontEnd

# Desarrollo
npm run dev                # Inicia servidor Vite (puerto 5173)

# Build
npm run build              # Construye para producción

# Preview
npm run preview            # Previsualizacion de build local

# Linting
npm run lint              # Valida código
```

---

## 🧪 Testing

### Backend con Jest

Las pruebas incluyen:
- ✅ **Unit tests**: Modelos y servicios individuales
- ✅ **Integration tests**: Flujos completos (venta + corte de caja)
- ✅ **Mock tests**: Con jest.mock() de dependencias externas

```bash
cd Backend

# Ejecutar todas las pruebas
npm test

# Modo watch (reinicia al cambiar archivos)
npm run test:watch

# Con cobertura
npm run test:coverage

# Prueba específica
npm test -- sale-controller.test.js
```

### Cobertura esperada

- ✅ Stock insuficiente al vender
- ✅ Cálculo de totales de venta (subtotal + IVA)
- ✅ Corte de caja (diferencia de efectivo)
- ✅ Validación de roles

---

## 📚 Documentación API

### Swagger UI (Documentación interactiva)

Una vez que el backend esté corriendo:

```
http://localhost:3000/api-docs
```

Características:
- ✅ Especificación OpenAPI 3.0
- ✅ 23+ endpoints documentados
- ✅ Ejemplos de request/response
- ✅ Autenticación JWT integrada
- ✅ Pruebas interactivas ("Try it out")

### Archivos de documentación

- `Backend/SWAGGER.md` - Guía completa en Markdown
- `Backend/SWAGGER_GUIDE.html` - Guía visual interactiva
- `Backend/SETUP_SWAGGER.md` - Setup y personalización

### Script de prueba

```bash
cd Backend
bash test-api.sh         # Verifica servidor, muestra rutas, ejemplos
```

---

## 🔄 Flujo de trabajo recomendado

### 1. Desarrollo local

```bash
# Terminal 1: Backend
cd Backend && npm install && npm start

# Terminal 2: Frontend
cd FrontEnd && npm install && npm run dev

# Terminal 3: Cambios en archivo
git status
git add .
git commit -m "descripción"
```

### 2. Testing

```bash
# Antes de hacer push
cd Backend && npm test
cd FrontEnd && npm run lint
```

### 3. Build para producción

```bash
# Backend
cd Backend
# Configurar variables de entorno de producción
npm start

# Frontend
cd FrontEnd
npm run build
# Esto crea la carpeta 'dist/' lista para deployment
```

---

## 🐛 Troubleshooting

### Backend

#### Error: "Cannot find module"
```bash
# Solución: Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Puerto 3000 ya está en uso
```bash
# Opción 1: Cambiar puerto en .env
PORT=3001

# Opción 2: Encontrar proceso y terminarlo
lsof -i :3000
kill -9 <PID>
```

#### Error de conexión a Supabase
```bash
# Verificar:
1. SUPABASE_URL en .env (debe tener https://)
2. SUPABASE_ANON_KEY (debe estar completa)
3. Conexión a internet
4. Base de datos Supabase activa
```

### Frontend

#### Error: "Cannot find module '@/**'"
```bash
# Solución: Reiniciar servidor Vite
npm run dev
```

#### Puerto 5173 ya está en uso
```bash
# Vite intentará usar el siguiente puerto disponible automáticamente
# O especificar uno:
npm run dev -- --port 5174
```

#### CORS error desde Frontend
```bash
# Verificar que Backend tenga CORS habilitado:
# Backend/src/app.js debe tener:
app.use(cors());

# Si sigue fallando, usar URLs iguales:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### General

#### Git clone no funciona
```bash
# Verificar credenciales SSH o usar HTTPS
git clone https://github.com/...

# O configurar SSH
ssh-keygen -t ed25519
# Agregar clave pública a GitHub
```

#### npm install falla
```bash
# Limpiar caché de npm
npm cache clean --force

# Intentar de nuevo
npm install
```

---

## 📞 Recursos y documentación

### Documentación oficial
- [Node.js docs](https://nodejs.org/docs/)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/docs)
- [JWT](https://jwt.io/)

### Guías incluidas
- `spec.md` - Especificación de requerimientos
- `modelo.md` - Modelo de datos
- `plan.md` - Plan de desarrollo
- `Backend/SWAGGER.md` - Documentación API
- `Backend/SWAGGER_GUIDE.html` - Guía visual API

---

## 🤝 Contribuciones

Para contribuir al proyecto:

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nombre-feature`)
3. **Commit** tus cambios (`git commit -m 'Agrega feature'`)
4. **Push** a la rama (`git push origin feature/nombre-feature`)
5. **Abre** un Pull Request

### Estándares de código

- ✅ Usar ES6+ modules
- ✅ Nombres descriptivos en inglés para variables y funciones
- ✅ Comentarios para lógica compleja
- ✅ Pasar linter y tests
- ✅ Actualizar documentación

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver archivo `LICENSE` para detalles.

---

## 👨‍💼 Autor

**Desarrollo:** Análisis de Requerimientos  
**Versión:** 1.0.0  
**Fecha:** 2026-07-02  
**Estado:** En desarrollo

---

## ✅ Checklist de configuración inicial

- [ ] Cloné el repositorio
- [ ] Instalé Node.js 18+
- [ ] Instalé dependencias Backend: `cd Backend && npm install`
- [ ] Instalé dependencias Frontend: `cd FrontEnd && npm install`
- [ ] Creé archivo `.env` en Backend con credenciales Supabase
- [ ] Creé archivo `.env` en FrontEnd
- [ ] Ejecuté schema.sql en Supabase
- [ ] Inicié Backend: `npm start` en Backend/
- [ ] Inicié Frontend: `npm run dev` en FrontEnd/
- [ ] Accedí a `http://localhost:3000/api-docs` para verificar
- [ ] Accedí a `http://localhost:5173` para ver la app

---

<div align="center">

**¿Necesitas ayuda?** 📧 Contacta al equipo de desarrollo

**¿Encontraste un bug?** 🐛 Abre un issue en GitHub

**¿Tienes sugerencias?** 💡 Abre una discusión

---

Made with ❤️ for retail businesses

</div>
