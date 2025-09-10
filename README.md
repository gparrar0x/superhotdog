# 🌭 Super Hot Dog - Catálogo Digital Completo 🦸‍♂️

![Super Hot Dog Banner](https://img.shields.io/badge/Super%20Hot%20Dog-Bariloche-red?style=for-the-badge&logo=superhero)

## 📋 Descripción

Aplicación web completa de catálogo digital para **Super Hot Dog**, el negocio de hot dogs más súper de Bariloche. Con temática de superhéroe, conectado a Google Sheets y sistema completo de horarios inteligentes con zona horaria Argentina.

## 🚀 Demo en vivo

[Ver aplicación en Netlify](https://superhotdog.netlify.app) 

## ✨ Características Principales

### 🛍️ **Sistema de Catálogo Avanzado**
- 🦸‍♂️ **Temática de superhéroe** con diseño tipo cómic profesional
- 📊 **Conectado a Google Sheets** (2 hojas: Productos + Información del negocio)
- 🔄 **Actualización en tiempo real** - cambios instantáneos desde Google Sheets
- 🗂️ **Categorías dinámicas** con filtros inteligentes
- ✅ **Control de disponibilidad** por producto (TRUE/FALSE)

### 💳 **Sistema de Pagos Completo**
- 💳 **MercadoPago integrado** - pagos reales con tarjeta, efectivo y transferencia
- 🏛️ **Netlify Functions** - backend serverless profesional
- ✅ **Páginas de resultado** (éxito, fallo, pendiente) con diseño coherente
- 📱 **Confirmación automática** por WhatsApp con datos de la transacción

### 🕒 **Sistema de Horarios Inteligente**
- 🌍 **Zona horaria Argentina** (América/Buenos Aires) configurada
- 📅 **Horarios dinámicos** desde Google Sheets (formato 24h)
- 🔒 **Banner de cerrado** cuando el negocio no está operativo
- 🚫 **Deshabilitación automática** de pedidos fuera de horario
- 📊 **Footer con horarios** - día actual destacado
- 🕐 **Header con horario actual** y tiempo en vivo

### 📱 **Integración WhatsApp Avanzada**
- 📞 **Número dinámico** desde Google Sheets
- 📋 **Comprobantes detallados** con información completa del pedido
- 🔗 **Enlaces inteligentes** en todas las páginas de pago
- 💬 **Mensajes personalizados** según el contexto

### 🎨 **Diseño y UX**
- 🌐 **Responsive design** - optimizado para móviles y desktop
- ⚡ **Carga rápida** - CSS y JS separados y optimizados
- 🛒 **Carrito inteligente** con cantidades y total dinámico
- 🔒 **Manejo de estados** - abierto/cerrado con estilos diferenciados
- 🎭 **Iconos personalizados** - Instagram y WhatsApp con imágenes PNG

## 🏪 Información del negocio

- **Nombre:** Super Hot Dog
- **Ubicación:** Av. Gallardo 1081, local 3, Bariloche
- **Instagram:** [@superhotdogbrc](https://www.instagram.com/superhotdogbrc/)
- **Concepto:** Los Hot Dogs más grandes de Bariloche

## 🔧 Configuración

### 1. Google Sheets - Estructura Completa

Crea una hoja de Google Sheets con **2 pestañas**:

#### **Pestaña "Productos"** (A1:E):

| A (Nombre) | B (Descripción) | C (Precio) | D (Categoría) | E (Disponible) |
|------------|----------------|------------|---------------|----------------|
| Super Dog Gigante | Hot dog de 34cm con salchicha especial | 2500 | super-dogs | TRUE |
| Pollo Broaster | Pollo crispy con salsa especial | 1899 | pollo | TRUE |

#### **Pestaña "Informacion"** (A1:B):

| A (Campo) | B (Valor) |
|-----------|-----------|
| nombre | Super Hot Dog |
| direccion | Av. Gallardo 1081, local 3 - Bariloche |
| telefono | +54 11 2162-5416 |
| instagram | @superhotdogbrc |
| lunes | 10:30-23:00 |
| martes | 10:30-23:00 |
| miercoles | 10:30-23:00 |
| jueves | 10:30-23:00 |
| viernes | 10:30-23:00 |
| sabado | 10:30-23:00 |
| domingo | 10:30-23:00 |

**📝 Notas importantes:**
- ✅ **Horarios en formato 24h**: `10:30-23:00` (no AM/PM)
- ✅ **Teléfono con código país**: `+54 11 2162-5416` 
- ✅ **Precios sin decimales**: `2500` (no `25.00`)

#### Categorías disponibles:
- `super-dogs` - Hot dogs gigantes especiales
- `clasicos` - Hot dogs tradicionales  
- `pollo` - Opciones de pollo
- `acompañamientos` - Papas, aros, etc.
- `bebidas` - Gaseosas, jugos
- `combos` - Combos especiales

### 2. Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**
4. Ve a **Credenciales** → **Crear credenciales** → **Clave de API**
5. Copia la API Key generada
6. **Importante:** Restringe la API Key:
   - Restricciones de aplicación: **Referentes HTTP**
   - Sitios web: `*.github.io/*`, `localhost/*`

### 3. Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Google Sheets Configuration
GOOGLE_SHEET_ID=1ABC123def456GHI789
GOOGLE_API_KEY=AIzaSyBV8p6eYfWNGpmF1E9Ob7ae33v7Ci7EN-Y

# MercadoPago Configuration
MP_ACCESS_TOKEN=APP_USR-1234567890-abcdef...
```

#### ¿Cómo obtener el Sheet ID?

De la URL de tu hoja de Google Sheets:
```
https://docs.google.com/spreadsheets/d/1ABC123def456GHI789/edit
                                    ^^^^^^^^^^^^^^^^
                                    Este es tu Sheet ID
```

**🔒 IMPORTANTE:** El archivo `.env` ya está en `.gitignore` - nunca subas credenciales a Git.

### 4. Permisos de la hoja

Asegúrate de que tu hoja de Google Sheets sea accesible:

**Opción 1 - Pública (Recomendada para GitHub Pages):**
- Archivo → Compartir → Cambiar a "Cualquier persona con el enlace puede ver"

**Opción 2 - Privada:**
- Comparte con la cuenta de servicio de tu proyecto de Google Cloud

## 🚀 Despliegue en Netlify (Recomendado)

### ✅ **Netlify con Functions (Pagos automáticos)**

1. **Sube a GitHub:**
   ```bash
   git add .
   git commit -m "Super Hot Dog with Netlify Functions"
   git push origin main
   ```

2. **Conecta con Netlify:**
   - Ve a [Netlify.com](https://netlify.com)
   - "New site from Git" → Conectar repositorio
   - Deploy automático ✅

3. **Configurar variable de entorno:**
   - Site settings → Environment variables
   - Agregar: `MP_ACCESS_TOKEN` = Tu Access Token de MercadoPago

4. **¡Listo!** Pagos reales funcionando

### 📋 **Ver guía completa:** `NETLIFY_DEPLOYMENT_GUIDE.md`

---

## 🎯 **Alternativa: GitHub Pages (Solo frontend)**

1. Settings → Pages → Deploy from branch → main
2. Funciona para el catálogo, pagos requieren configuración manual

### Opción B: Manual

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/superhotdog.git
cd superhotdog

# Hacer cambios en la configuración
# Editar index.html con tus credenciales

# Commit y push
git add .
git commit -m "🔧 Configure Google Sheets credentials"
git push origin main
```

## 🛠️ Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/superhotdog.git
cd superhotdog

# Crear archivo .env con tus credenciales
cp .env.example .env
# Editar .env con tus claves reales

# Instalar Netlify CLI (si no la tienes)
npm install -g netlify-cli

# Ejecutar servidor de desarrollo con Functions
netlify dev

# La aplicación estará en http://localhost:8888
# Las functions estarán en /.netlify/functions/
```

### 🔧 **Comandos útiles:**

```bash
# Ver logs de las functions
netlify dev --debug

# Ejecutar en puerto específico  
netlify dev --port 3000

# Build para producción
netlify build
```

## 📱 Uso de la aplicación

1. **Navegación:** Usa las categorías para filtrar productos
2. **Agregar al carrito:** Click en + para agregar productos
3. **Hacer pedido:** Click en "HACER PEDIDO" cuando tengas productos en el carrito
4. **Completar datos:** Llena el formulario con tus datos
5. **Enviar:** Click en "Enviar por WhatsApp" para completar el pedido

## 🎨 Personalización

### Colores del tema
```css
:root {
    --primary-red: #dc2626;    /* Rojo principal */
    --superhero-blue: #1e40af;  /* Azul Superman */
    --super-yellow: #fbbf24;    /* Amarillo de acentos */
}
```

### Información del negocio
Actualiza las constantes en el JavaScript:
```javascript
const BUSINESS_INFO = {
    name: 'Super Hot Dog',
    address: 'Av. Gallardo 1081, local 3, Bariloche',
    instagram: '@superhotdogbrc'
};
```

## 🐛 Solución de problemas

### La aplicación no carga productos
- ✅ Verifica que el Sheet ID sea correcto
- ✅ Confirma que la API Key funcione
- ✅ Revisa que la hoja sea accesible públicamente
- ✅ Comprueba la consola del navegador para errores

### Error de CORS
- ✅ Restringe la API Key para tu dominio en Google Cloud Console
- ✅ Asegúrate de que la hoja tenga permisos de lectura

### WhatsApp no se abre
- ✅ Verifica que el número incluya código de país: `54911234567890`
- ✅ Confirma que WhatsApp esté instalado en el dispositivo

## 🔧 **Netlify Functions**

### **Funciones incluidas:**

#### 📊 **get-sheets-data.js**
- ✅ **Obtiene productos** desde Google Sheets (pestaña "Productos")
- ✅ **Obtiene info del negocio** desde Google Sheets (pestaña "Informacion")  
- ✅ **Parsea horarios dinámicos** con zona horaria Argentina
- ✅ **Cache inteligente** (5 minutos)
- ✅ **CORS configurado**

#### 💳 **create-preference.js**
- ✅ **Crea preferencias MercadoPago** para pagos
- ✅ **URLs automáticas** (localhost → producción) 
- ✅ **Manejo completo de errores**
- ✅ **Logs detallados** para debugging

### **Variables de entorno requeridas:**
```bash
GOOGLE_SHEET_ID = "1ABC123def456GHI789"
GOOGLE_API_KEY = "AIzaSyBV8p6eYfWNGpmF1E9Ob7ae33v7Ci7EN-Y"
MP_ACCESS_TOKEN = "APP_USR-1234567890-abcdef..."
```

### **Endpoints:**
```bash
GET  /.netlify/functions/get-sheets-data
     - Devuelve: { products, businessInfo, lastUpdated }

POST /.netlify/functions/create-preference  
     - Crea una preferencia de pago
     - Devuelve: { preference_id, init_point, sandbox_init_point }
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **Instagram:** [@superhotdogbrc](https://www.instagram.com/superhotdogbrc/)
- **Ubicación:** Av. Gallardo 1081, local 3, Bariloche

---

**Hecho con ❤️ para Super Hot Dog Bariloche** 🌭🦸‍♂️

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://pages.github.com/)