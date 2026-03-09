# 🚀 Guía Completa de Despliegue

## Tabla de Contenidos
1. [Preparación](#preparación)
2. [GitHub Pages](#github-pages)
3. [Netlify](#netlify)
4. [Vercel](#vercel)
5. [Post-Deployment](#post-deployment)

---

## Preparación

### 1. Verificar Archivos

Asegúrate de tener todos estos archivos:

```
✅ index.html
✅ manifest.json
✅ service-worker.js
✅ robots.txt
✅ sitemap.xml
✅ /assets/css/...
✅ /assets/js/...
✅ /admin/...
```

### 2. Configurar Git

```bash
cd nail-salon-pwa

# Inicializar repositorio (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "🎨 Initial commit: Arte en mis manos PWA"
```

---

## GitHub Pages

### Método 1: Deploy Directo

1. **Crear Repositorio en GitHub**
   - Ve a https://github.com/new
   - Nombre: `nail-salon-pwa` (o el que prefieras)
   - Público/Privado según prefieras
   - No inicialices con README (ya lo tienes)

2. **Conectar y Subir**
```bash
# Agregar remote
git remote add origin https://github.com/TU-USUARIO/nail-salon-pwa.git

# Subir código
git branch -M main
git push -u origin main
```

3. **Activar GitHub Pages**
   - Ve a Settings → Pages
   - Source: Deploy from branch
   - Branch: `main` / `(root)`
   - Save

4. **Esperar Deployment**
   - El sitio estará disponible en ~5 minutos
   - URL: `https://TU-USUARIO.github.io/nail-salon-pwa/`

### Método 2: Con GitHub Actions (CI/CD)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy PWA

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### Actualizar URLs Post-Deploy

En `manifest.json`:
```json
{
  "start_url": "/nail-salon-pwa/",
  "scope": "/nail-salon-pwa/"
}
```

En `service-worker.js`:
```javascript
const BASE_PATH = '/nail-salon-pwa';
// Actualizar rutas según sea necesario
```

---

## Netlify

### Deploy con Git

1. **Crear Cuenta**
   - Ve a https://www.netlify.com/
   - Sign up with GitHub

2. **New Site from Git**
   - Click "New site from Git"
   - Conecta tu repositorio
   - Configure:
     ```
     Build command: (vacío)
     Publish directory: /
     ```
   - Deploy site

3. **Configurar Dominio**
   - Site settings → Domain management
   - Cambiar subdomain o agregar custom domain

### Deploy con Drag & Drop

1. **Build Local** (opcional)
   ```bash
   # Si tienes proceso de build
   npm run build
   ```

2. **Drag & Drop**
   - Ve a https://app.netlify.com/drop
   - Arrastra la carpeta del proyecto
   - ¡Listo!

### Configuración Netlify

Crear `netlify.toml`:

```toml
[build]
  publish = "/"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"

[[headers]]
  for = "service-worker.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Vercel

### Deploy con Git

1. **Crear Cuenta**
   - Ve a https://vercel.com/
   - Sign up with GitHub

2. **Import Project**
   - New Project
   - Import tu repositorio
   - Configure:
     ```
     Framework Preset: Other
     Build Command: (vacío)
     Output Directory: /
     ```
   - Deploy

### Deploy con CLI

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Login y Deploy**
```bash
cd nail-salon-pwa
vercel login
vercel --prod
```

### Configuración Vercel

Crear `vercel.json`:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/service-worker.js",
      "headers": {
        "cache-control": "max-age=0, must-revalidate"
      }
    },
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

---

## Post-Deployment

### 1. Verificar PWA

**Chrome DevTools:**
- F12 → Application
- Manifest: ✅ Sin errores
- Service Workers: ✅ Activado
- Lighthouse: ✅ PWA score 100

### 2. Test en Dispositivos

- **Android**: Chrome → Menú → Instalar app
- **iOS**: Safari → Compartir → Agregar a inicio
- **Desktop**: Chrome → Instalar

### 3. Configurar Analytics

```html
<!-- En index.html, antes de </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 4. SEO Final

**Google Search Console:**
1. Agregar propiedad
2. Verificar dominio
3. Enviar sitemap: `https://tu-dominio.com/sitemap.xml`

**Meta Tags Importantes:**
```html
<!-- Verificar que estén presentes -->
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:image" content="...">
<link rel="canonical" href="https://tu-dominio.com">
```

### 5. Performance Monitoring

**Lighthouse CI:**
```bash
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage
```

### 6. SSL/HTTPS

- GitHub Pages: ✅ Automático
- Netlify: ✅ Automático
- Vercel: ✅ Automático

### 7. Custom Domain (Opcional)

**En GitHub Pages:**
1. Settings → Pages → Custom domain
2. Agregar CNAME en tu DNS:
   ```
   Type: CNAME
   Name: @
   Value: TU-USUARIO.github.io
   ```

**En Netlify/Vercel:**
1. Domain settings → Add custom domain
2. Seguir instrucciones de configuración DNS

---

## Troubleshooting

### Service Worker No Funciona

```javascript
// Verificar en service-worker.js
console.log('[SW] Debug info:', {
    cache: CACHE_NAME,
    urls: PRECACHE_URLS
});
```

### PWA No Se Instala

1. Verificar HTTPS ✅
2. Verificar manifest.json ✅
3. Verificar icons ✅
4. Service Worker registrado ✅

### Errores 404

Verificar rutas:
```javascript
// Rutas relativas sin / inicial
'/assets/...'  // ❌
'assets/...'   // ✅

// O absolutas
'/nail-salon-pwa/assets/...'  // ✅ GitHub Pages con repo name
```

---

## Checklist Final

Antes de considerar el deploy completo:

- [ ] PWA instalable en todos los dispositivos
- [ ] Service Worker funcionando
- [ ] Lighthouse score > 90
- [ ] Responsive en móvil, tablet, desktop
- [ ] Admin panel accesible y funcional
- [ ] Sistema de reservas funcionando
- [ ] WhatsApp integration activa
- [ ] Analytics configurado
- [ ] Sitemap enviado a Google
- [ ] Performance optimizada
- [ ] SEO meta tags completos
- [ ] Iconos PWA en todos los tamaños

---

## Mantenimiento

### Actualizar Contenido

```bash
# Hacer cambios
git add .
git commit -m "feat: Nueva funcionalidad"
git push origin main

# Incrementar versión en service-worker.js
const CACHE_NAME = 'arte-v1.0.1'; // Cambiar versión
```

### Monitoring Semanal

- Revisar analytics
- Verificar errores en consola
- Actualizar galería
- Responder consultas

---

**¡Deployment Exitoso! 🎉**

Tu PWA está ahora en vivo y lista para recibir clientes.
