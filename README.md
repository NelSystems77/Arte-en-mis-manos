# 🎨 Arte en mis manos - Progressive Web App

> Aplicación web progresiva (PWA) moderna para salón de uñas profesional con sistema de reservas, catálogo de servicios y panel administrativo.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![PWA](https://img.shields.io/badge/PWA-enabled-purple.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Características Principales

### Para Clientes
- 🎨 **Diseño Moderno**: Interfaz elegante con glassmorphism y gradientes suaves
- 📱 **PWA Instalable**: Funciona como app nativa en móviles y escritorio
- 📅 **Sistema de Reservas**: Reserva citas fácilmente con formulario intuitivo
- 💅 **Catálogo de Servicios**: Explora todos los servicios disponibles
- 🖼️ **Galería de Trabajos**: Visualiza diseños y trabajos realizados
- ⭐ **Testimonios**: Lee experiencias de otras clientas
- 💬 **WhatsApp Integration**: Contacto directo por WhatsApp (+506 8740-9343)
- 🌐 **Modo Offline**: Funcionalidad básica sin conexión a internet

### Para Administradores
- 🔐 **Panel Seguro**: Acceso protegido con credenciales
- 📊 **Dashboard**: Estadísticas y métricas en tiempo real
- 📅 **Gestión de Citas**: Visualiza, edita y elimina reservas
- 💅 **Gestión de Servicios**: CRUD completo de servicios
- ✅ **Estados de Citas**: Pendiente, Confirmada, Completada, Cancelada

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con variables CSS, Grid, Flexbox
- **JavaScript ES6+**: Funcionalidad modular y moderna
- **Service Worker**: Caching y funcionalidad offline
- **Web App Manifest**: Instalación como PWA
- **LocalStorage**: Persistencia de datos

## 📁 Estructura del Proyecto

```
nail-salon-pwa/
├── assets/
│   ├── css/
│   │   ├── styles.css          # Estilos principales
│   │   ├── components.css      # Componentes reutilizables
│   │   └── responsive.css      # Media queries
│   ├── js/
│   │   ├── app.js             # Aplicación principal
│   │   ├── ui.js              # Efectos UI y animaciones
│   │   ├── booking.js         # Sistema de reservas
│   │   ├── api.js             # Módulo de API
│   │   └── auth.js            # Autenticación
│   ├── icons/                  # Iconos PWA (pendiente)
│   └── images/                 # Imágenes del sitio
├── admin/
│   ├── dashboard.html         # Panel principal
│   ├── appointments.html      # Gestión de citas
│   └── services.html          # Gestión de servicios
├── components/                 # Componentes HTML
├── index.html                  # Página principal
├── manifest.json              # PWA Manifest
├── service-worker.js          # Service Worker
└── README.md                   # Este archivo
```

## 🔧 Instalación Local

### Opción 1: Live Server (Recomendado)

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/nail-salon-pwa.git
cd nail-salon-pwa
```

2. **Usar Live Server**
   - Si usas VS Code: Instala la extensión "Live Server"
   - Click derecho en `index.html` → "Open with Live Server"
   - La app se abrirá en `http://localhost:5500`

### Opción 2: Python Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Abre `http://localhost:8000` en tu navegador.

### Opción 3: Node.js Server

```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar servidor
http-server

# O especificar puerto
http-server -p 8080
```

## 🌐 Despliegue en GitHub Pages

### Paso 1: Preparar el Repositorio

1. **Crear repositorio en GitHub**
```bash
# Inicializar git (si no está inicializado)
git init

# Agregar archivos
git add .
git commit -m "Initial commit - Arte en mis manos PWA"

# Conectar con repositorio remoto
git remote add origin https://github.com/tu-usuario/nail-salon-pwa.git

# Subir cambios
git push -u origin main
```

### Paso 2: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click en **Save**
6. Espera unos minutos y tu sitio estará disponible en:
   `https://tu-usuario.github.io/nail-salon-pwa/`

### Paso 3: Actualizar URLs

Después del despliegue, actualiza las siguientes URLs en el código:

1. **manifest.json** - Actualiza `start_url` si es necesario
2. **service-worker.js** - Verifica las rutas de cache
3. **Meta tags Open Graph** - Actualiza las URLs de las imágenes

## 🔐 Credenciales de Administrador

**SuperAdmin**
- Email: `nelson@nelsystems.com`
- Password: `123456789AiDyXm`

Acceso al panel: `https://tu-dominio.com/admin/dashboard.html`

## 📱 Instalación de la PWA

### En Android (Chrome)
1. Abre el sitio web
2. Tap en el menú (⋮)
3. Selecciona "Agregar a pantalla de inicio" o "Instalar app"

### En iOS (Safari)
1. Abre el sitio web en Safari
2. Tap en el botón compartir (⬆️)
3. Desplázate y tap en "Agregar a pantalla de inicio"

### En Desktop (Chrome/Edge)
1. Abre el sitio web
2. Click en el icono de instalación en la barra de direcciones
3. O ve a Menú → "Instalar Arte en mis manos"

## 🎨 Personalización

### Colores
Edita las variables CSS en `assets/css/styles.css`:

```css
:root {
    --color-primary: #FF6B9D;
    --color-secondary: #C5A3FF;
    --color-accent: #FFD700;
    --color-cream: #FFF5F5;
}
```

### Servicios Predeterminados
Modifica el array en `assets/js/app.js`:

```javascript
app.services = [
    {
        id: 1,
        name: 'Tu Servicio',
        description: 'Descripción',
        price: 15000,
        duration: 45,
        icon: '💅'
    }
];
```

### WhatsApp
Actualiza el número en:
- `index.html` - Botones de contacto
- `assets/js/booking.js` - Función `sendWhatsAppConfirmation`

## 📊 Optimización SEO

La aplicación incluye:
- ✅ Meta tags optimizados
- ✅ Open Graph para redes sociales
- ✅ Estructura HTML semántica
- ✅ Sitemap.xml (agregar manualmente)
- ✅ Robots.txt (agregar manualmente)
- ✅ Lazy loading de imágenes
- ✅ Performance optimizada

### Agregar Sitemap.xml

Crea `sitemap.xml` en la raíz:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tu-dominio.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tu-dominio.com/#servicios</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 🔄 Actualizaciones

Para actualizar la app después del despliegue:

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

GitHub Pages se actualizará automáticamente en unos minutos.

**Importante**: Si modificas el Service Worker, incrementa la versión:

```javascript
const CACHE_NAME = 'arte-en-mis-manos-v1.0.1'; // Incrementar versión
```

## 🐛 Solución de Problemas

### La PWA no se instala
- Verifica que estés usando HTTPS (GitHub Pages lo incluye)
- Revisa que manifest.json esté correctamente configurado
- Comprueba la consola del navegador para errores

### Service Worker no funciona
- Verifica que las rutas en PRECACHE_URLS sean correctas
- Asegúrate de que el archivo esté en la raíz del proyecto
- Revisa la consola: Application → Service Workers

### Las imágenes no cargan
- Verifica que las rutas sean correctas
- Usa rutas relativas (`/assets/images/...`)
- Comprueba que las imágenes existan en el repositorio

## 📈 Próximas Características

- [ ] Integración con API backend real
- [ ] Notificaciones push
- [ ] Sistema de pagos en línea
- [ ] Chat en vivo
- [ ] Múltiples idiomas
- [ ] Analytics integrado
- [ ] Sistema de reseñas

## 👨‍💻 Desarrollo

### Para contribuir:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Add: Nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👤 Contacto

**Arte en mis manos**
- WhatsApp: +506 8740-9343
- Ubicación: San José, Costa Rica

---

Desarrollado con 💅 por **NelSystems**
