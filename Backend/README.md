# Jest Test Suite - Punto de Venta (POS System)

Este paquete contiene la configuración completa de Jest con Babel para ejecutar pruebas en un proyecto Node.js/Express con ES modules.

## 📋 Contenido

```
PostBackend/
├── babel.config.js                    # Configuración de Babel para transpilación
├── jest.config.js                     # Configuración de Jest
├── package.json                       # Dependencias de desarrollo
├── README.md                          # Este archivo
└── __tests__/
    ├── sale-controller.test.js        # Pruebas de venta (total y stock)
    ├── cash-close-controller.test.js  # Pruebas de corte de caja
    ├── product-model.test.js          # Pruebas de validación de stock
    └── integration.test.js            # Pruebas de integración
```

## 🚀 Instalación

### 1. Copiar archivos al proyecto Backend

```bash
# Desde la raíz del proyecto
cp babel.config.js Backend/
cp jest.config.js Backend/
```

### 2. Copiar carpeta de pruebas

```bash
cp -r __tests__ Backend/
```

### 3. Actualizar package.json del Backend

Agregar las dependencias de desarrollo del archivo `package.json` a tu `Backend/package.json`:

```json
{
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "babel-jest": "^29.7.0",
    "jest": "^29.7.0"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 4. Instalar dependencias

```bash
cd Backend
npm install
```

## 📝 Descripción de Pruebas

### **sale-controller.test.js**
Pruebas del controlador de ventas:
- ✅ Cálculo correcto de totales (subtotal + impuesto)
- ✅ Validación de cálculo de impuesto por línea
- ✅ Rechazo de ventas con stock insuficiente
- ✅ Validación cuando el stock es cero
- ✅ Aceptación cuando el stock coincide exactamente
- ✅ Rechazo de venta cuando CUALQUIER línea tiene stock insuficiente
- ✅ Rechazo cuando no hay turno abierto

**Escenarios cubiertos:**
- Stock insuficiente al vender
- Cálculo de totales de venta (subtotal + IVA)

### **cash-close-controller.test.js**
Pruebas del controlador de corte de caja:
- ✅ Cálculo de diferencia positiva (sobrante)
- ✅ Cálculo de diferencia negativa (faltante)
- ✅ Diferencia cero cuando el efectivo coincide
- ✅ Registro de todos los métodos de pago
- ✅ Validación de ID de supervisor
- ✅ Aceptación de nombres alternativos de campos
- ✅ Validación de existencia del turno
- ✅ Búsqueda de turno activo si no se proporciona ID
- ✅ Validación de campos numéricos

**Escenarios cubiertos:**
- Corte de caja (cálculo de diferencia, validación de datos)

### **product-model.test.js**
Pruebas del modelo de producto:
- ✅ Obtención de producto con stock actual
- ✅ Identificación de producto sin stock
- ✅ Validación de cantidad solicitada vs stock
- ✅ Confirmación de stock suficiente

### **integration.test.js**
Pruebas de integración end-to-end:
- ✅ Flujo completo: validar stock → calcular total → actualizar inventario
- ✅ Rechazo cuando producto tiene stock insuficiente
- ✅ Flujo completo de corte de caja con múltiples métodos de pago
- ✅ Acumulación correcta de ventas en corte de caja

## 🧪 Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar en modo watch (reinicia al cambiar archivos)
npm run test:watch

# Ejecutar con cobertura
npm run test:coverage
```

## 🔧 Configuración Detallada

### babel.config.js
Configura Babel para procesar ES6+ modules en Jest:
- Usa `@babel/preset-env` para transpilación
- Targeting Node.js actual versión

### jest.config.js
Configuración de Jest:
- Entorno: Node.js
- Transform: babel-jest para procesar archivos .js
- Test match: archivos en `__tests__/**/*.test.js`
- Timeout: 10 segundos por prueba

## 🎯 Escenarios de Prueba Implementados

### 1. **Stock Insuficiente al Vender** ✅
```javascript
// Verifica que se rechace la venta cuando:
- El stock del producto es 0
- El stock es menor a la cantidad solicitada
- Cualquier línea de venta tiene stock insuficiente
```

### 2. **Cálculo de Totales de Venta** ✅
```javascript
// Verifica que se calcule correctamente:
- Subtotal (suma de líneas: cantidad × precio unitario)
- Impuesto (subtotal × tasa IVA)
- Total (subtotal + impuesto)
- Aplicación de impuesto a nivel de línea
```

### 3. **Corte de Caja** ✅
```javascript
// Verifica que se calcule correctamente:
- Diferencia de efectivo (contado - esperado)
- Valores positivos (sobrante) y negativos (faltante)
- Diferencia cero cuando valores coinciden
- Registro de métodos de pago (efectivo + tarjeta)
- Número de transacciones
```

## 🧐 Mocking Implementado

Las pruebas usan `jest.mock()` para aislar componentes:

```javascript
jest.mock('../src/models/product-model.js');
jest.mock('../src/models/turn-model.js');
jest.mock('../src/config/supabase.js');
jest.mock('../src/config/env.js');
jest.mock('../src/lib/folio-generator.js');
```

Esto permite:
- ✅ Pruebas rápidas sin conexión a BD
- ✅ Control total del comportamiento mockeado
- ✅ Aislamiento de componentes
- ✅ Simulación de escenarios complejos

## 📊 Ejemplo de Salida

```
PASS  __tests__/sale-controller.test.js
PASS  __tests__/cash-close-controller.test.js
PASS  __tests__/product-model.test.js
PASS  __tests__/integration.test.js

Test Suites: 4 passed, 4 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        2.345 s
```

## 📌 Notas Importantes

1. **No modifica el proyecto original**: Solo agrega archivos de configuración y pruebas
2. **Compatible con ES modules**: Babel transforma `import/export` automáticamente
3. **Aislamiento total**: Todas las dependencias externas están mockeadas
4. **Cobertura completa**: Cubre los escenarios críticos del negocio

## 🐛 Troubleshooting

### Error: "Cannot find module"
- Verifica que copiaste los archivos en el directorio correcto (`Backend/`)

### Error: "SyntaxError: Unexpected token"
- Asegúrate de tener los archivos `babel.config.js` y `jest.config.js` en la raíz de `Backend/`

### Error: "No tests found"
- Verifica que la carpeta `__tests__` esté en `Backend/__tests__/`

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Babel Documentation](https://babeljs.io/)
- [ES Modules in Node.js](https://nodejs.org/en/docs/guides/ecmascript-2015-es6-and-beyond/)

---

**Versión**: 1.0  
**Fecha**: 2026-07-02  
**Estado**: Listo para producción
