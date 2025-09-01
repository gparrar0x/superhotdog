// Netlify Function para guardar pedidos en Google Sheets
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Manejar preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Verificar variables de entorno
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
        
        if (!GOOGLE_API_KEY || !GOOGLE_SHEET_ID) {
            console.error('Missing environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Server configuration error',
                    message: 'Missing Google Sheets credentials'
                })
            };
        }

        // Parsear datos del pedido
        const orderData = JSON.parse(event.body);
        console.log('Saving order:', orderData);

        // Generar ID único del pedido (formato: SHD-YYYYMMDD-XXX)
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const orderId = `SHD-${dateStr}-${randomSuffix}`;

        // Preparar fila para insertar en Google Sheets
        // Columnas: ID_Pedido, Fecha, Cliente, Items_JSON, Total, Estado, Pago_Metodo, Pago_ID, Telefono, Notas
        const rowData = [
            orderId,                                           // A: ID_Pedido
            now.toISOString(),                                // B: Fecha (ISO format)
            orderData.customerName || '',                     // C: Cliente
            JSON.stringify(orderData.items || []),            // D: Items_JSON
            parseFloat(orderData.total || 0),                 // E: Total
            orderData.status || 'pendiente',                  // F: Estado
            orderData.paymentMethod || 'efectivo',            // G: Pago_Metodo
            orderData.paymentId || '',                        // H: Pago_ID
            orderData.customerPhone || '',                    // I: Telefono
            orderData.customerNotes || ''                     // J: Notas
        ];

        // URL para insertar datos en Google Sheets
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Pedidos:append?valueInputOption=USER_ENTERED&key=${GOOGLE_API_KEY}`;
        
        const payload = {
            values: [rowData]
        };

        console.log('Sending to Google Sheets:', {
            url: url.replace(GOOGLE_API_KEY, '[REDACTED]'),
            payload: payload
        });

        // Hacer request a Google Sheets API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Sheets API error:', response.status, errorText);
            
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: `Google Sheets API error: ${response.status}`,
                    details: errorText
                })
            };
        }

        const result = await response.json();
        console.log('Google Sheets response:', result);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                orderId: orderId,
                message: 'Pedido guardado correctamente',
                details: {
                    range: result.updates?.updatedRange,
                    rows: result.updates?.updatedRows
                }
            })
        };

    } catch (error) {
        console.error('Error saving order:', error);
        
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