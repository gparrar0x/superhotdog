# 🌭 Super Hot Dog - Catálogo Digital 🦸‍♂️

![Super Hot Dog Banner](https://img.shields.io/badge/Super%20Hot%20Dog-Bariloche-red?style=for-the-badge&logo=superhero)

## 📋 Descripción

Aplicación web de catálogo digital para **Super Hot Dog**, el negocio de hot dogs más súper de Bariloche. Con temática de superhéroe y conectado a Google Sheets para gestión dinámica de productos.

## 🚀 Demo en vivo

[Ver aplicación en GitHub Pages](https://tuusuario.github.io/superhotdog/) *(actualizar con tu usuario)*

## ✨ Características

- 🦸‍♂️ **Temática de superhéroe** con diseño tipo cómic
- 📊 **Conectado a Google Sheets** para gestión de productos en tiempo real
- 🛒 **Carrito de compras** con envío automático a WhatsApp
- 📱 **Totalmente responsive** - optimizado para móviles
- ⚡ **Carga rápida** - aplicación web estática
- 🔄 **Actualización en tiempo real** del catálogo

## 🏪 Información del negocio

- **Nombre:** Super Hot Dog
- **Ubicación:** Av. Gallardo 1081, local 3, Bariloche
- **Instagram:** [@superhotdogbrc](https://www.instagram.com/superhotdogbrc/)
- **Concepto:** Los Hot Dogs más grandes de Bariloche

## 🔧 Configuración

### 1. Google Sheets

Crea una hoja de Google Sheets con la siguiente estructura:

| A (Nombre) | B (Descripción) | C (Precio) | D (Categoría) | E (Imagen URL) | F (Disponible) |
|------------|----------------|------------|---------------|----------------|----------------|
| Super Dog Gigante | Hot dog de 34cm con salchicha especial | 12.99 | super-dogs | | TRUE |
| Pollo Broaster | Pollo crispy con salsa especial | 8.99 | pollo | | TRUE |

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

### 3. Configurar la aplicación

Edita el archivo `index.html` y actualiza estas líneas (642-647):

```javascript
const SHEET_ID = 'TU_SHEET_ID_AQUI'; // ID de tu hoja de Google Sheets
const API_KEY = 'TU_API_KEY_AQUI';   // Tu API Key de Google Cloud
const WHATSAPP_NUMBER = '5491234567890'; // Número de WhatsApp del negocio
```

#### ¿Cómo obtener el Sheet ID?

De la URL de tu hoja de Google Sheets:
```
https://docs.google.com/spreadsheets/d/1ABC123def456GHI789/edit
                                    ^^^^^^^^^^^^^^^^
                                    Este es tu Sheet ID
```

### 4. Permisos de la hoja

Asegúrate de que tu hoja de Google Sheets sea accesible:

**Opción 1 - Pública (Recomendada para GitHub Pages):**
- Archivo → Compartir → Cambiar a "Cualquier persona con el enlace puede ver"

**Opción 2 - Privada:**
- Comparte con la cuenta de servicio de tu proyecto de Google Cloud

## 🚀 Despliegue en GitHub Pages

### Opción A: Automático (Recomendado)

1. Haz fork de este repositorio
2. Ve a **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** / **(root)**
5. Click **Save**

Tu app estará disponible en: `https://tuusuario.github.io/superhotdog/`

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

# Abrir con un servidor local (opcional)
python -m http.server 8000
# O usar Live Server de VS Code

# Abrir en navegador
open http://localhost:8000
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