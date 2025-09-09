// 🔧 CONFIGURACIÓN - Credenciales movidas a Netlify Functions por seguridad

// 📞 CONFIGURACIÓN DEL NEGOCIO
let WHATSAPP_NUMBER = '541121625416'; // ✅ WhatsApp actualizado (puede ser actualizado desde Google Sheets)
const BUSINESS_INFO = {
    name: 'Super Hot Dog',
    address: 'Av. Gallardo 1081, local 3, Bariloche',
    instagram: '@superhotdogbrc'
};

// 💳 CONFIGURACIÓN MERCADOPAGO
const MP_PUBLIC_KEY = 'APP_USR-e51b4f22-3647-49d8-abe7-9ffefca4b7bc'; // ⚠️ Reemplazar con tu Public Key de MercadoPago
const mp = new MercadoPago(MP_PUBLIC_KEY);

// 🌐 VARIABLES GLOBALES
let products = [];
let cart = {};
let currentCategory = 'all';
let isLoading = true;
let businessInfo = {};
let lastUpdated = null;
let isOpen = true; // Estado del negocio

// 🚀 INICIALIZAR APLICACIÓN
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicación...');
    setupEventListeners();
    showLoading();
    loadProductsFromSheets();
    
    // 🔄 Auto-refresh cada 5 minutos
    setInterval(function() {
        console.log('🔄 Verificando actualizaciones...');
        loadProductsFromSheets();
    }, 5 * 60 * 1000); // 5 minutos
    
    // ⏰ Actualizar hora del header cada minuto
    setInterval(function() {
        updateHeaderSchedule();
        checkBusinessHours();
    }, 60 * 1000); // 1 minuto
});

// 📊 CARGAR PRODUCTOS DESDE NETLIFY FUNCTION
async function loadProductsFromSheets() {
    try {
        console.log('📡 Solicitando datos...');
        const url = '/.netlify/functions/get-sheets-data';
        const response = await fetch(url);
        console.log('📡 Respuesta recibida:', response.status);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.products || data.products.length === 0) {
            throw new Error('No se encontraron productos');
        }
        
        // 🔍 Verificar si hay cambios reales
        const isFirstLoad = !lastUpdated;
        const hasChanges = isFirstLoad || lastUpdated !== data.lastUpdated;
        
        if (hasChanges) {
            console.log(isFirstLoad ? '📊 Carga inicial...' : '📊 Actualizando datos...');
            
            // 📢 Mostrar notificación solo si NO es la primera carga
            if (!isFirstLoad) {
                showUpdateNotification();
            }
            
            // 🔄 Productos ya procesados desde la Netlify Function
            products = data.products;
            
            // 📂 Actualizar categorías dinámicamente
            if (data.categories) {
                updateCategoryButtons(data.categories);
                console.log('✅ Categorías dinámicas cargadas:', data.categories);
            }
            
            // 🏢 Cargar información del negocio
            if (data.businessInfo) {
                businessInfo = data.businessInfo;
                updateBusinessInfo();
                console.log('✅ Información del negocio cargada');
            }
            
            lastUpdated = data.lastUpdated;
            console.log(`✅ ${isFirstLoad ? 'Datos cargados' : 'Datos actualizados'}: ${products.length} productos`);
        } else {
            console.log('📅 Sin cambios detectados');
        }
        
        // ✅ Siempre actualizar estado y renderizar
        isLoading = false;
        console.log('🎨 Renderizando productos...');
        renderProducts();
        
        // 🕒 Verificar horarios de negocio al final
        if (businessInfo && Object.keys(businessInfo).length > 0) {
            console.log('⏰ Verificando horarios de negocio...');
            logTimezoneInfo();
            checkBusinessHours();
        }
        
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        isLoading = false;
        showError(`No se pudo cargar el catálogo: ${error.message}`);
    }
}

// 🔄 ACTUALIZAR CATÁLOGO
function refreshCatalog() {
    isLoading = true;
    showLoading();
    loadProductsFromSheets();
}

// 📂 ACTUALIZAR BOTONES DE CATEGORÍAS DINÁMICAMENTE
function updateCategoryButtons(categories) {
    const categoriesContainer = document.querySelector('.categories');
    if (!categoriesContainer) return;
    
    // Iconos por categoría (con fallback genérico)
    const categoryIcons = {
        'super-dogs': '🌭',
        'clasicos': '🥪',
        'pollo': '🍗',
        'acompañamientos': '🍟',
        'bebidas': '🥤',
        'combos': '💥',
        'hamburguesas': '🍔',
        'postres': '🍰',
        'empanadas': '🥟',
        'pizzas': '🍕',
        'ensaladas': '🥗'
    };
    
    // Función para obtener nombre mostrado de categoría
    const getCategoryDisplayName = (category) => {
        const displayNames = {
            'super-dogs': 'Super Dogs',
            'clasicos': 'Clásicos',
            'acompañamientos': 'Acompañamientos',
            'hamburguesas': 'Hamburguesas',
            'empanadas': 'Empanadas'
        };
        return displayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
    };
    
    // Crear HTML de botones
    let buttonsHTML = '<button class="category-btn active" data-category="all">Todas</button>';
    
    categories.forEach(category => {
        const displayName = getCategoryDisplayName(category);
        buttonsHTML += `<button class="category-btn" data-category="${category}">${displayName}</button>`;
    });
    
    // Actualizar contenedor
    categoriesContainer.innerHTML = buttonsHTML;
    
    // Restablecer event listeners para los nuevos botones
    setupCategoryListeners();
}

// 🎯 CONFIGURAR EVENT LISTENERS DE CATEGORÍAS
function setupCategoryListeners() {
    document.querySelectorAll('.category-btn[data-category]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderProducts();
        });
    });
}

// 💰 FORMATEAR PRECIO SIN DECIMALES Y CON SEPARADOR DE MILES
function formatPrice(price) {
    // Redondear a entero y formatear con separador de miles (punto)
    return Math.round(price).toLocaleString('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// 🏢 ACTUALIZAR INFORMACIÓN DEL NEGOCIO EN LA PÁGINA
function updateBusinessInfo() {
    // Actualizar dirección si existe
    if (businessInfo.address) {
        const addressElement = document.querySelector('.hero-location');
        if (addressElement) {
            addressElement.innerHTML = `📍 ${businessInfo.address}`;
        }
        
        // Actualizar dirección en footer
        const footerAddress = document.getElementById('footer-address');
        if (footerAddress) {
            footerAddress.innerHTML = `📍 ${businessInfo.address}`;
        }
    }
    
    // Actualizar nombre del negocio si existe
    if (businessInfo.name) {
        const titleElement = document.querySelector('.hero-title');
        if (titleElement) {
            titleElement.textContent = businessInfo.name;
        }
        
        // Actualizar también el título de la página
        document.title = `🌭 ${businessInfo.name} - Bariloche`;
    }
    
    // Actualizar teléfono/WhatsApp si existe
    if (businessInfo.phone) {
        // Limpiar el número de teléfono para WhatsApp (remover espacios, guiones, etc.)
        const cleanPhone = businessInfo.phone.replace(/\D/g, '');
        if (cleanPhone) {
            WHATSAPP_NUMBER = cleanPhone;
            
            // Actualizar teléfono en footer
            const footerPhone = document.getElementById('footer-phone');
            if (footerPhone) {
                footerPhone.innerHTML = `📱 WhatsApp: +${cleanPhone.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '$1 $2 $3-$4')}`;
            }
        }
    }
    
    // Actualizar Instagram si existe
    if (businessInfo.instagram) {
        BUSINESS_INFO.instagram = businessInfo.instagram;
        
        // Actualizar Instagram en footer
        const footerInstagram = document.getElementById('footer-instagram');
        if (footerInstagram) {
            footerInstagram.innerHTML = `📸 ${businessInfo.instagram}`;
        }
    }
    
    // Procesar horarios
    updateScheduleDisplay();
}

// 📅 OBTENER DÍA ACTUAL EN ESPAÑOL (TIMEZONE ARGENTINA)
function getCurrentDay() {
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const today = getArgentinaDate();
    return days[today.getDay()];
}

// 🌍 OBTENER FECHA Y HORA EN TIMEZONE ARGENTINA
function getArgentinaDate() {
    // Argentina timezone: America/Argentina/Buenos_Aires (UTC-3)
    const now = new Date();
    const argentinaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
    return argentinaTime;
}

// 🕰️ MOSTRAR INFO DE TIMEZONE (para debugging)
function logTimezoneInfo() {
    const localTime = new Date();
    const argentinaTime = getArgentinaDate();
    
    console.log(`🌐 Timezone Info:`);
    console.log(`   Local: ${localTime.toLocaleString()}`);
    console.log(`   Argentina: ${argentinaTime.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}`);
    console.log(`   UTC Offset: ${localTime.getTimezoneOffset() / -60}hrs`);
    console.log(`   Day of week (Argentina): ${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][argentinaTime.getDay()]}`);
}

// 🕒 OBTENER HORARIO DEL DÍA ACTUAL
function getCurrentDaySchedule() {
    const today = getCurrentDay();
    if (businessInfo[today]) {
        return businessInfo[today];
    }
    return businessInfo.schedule || 'Horario no disponible';
}

// 📅 ACTUALIZAR DISPLAY DE HORARIOS
function updateScheduleDisplay() {
    // Actualizar header con horario del día actual
    updateHeaderSchedule();
    
    // Actualizar footer con todos los horarios
    updateFooterSchedule();
}

// 📍 ACTUALIZAR HORARIO EN HEADER (solo día actual)
function updateHeaderSchedule() {
    const headerText = document.querySelector('.header-text');
    if (headerText) {
        // Buscar si ya existe el elemento de horarios
        let scheduleElement = headerText.querySelector('.hero-schedule');
        
        if (!scheduleElement) {
            scheduleElement = document.createElement('div');
            scheduleElement.className = 'hero-schedule';
            scheduleElement.style.cssText = `
                font-size: 0.9rem;
                color: #fff;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-top: 0.5rem;
            `;
            headerText.appendChild(scheduleElement);
        }
        
        const todaySchedule = getCurrentDaySchedule();
        const today = getCurrentDay();
        const dayName = {
            lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', 
            jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
        }[today];
        
        const argentinaTime = getArgentinaDate();
        const currentTimeStr = argentinaTime.toLocaleTimeString('es-AR', { 
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
        
        scheduleElement.innerHTML = `🕒 Hoy ${dayName}: ${todaySchedule} <span style="font-size: 0.85em; opacity: 0.8;">(${currentTimeStr})</span>`;
    }
}

// 📋 ACTUALIZAR HORARIOS EN FOOTER
function updateFooterSchedule() {
    const scheduleList = document.getElementById('schedule-list');
    if (!scheduleList) return;
    
    const days = [
        { key: 'lunes', name: 'Lunes' },
        { key: 'martes', name: 'Martes' },
        { key: 'miercoles', name: 'Miércoles' },
        { key: 'jueves', name: 'Jueves' },
        { key: 'viernes', name: 'Viernes' },
        { key: 'sabado', name: 'Sábado' },
        { key: 'domingo', name: 'Domingo' }
    ];
    
    const today = getCurrentDay();
    
    scheduleList.innerHTML = days.map(day => {
        const hours = businessInfo[day.key] || 'Cerrado';
        const isToday = day.key === today;
        const isClosed = hours.toLowerCase().includes('cerrado') || !businessInfo[day.key];
        
        return `
            <div class="schedule-item ${isToday ? 'today' : ''} ${isClosed ? 'closed' : ''}">
                <span class="day-name">${day.name}</span>
                <span class="day-hours">${hours}</span>
            </div>
        `;
    }).join('');
}

// 🕒 VERIFICAR HORARIOS DE NEGOCIO
function checkBusinessHours() {
    const argentinaTime = getArgentinaDate();
    const currentTime = argentinaTime.getHours() * 100 + argentinaTime.getMinutes(); // Formato HHMM
    const today = getCurrentDay();
    const todaySchedule = businessInfo[today];
    
    console.log(`⏰ Hora Argentina actual: ${argentinaTime.toLocaleString('es-AR', { 
        timeZone: 'America/Argentina/Buenos_Aires', 
        weekday: 'long', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    })}`);
    console.log(`📅 Día actual: ${today}, Horario: ${todaySchedule}`);
    
    if (!todaySchedule || todaySchedule.toLowerCase().includes('cerrado')) {
        setBusinessClosed('Estamos cerrados los ' + today + 's');
        return;
    }
    
    // Parse schedule (e.g., "9:30 AM–11 PM")
    console.log(`🔍 Parseando horario: "${todaySchedule}"`);
    const timeRange = parseTimeRange(todaySchedule);
    if (!timeRange) {
        console.error(`❌ No se pudo parsear el horario: "${todaySchedule}"`);
        setBusinessClosed('Horario no disponible');
        return;
    }
    
    // Verificar si el negocio está abierto según el tipo de horario
    const isCurrentlyOpen = timeRange.isSplit ? 
        isOpenDuringSplitSchedule(currentTime, timeRange) : 
        isOpenDuringContinuousSchedule(currentTime, timeRange);
    
    if (isCurrentlyOpen) {
        setBusinessOpen();
    } else {
        const nextOpenTime = getNextOpenTime();
        setBusinessClosed(`Abrimos ${nextOpenTime}`);
    }
}

// 🕐 VERIFICAR SI ESTÁ ABIERTO DURANTE HORARIO CONTINUO
function isOpenDuringContinuousSchedule(currentTime, timeRange) {
    const { start, end } = timeRange;
    
    console.log(`🕐 Horario continuo - Comparación detallada:`);
    console.log(`   Hora actual: ${currentTime} (${Math.floor(currentTime/100)}:${(currentTime%100).toString().padStart(2,'0')})`);
    console.log(`   Inicio: ${start} (${Math.floor(start/100)}:${(start%100).toString().padStart(2,'0')})`);
    console.log(`   Fin: ${end} (${Math.floor(end/100)}:${(end%100).toString().padStart(2,'0')})`);
    
    const isOpen = currentTime >= start && currentTime <= end;
    console.log(`   ¿Está abierto? ${isOpen}`);
    
    return isOpen;
}

// 🕐 VERIFICAR SI ESTÁ ABIERTO DURANTE HORARIO PARTIDO
function isOpenDuringSplitSchedule(currentTime, timeRange) {
    const { morning, evening } = timeRange;
    
    console.log(`🕐 Horario partido - Comparación detallada:`);
    console.log(`   Hora actual: ${currentTime} (${Math.floor(currentTime/100)}:${(currentTime%100).toString().padStart(2,'0')})`);
    console.log(`   Mañana: ${morning.start}-${morning.end} (${Math.floor(morning.start/100)}:${(morning.start%100).toString().padStart(2,'0')} - ${Math.floor(morning.end/100)}:${(morning.end%100).toString().padStart(2,'0')})`);
    console.log(`   Noche: ${evening.start}-${evening.end} (${Math.floor(evening.start/100)}:${(evening.start%100).toString().padStart(2,'0')} - ${Math.floor(evening.end/100)}:${(evening.end%100).toString().padStart(2,'0')})`);
    
    const isOpenMorning = currentTime >= morning.start && currentTime <= morning.end;
    const isOpenEvening = currentTime >= evening.start && currentTime <= evening.end;
    const isOpen = isOpenMorning || isOpenEvening;
    
    console.log(`   ¿Abierto en turno mañana? ${isOpenMorning}`);
    console.log(`   ¿Abierto en turno noche? ${isOpenEvening}`);
    console.log(`   ¿Está abierto? ${isOpen}`);
    
    return isOpen;
}

// 🕐 PARSEAR RANGO DE HORARIOS (formato 24h con soporte para horarios partidos)
function parseTimeRange(schedule) {
    if (!schedule) {
        console.log(`⚠️ parseTimeRange: schedule es null/undefined`);
        return null;
    }
    
    console.log(`🔍 parseTimeRange: parsing "${schedule}"`);
    
    // Verificar si es un horario partido (contiene "/")
    if (schedule.includes('/')) {
        console.log(`📋 Detected split schedule: "${schedule}"`);
        const shifts = schedule.split('/');
        
        if (shifts.length !== 2) {
            console.log(`❌ parseTimeRange: invalid split format - expected 2 shifts, got ${shifts.length}`);
            return null;
        }
        
        const morningShift = parseSingleTimeRange(shifts[0].trim());
        const eveningShift = parseSingleTimeRange(shifts[1].trim());
        
        if (!morningShift || !eveningShift) {
            console.log(`❌ parseTimeRange: failed to parse one or both shifts`);
            return null;
        }
        
        console.log(`✅ Split schedule parsed successfully:`);
        console.log(`   Morning: ${morningShift.start} - ${morningShift.end}`);
        console.log(`   Evening: ${eveningShift.start} - ${eveningShift.end}`);
        
        return { 
            isSplit: true,
            morning: morningShift,
            evening: eveningShift
        };
    } else {
        // Horario continuo tradicional
        const singleRange = parseSingleTimeRange(schedule);
        if (singleRange) {
            return { 
                isSplit: false,
                start: singleRange.start,
                end: singleRange.end
            };
        }
        return null;
    }
}

// 🕐 PARSEAR UN RANGO DE HORARIO SIMPLE
function parseSingleTimeRange(scheduleStr) {
    if (!scheduleStr) return null;
    
    // Handle 24h format like "09:30-23:00" or "9:30–23:00" (with or without leading zeros)
    const timePattern = /(\d{1,2})(?::(\d{2}))?[\s]*[-–—][\s]*(\d{1,2})(?::(\d{2}))?/;
    console.log(`🔍 parseSingleTimeRange: testing pattern against "${scheduleStr}"`);
    const match = scheduleStr.match(timePattern);
    
    if (!match) {
        console.log(`❌ parseSingleTimeRange: no match found for "${scheduleStr}"`);
        return null;
    }
    
    console.log(`✅ parseSingleTimeRange: match found:`, match);
    
    const startHour = parseInt(match[1]);
    const startMin = match[2] ? parseInt(match[2]) : 0;
    
    const endHour = parseInt(match[3]);
    const endMin = match[4] ? parseInt(match[4]) : 0;
    
    console.log(`📝 Parsed time range:`);
    console.log(`   Start: ${startHour}:${startMin.toString().padStart(2,'0')}`);
    console.log(`   End: ${endHour}:${endMin.toString().padStart(2,'0')}`);
    
    const start = startHour * 100 + startMin;
    const end = endHour * 100 + endMin;
    
    return { start, end };
}

// 🟢 ESTABLECER NEGOCIO ABIERTO
function setBusinessOpen() {
    isOpen = true;
    const banner = document.getElementById('closed-banner');
    const container = document.querySelector('.container');
    
    if (banner) banner.style.display = 'none';
    if (container) container.classList.remove('orders-disabled');
    
    console.log('✅ Negocio abierto - Pedidos habilitados');
}

// 🔒 ESTABLECER NEGOCIO CERRADO
function setBusinessClosed(message) {
    isOpen = false;
    const banner = document.getElementById('closed-banner');
    const closedMessage = document.getElementById('closed-message');
    const container = document.querySelector('.container');
    
    if (banner) banner.style.display = 'block';
    if (closedMessage) closedMessage.textContent = message;
    if (container) container.classList.add('orders-disabled');
    
    console.log('🔒 Negocio cerrado:', message);
}

// ⏰ OBTENER PRÓXIMO HORARIO DE APERTURA
function getNextOpenTime() {
    const today = getCurrentDay();
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    
    // Check if we can open today
    const todaySchedule = businessInfo[today];
    if (todaySchedule && !todaySchedule.toLowerCase().includes('cerrado')) {
        const timeRange = parseTimeRange(todaySchedule);
        if (timeRange) {
            const argentinaTime = getArgentinaDate();
            const currentTime = argentinaTime.getHours() * 100 + argentinaTime.getMinutes();
            
            if (timeRange.isSplit) {
                // Para horarios partidos, verificar si podemos abrir en algún turno hoy
                const { morning, evening } = timeRange;
                
                if (currentTime < morning.start) {
                    // Podemos abrir en el turno de la mañana
                    const startHour = Math.floor(morning.start / 100);
                    const startMin = morning.start % 100;
                    return `hoy a las ${startHour}:${startMin.toString().padStart(2, '0')}`;
                } else if (currentTime > morning.end && currentTime < evening.start) {
                    // Estamos entre turnos, podemos abrir en el turno de la noche
                    const startHour = Math.floor(evening.start / 100);
                    const startMin = evening.start % 100;
                    return `hoy a las ${startHour}:${startMin.toString().padStart(2, '0')}`;
                }
            } else {
                // Horario continuo tradicional
                if (currentTime < timeRange.start) {
                    // We can still open today
                    const startHour = Math.floor(timeRange.start / 100);
                    const startMin = timeRange.start % 100;
                    return `hoy a las ${startHour}:${startMin.toString().padStart(2, '0')}`;
                }
            }
        }
    }
    
    // Look for next open day
    const currentDayIndex = days.indexOf(today);
    for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (currentDayIndex + i) % 7;
        const nextDay = days[nextDayIndex];
        const nextDayName = dayNames[nextDayIndex];
        const nextSchedule = businessInfo[nextDay];
        
        if (nextSchedule && !nextSchedule.toLowerCase().includes('cerrado')) {
            const timeRange = parseTimeRange(nextSchedule);
            if (timeRange) {
                if (timeRange.isSplit) {
                    // Para horarios partidos, usar el primer turno (mañana)
                    const startHour = Math.floor(timeRange.morning.start / 100);
                    const startMin = timeRange.morning.start % 100;
                    return `${nextDayName} a las ${startHour}:${startMin.toString().padStart(2, '0')}`;
                } else {
                    // Horario continuo tradicional
                    const startHour = Math.floor(timeRange.start / 100);
                    const startMin = timeRange.start % 100;
                    return `${nextDayName} a las ${startHour}:${startMin.toString().padStart(2, '0')}`;
                }
            }
        }
    }
    
    return 'próximamente';
}

// 🎯 CONFIGURAR EVENT LISTENERS
function setupEventListeners() {
    // 📂 Botones de categorías (se configurarán dinámicamente)
    setupCategoryListeners();

    // 🛒 Botón de pedido
    document.getElementById('order-btn').addEventListener('click', openModal);

    // 🖱️ Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        const modal = document.getElementById('order-modal');
        if (event.target === modal) {
            closeModal();
        }
    }
}

// 🎨 RENDERIZAR PRODUCTOS
function renderProducts() {
    const container = document.getElementById('products-container');
    
    if (isLoading) {
        showLoading();
        return;
    }
    
    if (products.length === 0) {
        showEmpty('No hay productos disponibles', 'Agrega productos a tu hoja de Google Sheets 📝');
        return;
    }
    
    // 🔍 Filtrar productos
    const filteredProducts = currentCategory === 'all' 
        ? products.filter(p => p.available !== false)
        : products.filter(p => p.category === currentCategory && p.available !== false);

    if (filteredProducts.length === 0) {
        showEmpty('No hay productos en esta categoría', 'Prueba con otra categoría 🔍');
        return;
    }

    // 🏗️ Generar HTML de productos
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-header">
                <div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                </div>
                <div class="product-price">$${formatPrice(product.price)}</div>
            </div>
            <div class="product-controls">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${product.id}, -1)" ${!cart[product.id] ? 'disabled' : ''}>-</button>
                    <span class="quantity-display">${cart[product.id] || 0}</span>
                    <button class="qty-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 🔢 ACTUALIZAR CANTIDAD EN CARRITO
function updateQuantity(productId, change) {
    // Bloquear pedidos si está cerrado
    if (!isOpen) {
        alert('🔒 No podemos recibir pedidos ahora. Estamos cerrados.');
        return;
    }
    
    if (!cart[productId]) cart[productId] = 0;
    cart[productId] += change;
    
    if (cart[productId] <= 0) {
        delete cart[productId];
    }
    
    renderProducts();
    updateCartDisplay();
}

// 🛒 ACTUALIZAR DISPLAY DEL CARRITO
function updateCartDisplay() {
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
        const product = products.find(p => p.id == id);
        return sum + (product ? product.price * qty : 0);
    }, 0);

    document.getElementById('cart-count').textContent = totalItems;
    document.getElementById('cart-total').textContent = formatPrice(totalPrice);
    document.getElementById('order-btn').disabled = totalItems === 0;
    
    // 👁️ Mostrar/ocultar carrito fijo
    const cartFixed = document.getElementById('cart-fixed');
    cartFixed.style.display = totalItems > 0 ? 'block' : 'none';
}

// 🚪 ABRIR MODAL DE PEDIDO
function openModal() {
    // Bloquear pedidos si está cerrado
    if (!isOpen) {
        alert('🔒 No podemos recibir pedidos ahora. Estamos cerrados.');
        return;
    }
    
    const orderSummary = document.getElementById('order-summary');
    const cartEntries = Object.entries(cart);
    
    if (cartEntries.length === 0) return;

    let summaryHTML = '<h3>📋 Resumen del pedido:</h3>';
    let total = 0;

    cartEntries.forEach(([id, qty]) => {
        const product = products.find(p => p.id == id);
        if (product) {
            const subtotal = product.price * qty;
            total += subtotal;
            
            summaryHTML += `
                <div class="summary-item">
                    <span>${product.name} (x${qty})</span>
                    <span>$${formatPrice(subtotal)}</span>
                </div>
            `;
        }
    });

    summaryHTML += `
        <div class="summary-item summary-total">
            <span>💰 TOTAL:</span>
            <span>$${formatPrice(total)}</span>
        </div>
    `;

    orderSummary.innerHTML = summaryHTML;
    document.getElementById('order-modal').style.display = 'block';
}

// ❌ CERRAR MODAL
function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
    document.getElementById('order-form').reset();
}

// 💳 IR A PAGAR CON MERCADOPAGO
async function goToPay() {
    // Bloquear pedidos si está cerrado
    if (!isOpen) {
        alert('🔒 No podemos procesar pagos ahora. Estamos cerrados.');
        return;
    }
    
    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const notes = document.getElementById('customer-notes').value.trim();

    if (!name) {
        alert('🚨 Por favor ingresa tu nombre');
        return;
    }
    
    if (!email) {
        alert('🚨 Por favor ingresa tu email');
        return;
    }
    
    // Validar formato de email básico
    if (!email.includes('@') || !email.includes('.')) {
        alert('🚨 Por favor ingresa un email válido');
        return;
    }

    // 📝 Preparar items para MercadoPago
    let items = [];
    let total = 0;

    Object.entries(cart).forEach(([id, qty]) => {
        const product = products.find(p => p.id == id);
        if (product) {
            const subtotal = product.price * qty;
            total += subtotal;
            
            items.push({
                id: id,
                title: product.name,
                description: product.description,
                quantity: qty,
                unit_price: product.price,
                currency_id: "ARS"
            });
        }
    });

    // 💾 Guardar datos del pedido en localStorage para la página de éxito
    const orderData = {
        customerName: name,
        customerEmail: email,
        customerNotes: notes,
        items: items,
        total: total,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('superdog_order', JSON.stringify(orderData));

    try {
        // 🔄 Mostrar loading
        document.querySelector('.btn-payment').innerHTML = '⏳ Preparando pago...';
        document.querySelector('.btn-payment').disabled = true;

        // 🛒 Crear preferencia de pago
        const preference = {
            items: items,
            payer: {
                name: name,
                email: email // Email del cliente
            },
            back_urls: {
                success: window.location.origin + "/success.html",
                failure: window.location.origin + "/failure.html",
                pending: window.location.origin + "/pending.html"
            },
            auto_return: "approved",
            statement_descriptor: "Super Hot Dog"
        };

        // 🚀 CREAR PREFERENCIA CON NETLIFY FUNCTION
        console.log('Creando preferencia con Netlify Function...');
        
        const response = await fetch('/.netlify/functions/create-preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preference)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('Preferencia creada:', data);

        if (!data.init_point) {
            throw new Error('No se recibió URL de pago de MercadoPago');
        }

        // 🚀 Redirigir al checkout de MercadoPago
        console.log('Redirigiendo a MercadoPago:', data.init_point);
        window.location.href = data.init_point;

    } catch (error) {
        console.error('Error creando preferencia:', error);
        alert('❌ Error al procesar el pago. Inténtalo de nuevo.');
        
        // 🔄 Restaurar botón
        document.querySelector('.btn-payment').innerHTML = '💳 Ir a pagar';
        document.querySelector('.btn-payment').disabled = false;
    }
}

// 📱 ENVIAR PEDIDO POR WHATSAPP (función auxiliar)
function sendWhatsApp() {
    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const notes = document.getElementById('customer-notes').value.trim();

    if (!name) {
        alert('🚨 Por favor ingresa tu nombre');
        return;
    }
    
    if (!email) {
        alert('🚨 Por favor ingresa tu email');
        return;
    }
    
    // Validar formato de email básico
    if (!email.includes('@') || !email.includes('.')) {
        alert('🚨 Por favor ingresa un email válido');
        return;
    }

    // 📝 Construir mensaje para WhatsApp
    let message = `🌭🦸‍♂️ *NUEVO PEDIDO - SUPER HOT DOG* 💥\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📧 *Email:* ${email}\n`;
    if (notes) message += `📝 *Aclaraciones:* ${notes}\n`;
    message += `\n📋 *PEDIDO:*\n`;

    let total = 0;
    Object.entries(cart).forEach(([id, qty]) => {
        const product = products.find(p => p.id == id);
        if (product) {
            const subtotal = product.price * qty;
            total += subtotal;
            message += `• ${product.name} (x${qty}) - $${formatPrice(subtotal)}\n`;
        }
    });

    message += `\n💰 *TOTAL: $${formatPrice(total)}*\n\n`;
    
    // Usar información del negocio de Google Sheets si está disponible
    const businessName = businessInfo.name || BUSINESS_INFO.name;
    const businessAddress = businessInfo.address || BUSINESS_INFO.address;
    const businessInstagram = businessInfo.instagram || BUSINESS_INFO.instagram;
    
    message += `📍 *Dirección:* ${businessAddress}\n`;
    if (businessInstagram) {
        message += `📱 *Instagram:* ${businessInstagram}\n`;
    }
    if (businessInfo.schedule) {
        message += `🕒 *Horarios:* ${businessInfo.schedule}\n`;
    }
    message += `\n🦸‍♂️ ¡Gracias por elegir ${businessName}! Te contactaremos pronto para confirmar tu súper pedido.`;

    // 🚀 Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // 🧹 Limpiar carrito y cerrar modal
    cart = {};
    updateCartDisplay();
    renderProducts();
    closeModal();
    
    alert('🎉 ¡Pedido enviado! Te redirigimos a WhatsApp para completar tu súper pedido.');
}

// 🔄 MOSTRAR ESTADO DE CARGA
function showLoading() {
    const container = document.getElementById('products-container');
    container.innerHTML = `
        <div class="loading">
            <h3>🔄 Cargando súper catálogo...</h3>
            <p>Conectando con Google Sheets... ⚡</p>
        </div>
    `;
}

// ❌ MOSTRAR ERROR
function showError(message) {
    const container = document.getElementById('products-container');
    container.innerHTML = `
        <div class="error">
            <h3>⚠️ Error de conexión</h3>
            <p>${message}</p>
            <p>Verifica la configuración de Google Sheets 📊</p>
            <button class="error-btn" onclick="refreshCatalog()">
                🔄 Intentar de nuevo
            </button>
        </div>
    `;
}

// 📝 MOSTRAR ESTADO VACÍO
function showEmpty(title, description) {
    const container = document.getElementById('products-container');
    container.innerHTML = `
        <div class="empty">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;
}

// 📢 MOSTRAR NOTIFICACIÓN DE ACTUALIZACIÓN
function showUpdateNotification() {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = '🔄 Catálogo actualizado automáticamente';
    document.body.appendChild(notification);
    
    // Agregar animación CSS si no existe
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// 🎯 Ejemplo de datos para Google Sheets (comentario para referencia)
/*
ESTRUCTURA DE LA HOJA DE GOOGLE SHEETS:

Fila 1 (Encabezados):
A: Nombre | B: Descripción | C: Precio | D: Categoría | E: Imagen URL | F: Disponible

Ejemplos de datos (filas 2+):
Super Dog Gigante | Hot dog de 34cm con salchicha ahumada especial | 12.99 | super-dogs | | TRUE
Pollo Broaster | Pollo crispy con salsa especial | 8.99 | pollo | | TRUE
Hot Dog Clásico | Salchicha tradicional con pan y salsas | 6.99 | clasicos | | TRUE
Papas Super | Papas fritas gigantes para compartir | 4.99 | acompañamientos | | TRUE
Combo Héroe | Super Dog + Papas + Bebida | 18.99 | combos | | TRUE
Coca Cola | Gaseosa 500ml | 2.99 | bebidas | | TRUE
*/