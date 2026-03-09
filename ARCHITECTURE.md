# 🏗️ Arquitectura del Proyecto

## Visión General

"Arte en mis manos" es una Progressive Web App (PWA) construida con tecnologías web nativas (HTML, CSS, JavaScript) siguiendo principios de arquitectura moderna, escalabilidad y mantenibilidad.

## Principios de Diseño

### 1. **Mobile First**
- Diseñado primero para dispositivos móviles
- Media queries progresivas para pantallas más grandes
- Interacciones táctiles optimizadas

### 2. **Progressive Enhancement**
- Funcionalidad básica sin JavaScript
- Mejoras progresivas con JS habilitado
- Graceful degradation para navegadores antiguos

### 3. **Modularidad**
- Código organizado en módulos reutilizables
- Separación de responsabilidades (SoC)
- Componentes independientes y testables

### 4. **Performance First**
- Lazy loading de imágenes
- Código minificado (producción)
- Caching inteligente con Service Worker
- Optimización de assets

## Arquitectura de Frontend

### Estructura de Capas

```
┌─────────────────────────────────────┐
│         Presentation Layer           │
│    (HTML Templates + CSS Styles)    │
├─────────────────────────────────────┤
│        Application Layer            │
│  (app.js, ui.js, booking.js)       │
├─────────────────────────────────────┤
│          Data Layer                 │
│    (api.js + LocalStorage)          │
├─────────────────────────────────────┤
│         Service Layer               │
│  (Service Worker + Caching)         │
└─────────────────────────────────────┘
```

### Componentes Principales

#### 1. **Core Application (app.js)**
- Inicialización de la aplicación
- Gestión de estado global
- Carga de datos iniciales
- Event delegation
- PWA setup

#### 2. **UI Layer (ui.js)**
- Animaciones y transiciones
- Efectos visuales
- Micro-interacciones
- Scroll effects
- Lazy loading

#### 3. **Booking System (booking.js)**
- Gestión de reservas
- Validación de formularios
- Modal management
- WhatsApp integration
- Disponibilidad de horarios

#### 4. **API Layer (api.js)**
- Abstracción de datos
- LocalStorage como backend temporal
- Preparado para integración con API real
- CRUD operations
- Promise-based architecture

#### 5. **Authentication (auth.js)**
- Sistema de login
- Gestión de sesiones
- Protección de rutas
- User state management

## Gestión de Estado

### Estado Global (app object)
```javascript
app = {
    currentUser: null,      // Usuario autenticado
    services: [],           // Catálogo de servicios
    appointments: [],       // Lista de citas
    gallery: [],           // Galería de imágenes
    deferredPrompt: null   // Prompt de instalación PWA
}
```

### Persistencia
- **LocalStorage**: Datos del usuario, servicios, citas
- **SessionStorage**: Estado temporal de sesión
- **Service Worker Cache**: Assets estáticos y runtime cache

## PWA Architecture

### Service Worker Strategy

#### Precaching
- HTML, CSS, JS principales
- Assets críticos
- Fuentes web

#### Runtime Caching
```
Cache First → Assets estáticos (CSS, JS, imágenes)
Network First → API calls, datos dinámicos
Stale While Revalidate → HTML pages
```

#### Offline Fallback
- Páginas offline básicas
- Mensajes informativos
- Datos en caché disponibles

### App Shell Pattern
```
┌────────────────────────────┐
│        Header              │  ← Cached
├────────────────────────────┤
│                            │
│    Dynamic Content         │  ← Network/Cache
│                            │
├────────────────────────────┤
│        Footer              │  ← Cached
└────────────────────────────┘
```

## Diseño CSS

### Metodología

**CSS Variables + BEM-like Naming**
```css
:root {
    --color-primary: #FF6B9D;
    /* ... */
}

.service-card { }
.service-card__title { }
.service-card--featured { }
```

### Sistema de Grid

```
Mobile:    1 columna
Tablet:    2-3 columnas
Desktop:   3-4 columnas
```

### Responsive Breakpoints
```css
Mobile:     < 768px
Tablet:     768px - 1024px
Desktop:    > 1024px
Large:      > 1440px
```

## Data Flow

### Cliente (User Flow)
```
Usuario → Landing Page → Servicios
                       ↓
               Reservar Cita
                       ↓
               Modal Booking
                       ↓
            Validación + Submit
                       ↓
         LocalStorage + WhatsApp
                       ↓
              Confirmación
```

### Admin (Management Flow)
```
Admin Login → Dashboard → Ver Estadísticas
                        ↓
            Gestionar Citas/Servicios
                        ↓
              CRUD Operations
                        ↓
           Update LocalStorage
                        ↓
            Reload UI Data
```

## Security

### Implementaciones Actuales
- XSS Prevention: Sanitización de inputs
- CSRF: No aplicable (no hay backend)
- Validación client-side
- Protected admin routes

### Recomendaciones para Producción
- Implementar backend con autenticación JWT
- HTTPS obligatorio (GitHub Pages lo incluye)
- Rate limiting para formularios
- Validación server-side
- Sanitización de datos

## Performance Optimizations

### Implementadas
✅ Lazy loading de imágenes
✅ Service Worker caching
✅ CSS/JS minification (producción)
✅ Async/defer scripts
✅ Preconnect a CDNs externos
✅ Responsive images

### Métricas Objetivo (Lighthouse)
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95
- PWA: 100

## Escalabilidad

### Preparado para:
1. **Backend Integration**
   - API REST endpoints definidos
   - Estructura Promise-based
   - Error handling implementado

2. **Database Migration**
   - Fácil transición de LocalStorage a DB
   - Schema definido en código

3. **Features Adicionales**
   - Sistema modular permite agregar features
   - Componentes independientes
   - Event-driven architecture

### Consideraciones Futuras
- State management con Redux/Zustand
- SSR con Next.js/Nuxt
- GraphQL para queries complejas
- Real-time con WebSockets
- Analytics integration
- A/B testing framework

## Testing Strategy

### Recomendado Implementar
```javascript
// Unit Tests
- Validación de formularios
- Funciones de utilidad
- Data transformations

// Integration Tests
- API calls
- LocalStorage operations
- Service Worker behavior

// E2E Tests
- User flows completos
- Booking process
- Admin operations
```

### Herramientas Sugeridas
- Jest (Unit testing)
- Cypress (E2E testing)
- Lighthouse CI (Performance)

## Deployment Pipeline

### Desarrollo Local
```
Local Server → Testing → Git commit
```

### Staging (GitHub Pages)
```
Git push → GitHub Actions → Deploy
```

### Producción
```
Main branch → Build → CDN Deploy
```

## Monitoring & Analytics

### Recomendaciones
1. **Google Analytics**: Tracking de usuarios
2. **Sentry**: Error monitoring
3. **Lighthouse CI**: Performance tracking
4. **PWA Stats**: Installation metrics

## Accessibility (a11y)

### Implementado
- Estructura semántica HTML
- ARIA labels donde necesario
- Contraste de colores adecuado
- Keyboard navigation
- Focus states visibles

### Mejoras Futuras
- Screen reader testing completo
- WCAG 2.1 AAA compliance
- Skip navigation links
- Alternativas para animaciones

## Browser Support

### Target
- Chrome/Edge: Últimas 2 versiones
- Firefox: Últimas 2 versiones
- Safari: Últimas 2 versiones
- Mobile Safari: iOS 12+
- Chrome Android: Últimas 2 versiones

### Progressive Enhancement
- Funcionalidad básica: IE11+
- Full features: Modern browsers

## Documentation

### Código
- JSDoc comments en funciones principales
- README completo
- Architecture doc (este archivo)

### Usuario
- Guía de instalación PWA
- Manual de administrador
- FAQ (recomendado agregar)

---

## Conclusión

Esta arquitectura proporciona una base sólida, escalable y mantenible para la PWA "Arte en mis manos". El diseño modular permite futuras expansiones mientras mantiene la simplicidad y performance actuales.

**Última actualización**: 2024-01-01
**Versión**: 1.0.0
