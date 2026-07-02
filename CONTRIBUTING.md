# 🤝 Guía de contribuciones

¡Gracias por tu interés en contribuir al proyecto de Punto de Venta! Aquí están las pautas para ayudarte a contribuir efectivamente.

## Antes de comenzar

1. Lee `README.md` para entender la estructura del proyecto
2. Lee `spec.md` para entender los requerimientos
3. Famiarízate con el stack: Express, React, Supabase

## Cómo contribuir

### 1. Reportar bugs 🐛

Si encuentras un bug:

1. **Verifica** que no sea un problema conocido en GitHub Issues
2. **Describe** claramente:
   - Qué esperabas que sucediera
   - Qué sucedió en realidad
   - Pasos para reproducir
   - Tu ambiente (SO, Node, navegador)

Ejemplo:
```
Título: Login falla con email con caracteres especiales

Descripción:
Al intentar hacer login con email: "usuario+alias@example.com"
se obtiene error 400.

Esperado: Login exitoso
Actual: Error 400 "Invalid email format"

Pasos:
1. Ir a login
2. Ingresar: usuario+alias@example.com
3. Ingresar contraseña
4. Ver error
```

### 2. Sugerir mejoras 💡

Para sugerir una nueva feature:

1. Abre un Issue con etiqueta `enhancement`
2. Describe:
   - Problema que resuelve
   - Solución propuesta
   - Ejemplos de uso
   - Impacto estimado

### 3. Contribuir código 👨‍💻

#### Flujo de trabajo

```bash
# 1. Fork el repositorio (botón Fork en GitHub)

# 2. Clonar tu fork
git clone https://github.com/TU_USUARIO/PuntoDeVenta.git
cd PuntoDeVenta

# 3. Crear rama para tu feature
git checkout -b feature/nombre-descriptivo

# 4. Hacer cambios
# Edita archivos según corresponda

# 5. Probar cambios
cd Backend && npm test          # Backend
cd ../FrontEnd && npm run lint  # Frontend

# 6. Commit
git add .
git commit -m "descripción clara del cambio"

# 7. Push a tu fork
git push origin feature/nombre-descriptivo

# 8. Crear Pull Request en GitHub
# Describe cambios y referencias a Issues
```

#### Estándares de código

**Backend (JavaScript/Node.js)**
```javascript
// ✅ BIEN
export const handleSale = async (req, res, next) => {
  try {
    const { lineas, metodo_pago } = req.body;
    
    // Validar
    if (!lineas || lineas.length === 0) {
      const error = new Error('Líneas de venta requeridas');
      error.statusCode = 400;
      throw error;
    }
    
    // Lógica
    const sale = await saleModel.createSale(saleData);
    
    return res.status(201).json({ success: true, data: sale });
  } catch (error) {
    return next(error);
  }
};

// ❌ EVITAR
const handleSale = (req, res) => {
  var lines = req.body.lineas;  // var es legacy
  let result = model.create(lines);  // sin await
  res.send(result);  // sin status
};
```

**Frontend (React/JavaScript)**
```javascript
// ✅ BIEN
export const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await api.get('/ventas');
      setSales(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {/* Render */}
    </div>
  );
};

// ❌ EVITAR
const SalesList = () => {
  const [state, setState] = useState(null);  // nombre vago
  
  // No gestionar loading/error separadamente
  // Lógica directa en render
  api.get('/ventas').then(...);  // sin try/catch
};
```

**Nomenclatura**
```javascript
// Variables/funciones: camelCase
const userName = 'Juan';
function calculateTotal(items) { }

// Constantes: UPPER_SNAKE_CASE
const MAX_DISCOUNT_PERCENT = 10;
const DEFAULT_TIMEOUT = 5000;

// Componentes React: PascalCase
export const ProductList = () => {};
export const CashCloseModal = () => {};

// Archivos: kebab-case
// product-controller.js
// cash-close-routes.js
```

#### Commits

```bash
# Mensaje claro y descriptivo
git commit -m "Agregar validación de stock en creación de venta"
git commit -m "Fijar bug: descuento negativo en corte de caja"
git commit -m "Refactorizar: extraer lógica de cálculo a función"

# ❌ Evitar
git commit -m "fix"
git commit -m "updates"
git commit -m "cambios varios"
```

#### Testing

Antes de crear un Pull Request, asegúrate de que:

```bash
# Backend
cd Backend
npm test                    # Todas las pruebas pasan
npm run test:coverage      # Coverage adecuado (>80%)

# Frontend (si hay tests)
cd FrontEnd
npm run lint               # Sin errores de linting
```

### 4. Crear un Pull Request (PR)

En GitHub:

1. **Título claro**: "Agregar validación de stock" (no "fixes #123")
2. **Descripción**:
   ```markdown
   ## Descripción
   Implementa validación para prevenir ventas con stock insuficiente
   
   ## Tipo de cambio
   - [ ] Bug fix
   - [x] New feature
   - [ ] Breaking change
   
   ## Testing
   - [x] Pruebas unitarias agregadas
   - [x] Pruebas de integración
   - [x] Manual testing realizado
   
   ## Checklist
   - [x] Mi código sigue los estándares del proyecto
   - [x] He ejecutado linter y tests
   - [x] He actualizado la documentación
   - [x] Sin dependencias no documentadas
   ```

3. **Referencias**: Link a Issues relacionados
   ```
   Closes #45
   Related to #50
   ```

4. **Esperar review** - Los maintainers revisarán tu PR

## Tipos de contribuciones bienvenidas

### 🐛 Bug fixes
- Verificar que el bug existe
- Agregar tests que lo reproduzcan
- Agregar fix
- Agregar tests que validen el fix

### ✨ Features
- Alinear con `spec.md`
- Código completo (backend + frontend)
- Documentación actualizada
- Tests incluidos

### 📚 Documentación
- Errores en README.md
- Ejemplos mejorados
- Claridad en instrucciones
- Typos y gramática

### 🔧 Refactoring
- Mejorar performance
- Simplificar código
- Eliminar código muerto
- Mejorar mantenibilidad

## Revisión de código

Cuando revisar un PR, busca:

### Funcionalidad
- ¿Funciona correctamente?
- ¿Maneja casos edge?
- ¿Hay manejo de errores?

### Código
- ¿Sigue los estándares?
- ¿Es legible?
- ¿Hay duplicación?

### Tests
- ¿Hay tests?
- ¿Cubren casos importantes?
- ¿Pasan todos?

### Documentación
- ¿Está documentado?
- ¿Hay comentarios donde es necesario?
- ¿Se actualizó README?

## Estructura para agregar una feature

Si quieres agregar una feature completa:

### Backend
```
Backend/src/
├── controllers/your-feature-controller.js
├── models/your-feature-model.js
├── routes/your-feature-routes.js
├── middleware/your-validation.js (si es necesario)
└── __tests__/your-feature.test.js
```

### Frontend
```
FrontEnd/src/features/
├── your-feature/
│   ├── components/
│   │   ├── YourFeatureForm.jsx
│   │   └── YourFeatureList.jsx
│   ├── pages/
│   │   └── YourFeaturePage.jsx
│   └── hooks/
│       └── useYourFeature.js (si es necesario)
```

## Comunicación

- **Issues**: Para bugs y features
- **Discussions**: Para preguntas y brainstorming
- **Pull Requests**: Para cambios de código
- **Email**: Para asuntos sensibles

## Código de conducta

- ✅ Sé respetuoso
- ✅ Sé constructivo
- ✅ Sé inclusivo
- ❌ No spam
- ❌ No discriminación
- ❌ No acoso

## Preguntas frecuentes

**P: ¿Puedo trabajar en feature X?**
A: Abre un Issue first para coordinar y evitar duplicados

**P: ¿Cuánto tarda la revisión?**
A: Depende de complejidad, usualmente 1-3 días

**P: ¿Mi PR fue rechazado, ¿qué hago?**
A: Lee los comentarios, pregunta si no entiendes, e itera

**P: ¿Necesito cambiar mucho?**
A: A veces sí, es parte del proceso. ¡Estamos aquí para ayudar!

## Gracias 🙏

¡Cada contribución, grande o pequeña, es valiosa!

---

**Última actualización**: 2026-07-02  
**Versión**: 1.0
