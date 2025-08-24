# 🚀 Guía Completa: Super Hot Dog en Netlify

## ✅ **¡Todo está listo para Netlify!**

Tu aplicación Super Hot Dog ahora incluye:
- ✅ **Netlify Function** para crear preferencias MercadoPago
- ✅ **Configuración automática** con `netlify.toml`  
- ✅ **Páginas de resultado** (success, failure, pending)
- ✅ **Manejo completo de errores**
- ✅ **WhatsApp integrado** para comprobantes

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

## 🔑 **Paso 3: Configurar MercadoPago (CRÍTICO)**

### **3.1 Obtener credenciales de MercadoPago**
1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. **Crea una aplicación** o usa una existente
3. Ve a **"Credenciales"**
4. **IMPORTANTE**: Usa **TEST** primero, después **PRODUCTION**

### **3.2 Configurar en Netlify**
1. En tu dashboard de Netlify → **Site settings**
2. **Environment variables** (en el menú izquierdo)
3. **Add variable**:
   - **Key:** `MP_ACCESS_TOKEN`
   - **Value:** `TEST-1234567890-abcdef...` (tu Access Token de TEST)
4. **Save**

---

## 🧪 **Paso 4: Testing**

### **4.1 Probar la función**
1. Ve a tu URL de Netlify (ej: `https://superhotdog-123.netlify.app`)
2. **Functions** tab en el dashboard
3. Deberías ver `create-preference` listada

### **4.2 Probar el flujo completo**
1. **Abrir tu sitio** → Agregar productos → "Hacer pedido"
2. **Completar datos** → "Ir a pagar"
3. **Debería abrir MercadoPago** (modo TEST)
4. **Usar tarjeta de prueba:**
   ```
   Número: 4509 9535 6623 3704
   Código: 123
   Fecha: 11/25
   ```
5. **Completar pago** → Debería volver a tu `success.html`
6. **Probar WhatsApp** con comprobante

---

## 🔧 **Paso 5: URLs de Producción**

Una vez que funcione, actualiza las URLs en tu `index.html`:

```javascript
back_urls: {
    success: "https://TU-SITIO.netlify.app/success.html",
    failure: "https://TU-SITIO.netlify.app/failure.html", 
    pending: "https://TU-SITIO.netlify.app/pending.html"
}
```

---

## 🚨 **Troubleshooting**

### **Error: "MP_ACCESS_TOKEN not configured"**
```
Solución:
1. Verificar variable en Netlify Dashboard
2. Hacer nuevo deploy después de agregar variable
3. Revisar logs en Functions tab
```

### **Error: "CORS blocked"**
```
Solución: 
Ya está configurado en netlify.toml
Si persiste, verificar que la función esté en netlify/functions/
```

### **Error: "Function not found"**  
```
Solución:
1. Verificar que el archivo esté en netlify/functions/create-preference.js  
2. Re-deploy el sitio
3. Verificar en Functions tab que aparezca
```

### **Los pagos no redirigen correctamente**
```
Solución:
1. Verificar URLs en back_urls (líneas 930-934 de index.html)
2. Usar URL completa: https://tu-sitio.netlify.app/success.html
```

---

## 📊 **Monitoreo**

### **Ver logs de la función:**
1. Netlify Dashboard → **Functions** 
2. Click en `create-preference`
3. **View function logs**

### **Ver analytics:**
1. **Analytics** tab en Netlify
2. Monitorear requests a Functions

---

## 🎯 **Paso 6: Ir a Producción**

### **Cuando todo funcione en TEST:**

1. **Cambiar a credenciales PRODUCTION** en MercadoPago
2. **Actualizar variable** `MP_ACCESS_TOKEN` en Netlify
3. **Verificar URLs** de vuelta (success, failure, pending)
4. **Hacer deploy** final
5. **¡Listo para recibir pagos reales!**

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

## 🎉 **¡Ya tienes un negocio digital completo!**

### **Lo que acabas de crear:**
- 🌭 **Catálogo online** dinámico
- 💳 **Pagos reales** con MercadoPago
- 📱 **Confirmaciones automáticas** por WhatsApp
- 🚀 **Hosting profesional** con Netlify
- 🔧 **Backend serverless** con Functions

### **URLs importantes:**
- 🌐 **Tu sitio:** `https://TU-SITIO.netlify.app`
- ⚙️ **Dashboard:** `https://app.netlify.com/sites/TU-SITIO`
- 💳 **MercadoPago:** `https://www.mercadopago.com.ar/developers`

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
