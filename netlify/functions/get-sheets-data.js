// Function to parse business information from the Informacion sheet
function parseBusinessInfo(infoRows) {
    const businessInfo = {};
    
    // Parse rows looking for key-value pairs
    // Expected format: Key in column A, Value in column B
    for (let i = 0; i < infoRows.length; i++) {
        const row = infoRows[i];
        if (row && row[0] && row[1]) {
            const key = row[0].toLowerCase().trim();
            const value = row[1].trim();
            
            // Map common keys
            switch (key) {
                case 'direccion':
                case 'dirección':
                case 'address':
                    businessInfo.address = value;
                    break;
                case 'telefono':
                case 'teléfono':
                case 'phone':
                case 'whatsapp':
                    businessInfo.phone = value;
                    break;
                case 'horarios':
                case 'horario':
                case 'schedule':
                case 'hours':
                    businessInfo.schedule = value;
                    break;
                case 'lunes':
                case 'martes':
                case 'miércoles':
                case 'miercoles':
                case 'jueves':
                case 'viernes':
                case 'sábado':
                case 'sabado':
                case 'domingo':
                    // Store individual day schedules
                    businessInfo[key] = value;
                    break;
                case 'nombre':
                case 'name':
                    businessInfo.name = value;
                    break;
                case 'instagram':
                    businessInfo.instagram = value;
                    break;
                case 'email':
                case 'correo':
                    businessInfo.email = value;
                    break;
                default:
                    businessInfo[key] = value;
            }
        }
    }
    
    // Create a consolidated schedule if we have individual days but no general schedule
    if (!businessInfo.schedule && (businessInfo.lunes || businessInfo.martes)) {
        const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const schedules = days.map(day => businessInfo[day]).filter(Boolean);
        
        // Check if all days have the same schedule
        if (schedules.length > 0) {
            const firstSchedule = schedules[0];
            const allSame = schedules.every(schedule => schedule === firstSchedule);
            
            if (allSame) {
                businessInfo.schedule = `Todos los días: ${firstSchedule}`;
            } else {
                // Different schedules, show them individually
                const dayNames = {
                    lunes: 'L', martes: 'M', miercoles: 'X', 
                    jueves: 'J', viernes: 'V', sabado: 'S', domingo: 'D'
                };
                const scheduleText = days
                    .filter(day => businessInfo[day])
                    .map(day => `${dayNames[day]}: ${businessInfo[day]}`)
                    .join(' | ');
                businessInfo.schedule = scheduleText;
            }
        }
    }
    
    return businessInfo;
}

// Netlify Function to fetch Google Sheets data securely
exports.handler = async (event, context) => {
    // Configure CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    // Only allow GET
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Get credentials from environment variables
        const SHEET_ID = process.env.GOOGLE_SHEET_ID;
        const API_KEY = process.env.GOOGLE_API_KEY;
        
        if (!SHEET_ID || !API_KEY) {
            console.error('Google Sheets credentials not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Google Sheets credentials not configured',
                    message: 'Configure GOOGLE_SHEET_ID and GOOGLE_API_KEY in Netlify environment variables'
                })
            };
        }

        // Fetch both products and business information
        const PRODUCTS_RANGE = 'Productos!A:E';
        const INFO_RANGE = 'Informacion!A:C'; // Business information sheet
        
        const productsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${PRODUCTS_RANGE}?key=${API_KEY}`;
        const infoUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(INFO_RANGE)}?key=${API_KEY}`;

        console.log('Fetching Google Sheets data...');

        // Fetch products and business info in parallel
        const [productsResponse, infoResponse] = await Promise.all([
            fetch(productsUrl),
            fetch(infoUrl)
        ]);

        if (!productsResponse.ok) {
            const errorText = await productsResponse.text();
            console.error('Products API error:', productsResponse.status, errorText);
            
            return {
                statusCode: productsResponse.status,
                headers,
                body: JSON.stringify({ 
                    error: `Products API error: ${productsResponse.status}`,
                    details: errorText
                })
            };
        }

        const productsData = await productsResponse.json();
        
        // Business info is optional, don't fail if it doesn't exist
        let businessInfo = {};
        
        if (infoResponse.ok) {
            const infoData = await infoResponse.json();
            businessInfo = parseBusinessInfo(infoData.values || []);
            console.log('✅ Business info loaded successfully');
        } else {
            console.warn('⚠️ Business info sheet not accessible, using defaults');
        }
        
        console.log('Google Sheets data fetched successfully');

        // Process the products data
        const rows = productsData.values || [];
        const products = [];
        const categorySet = new Set();

        // Skip header row and process data
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row && row[0]) { // Check if row has data
                const category = row[3] || 'otros';
                const availableValue = row[4];
                
                // Debug log for availability values
                console.log(`Product "${row[0]}" availability value:`, JSON.stringify(availableValue), typeof availableValue);
                
                // More robust availability check: only FALSE if explicitly set to FALSE
                let isAvailable = true;
                if (availableValue) {
                    const availableStr = String(availableValue).trim().toLowerCase();
                    isAvailable = availableStr !== 'false';
                }
                
                const product = {
                    id: i,
                    name: row[0] || '',
                    description: row[1] || '',
                    price: parseFloat(row[2]) || 0,
                    category: category,
                    image: '',
                    available: isAvailable
                };
                products.push(product);
                
                // Add category to set (only for available products)
                if (product.available) {
                    categorySet.add(category);
                }
            }
        }

        // Convert category set to sorted array
        const categories = Array.from(categorySet).sort();

        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            },
            body: JSON.stringify({
                success: true,
                products: products,
                categories: categories,
                businessInfo: businessInfo,
                lastUpdated: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};