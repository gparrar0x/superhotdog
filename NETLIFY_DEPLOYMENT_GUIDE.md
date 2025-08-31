# 🚀 Guía Completa: Super Hot Dog en Netlify

## ✅ **¡Sistema completo listo para producción!**

Tu aplicación Super Hot Dog ahora incluye:

### 🏗️ **Backend Serverless**
- ✅ **2 Netlify Functions** - get-sheets-data & create-preference
- ✅ **Configuración automática** con `netlify.toml`  
- ✅ **Variables de entorno** securizadas
- ✅ **CORS configurado** para todos los dominios

### 🕒 **Sistema de Horarios Inteligente**
- ✅ **Zona horaria Argentina** (América/Buenos Aires)
- ✅ **Horarios dinámicos** desde Google Sheets (formato 24h)
- ✅ **Banner de cerrado** automático fuera de horario
- ✅ **Footer con horarios** - día actual destacado
- ✅ **Deshabilitación de pedidos** cuando está cerrado

### 💳 **Sistema de Pagos Avanzado**
- ✅ **Páginas de resultado** (success, failure, pending) con diseño profesional
- ✅ **Manejo completo de errores** y estados de pago
- ✅ **URLs automáticas** (localhost → producción)
- ✅ **WhatsApp integrado** con número dinámico desde Google Sheets

### 📊 **Integración Google Sheets Completa**
- ✅ **Doble hoja**: Productos + Información del negocio
- ✅ **Horarios, teléfono, dirección** dinámicos
- ✅ **Cache inteligente** (5 minutos)
- ✅ **Actualización en tiempo real**

---

## 🎯 **Paso 1: Subir a GitHub**

```bash
# En tu terminal, dentro de la carpeta superhotdog:
git add .
git commit -m "🚀 Super Hot Dog with Netlify Functions ready"
git push origin main
```

---

## 🌐 **Paso 2: Desplegar en Netlify**

### **Opción A: Conectar desde GitHub (Recomendado)**
1. Ve a [Netlify.com](https://netlify.com)
2. **"New site from Git"**
3. **Conectar con GitHub** → Autorizar
4. **Seleccionar tu repositorio** `superhotdog`
5. **Configuración:**
   - **Build command:** `echo "Static site with functions"`
   - **Publish directory:** `.` (punto)
   - **Functions directory:** `netlify/functions` (se detecta automáticamente)
6. **Deploy site** 

### **Opción B: Drag & Drop**
1. Comprimir toda la carpeta `superhotdog` en un ZIP
2. Arrastrarlo a Netlify
3. **Pero necesitarás configurar las variables manualmente**

---

## 🔑 **Paso 3: Configurar Variables de Entorno (CRÍTICO)**

### **3.1 Google Sheets**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **Crea/selecciona proyecto** → Habilita **Google Sheets API**
3. **Credenciales** → **Crear clave API**
4. **Obtén tu Sheet ID** de la URL de Google Sheets

### **3.2 MercadoPago** 
1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. **Crea aplicación** → **Credenciales**
3. **IMPORTANTE**: Usa **TEST** primero, después **PRODUCTION**

### **3.3 Configurar en Netlify**
1. En tu dashboard de Netlify → **Site settings**
2. **Environment variables** (menú izquierdo)
3. **Agregar estas 3 variables**:
   ```bash
   GOOGLE_SHEET_ID = "1ABC123def456GHI789"
   GOOGLE_API_KEY = "AIzaSyBV8p6eYfWNGpmF1E9Ob7ae33v7Ci7EN-Y"  
   MP_ACCESS_TOKEN = "TEST-1234567890-abcdef..."
   ```
4. **Save** cada una

### **3.4 Estructura Google Sheets**
Asegúrate de que tu hoja tenga **2 pestañas**:

#### **"Productos"** (A1:F):
```
Nombre | Descripción | Precio | Categoría | Imagen | Disponible
```

#### **"Informacion"** (A1:B):
```
telefono    | +54 11 2162-5416
direccion   | Av. Gallardo 1081, local 3 - Bariloche  
lunes       | 10:30-23:00
martes      | 10:30-23:00
# ... resto de días en formato 24h
```

---

## 🧪 **Paso 4: Testing**

### **4.1 Probar las functions**
1. Ve a tu URL de Netlify (ej: `https://superhotdog-123.netlify.app`)
2. **Functions** tab en el dashboard
3. Deberías ver **2 funciones**:
   - ✅ `get-sheets-data`
   - ✅ `create-preference`

### **4.2 Probar Google Sheets**
1. **Abrir tu sitio** → Productos deberían cargar automáticamente
2. **Verificar horarios** en footer (día actual destacado)
3. **Probar estado abierto/cerrado** según horario actual
4. **Cambiar horario en Google Sheets** → Refrescar para verificar actualización

### **4.3 Probar flujo de pago completo**
1. **Agregar productos** → "Hacer pedido"
2. **Completar datos** → "Ir a pagar"
3. **Debería abrir MercadoPago** (modo TEST)
4. **Usar tarjeta de prueba:**
   ```
   Número: 4509 9535 6623 3704
   Código: 123
   Fecha: 11/25
   ```
5. **Completar pago** → Debería volver a tu `success.html`
6. **Probar WhatsApp** - debe usar número de Google Sheets

### **4.4 Probar horarios inteligentes**
1. **Cambiar horario** en Google Sheets a rango fuera del actual
2. **Refrescar página** → Debería mostrar banner "Cerrado"
3. **Intentar pedido** → Debe estar deshabilitado
4. **Restaurar horario** correcto

---

## 🔧 **Paso 5: URLs de Producción**

**✅ ¡Ya no necesitas hacer nada!** 

El sistema automáticamente:
- ✅ **Detecta localhost** durante desarrollo
- ✅ **Usa URLs de producción** cuando está en Netlify
- ✅ **No requiere cambios manuales** en el código

La función `create-preference.js` maneja esto automáticamente:
```javascript
// Se detecta automáticamente si es desarrollo local
const isLocalDev = back_urls?.success?.includes('localhost');
const finalBackUrls = isLocalDev ? {
    success: "https://superhotdog.netlify.app/success.html",
    failure: "https://superhotdog.netlify.app/failure.html", 
    pending: "https://superhotdog.netlify.app/pending.html"
} : back_urls;
```

---

## 🚨 **Troubleshooting**

### **Error: Variables de entorno no configuradas**
```
Error: MP_ACCESS_TOKEN not configured
Error: Google Sheets credentials not configured

Solución:
1. Verificar las 3 variables en Netlify Dashboard:
   - GOOGLE_SHEET_ID
   - GOOGLE_API_KEY  
   - MP_ACCESS_TOKEN
2. Hacer nuevo deploy después de agregar variables
3. Revisar logs en Functions tab
```

### **Error: "Products not loading"**
```
Error: No se cargan los productos

Solución:
1. Verificar que Google Sheets sea público
2. Confirmar estructura: pestaña "Productos" (A1:F)
3. Verificar permisos de la API Key
4. Revisar logs de get-sheets-data function
```

### **Error: "Horarios no funcionan"**
```
Error: Banner cerrado no aparece / Horarios incorrectos

Solución:
1. Verificar pestaña "Informacion" en Google Sheets
2. Usar formato 24h: 10:30-23:00 (no AM/PM)
3. Nombres exactos: lunes, martes, miercoles, etc.
4. Verificar zona horaria Argentina en logs
```

### **Error: "WhatsApp number incorrect"**
```
Error: WhatsApp abre con número incorrecto

Solución:
1. Verificar "telefono" en pestaña "Informacion"  
2. Formato: +54 11 2162-5416
3. Refrescar página para cargar nuevo número
```

### **Error: "CORS blocked"**
```
Solución: 
Ya está configurado en netlify.toml
Si persiste, verificar que ambas functions estén en netlify/functions/
```

### **Error: "Function not found"**  
```
Solución:
1. Verificar que ambos archivos estén en netlify/functions/:
   - create-preference.js
   - get-sheets-data.js
2. Re-deploy el sitio
3. Verificar en Functions tab que aparezcan ambas
```

---

## 📊 **Monitoreo**

### **Ver logs de las functions:**
1. Netlify Dashboard → **Functions** 
2. Click en cualquier función:
   - `get-sheets-data` - Para debug de productos y horarios
   - `create-preference` - Para debug de pagos
3. **View function logs**

### **Ver analytics:**
1. **Analytics** tab en Netlify
2. Monitorear requests a Functions
3. **Useful metrics:**
   - Requests a `get-sheets-data` (carga de catálogo)
   - Requests a `create-preference` (intentos de pago)
   - Errores 500 vs 200 status codes

---

## 🎯 **Paso 6: Ir a Producción**

### **Cuando todo funcione en TEST:**

1. **Cambiar a credenciales PRODUCTION** en MercadoPago
2. **Actualizar variable** `MP_ACCESS_TOKEN` en Netlify con token de producción
3. **Verificar horarios** en Google Sheets (formato 24h)
4. **Probar sistema completo** en producción:
   - ✅ Carga de productos desde Google Sheets
   - ✅ Horarios inteligentes con timezone Argentina
   - ✅ Banner de cerrado fuera de horario
   - ✅ WhatsApp con número correcto
   - ✅ Pagos reales con MercadoPago
5. **¡Listo para recibir pedidos y pagos reales!**

---

## 💰 **Costos**

### **Netlify (GRATIS):**
- ✅ **100 GB** de ancho de banda
- ✅ **125,000** requests de Functions por mes
- ✅ **Sitios ilimitados**

### **MercadoPago:**
- ✅ **Integración gratuita**
- ✅ **Solo pagas comisiones** por transacciones exitosas

---

## 🎉 **¡Ya tienes un negocio digital completamente automatizado!**

### **Lo que acabas de crear:**
- 🌭 **Catálogo online dinámico** con Google Sheets
- 🕒 **Sistema de horarios inteligente** con timezone Argentina
- 💳 **Pagos reales automatizados** con MercadoPago
- 📱 **WhatsApp integrado** con número dinámico
- 🔒 **Manejo de estados** abierto/cerrado automático
- 🚀 **Hosting profesional** con backend serverless
- 🎨 **UI/UX profesional** con tema superhéroe
- 📊 **Footer informativo** con horarios y contacto alineado

### **URLs importantes:**
- 🌐 **Tu sitio:** `https://superhotdog.netlify.app`
- ⚙️ **Dashboard:** `https://app.netlify.com/sites/superhotdog`
- 💳 **MercadoPago:** `https://www.mercadopago.com.ar/developers`
- 📊 **Google Sheets:** Tu hoja con pestañas "Productos" e "Informacion"

### **Archivos clave del proyecto:**
```
superhotdog/
├── index.html                      # Página principal
├── assets/
│   ├── styles.css                 # Estilos separados y optimizados
│   ├── script.js                  # JavaScript con timezone Argentina
│   ├── instagram.png              # Icono Instagram
│   └── whatsapp.png              # Icono WhatsApp
├── netlify/functions/
│   ├── get-sheets-data.js         # Function para Google Sheets
│   └── create-preference.js       # Function para MercadoPago
├── success.html                   # Página pago exitoso
├── pending.html                   # Página pago pendiente  
├── failure.html                   # Página pago fallido
├── .env                          # Variables de entorno (local)
└── netlify.toml                  # Configuración Netlify
```

---

## 📞 **Soporte**

Si algo no funciona:
1. **Revisa los logs** en Netlify Functions
2. **Verifica las variables** de entorno
3. **Prueba con credenciales TEST** primero
4. **Consulta** por el chat si necesitas ayuda

---

# 🦸‍♂️ **¡Super Hot Dog está listo para conquistar el mundo digital!**

**Tu negocio ahora puede:**
- ✅ **Recibir pedidos 24/7**
- ✅ **Cobrar automáticamente**
- ✅ **Confirmar por WhatsApp** 
- ✅ **Escalar sin límites**

**¡Felicitaciones por tu nuevo negocio digital!** 🎉🌭💳
