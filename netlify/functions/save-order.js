// Netlify Function para guardar pedidos en Google Sheets
const fetch = require('node-fetch');
const { readFileSync } = require('fs');
const path = require('path');

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
        const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
        
        if (!GOOGLE_SHEET_ID) {
            console.error('Missing GOOGLE_SHEET_ID');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Server configuration error',
                    message: 'Missing Google Sheets ID'
                })
            };
        }

        // Obtener access token usando service account
        const accessToken = await getAccessToken();

        // Parsear datos del pedido
        const orderData = JSON.parse(event.body);
        console.log('Saving order:', orderData);

        // Generar ID único del pedido (formato: SHD-YYYYMMDD-XXX) con timezone Buenos Aires
        const now = new Date();
        const buenosAiresDate = new Date(now.toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
        const dateStr = buenosAiresDate.toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const orderId = `SHD-${dateStr}-${randomSuffix}`;

        // Preparar fila para insertar en Google Sheets
        // Columnas: ID_Pedido, Fecha, Cliente, Total, Estado, Pago_Metodo, Pago_ID, Telefono, email, Notas
        const rowData = [
            orderId,                                           // A: ID_Pedido
            buenosAiresDate.toISOString(),                    // B: Fecha (Buenos Aires timezone)
            orderData.customerName || '',                     // C: Cliente
            parseFloat(orderData.total || 0),                 // D: Total
            orderData.status || 'pendiente',                  // E: Estado
            orderData.paymentMethod || 'efectivo',            // F: Pago_Metodo
            orderData.paymentId || '',                        // G: Pago_ID
            orderData.customerPhone || '',                    // H: Telefono
            orderData.customerEmail || '',                    // I: email
            orderData.customerNotes || ''                     // J: Notas
        ];

        // URL para insertar datos en Google Sheets
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Pedidos:append?valueInputOption=USER_ENTERED`;
        
        const payload = {
            values: [rowData]
        };

        console.log('Sending to Google Sheets:', {
            url,
            payload: payload
        });

        // Hacer request a Google Sheets API con OAuth token
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
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

// Función para obtener access token usando service account
async function getAccessToken() {
    try {
        // Obtener credenciales desde variables de entorno o archivo local
        let credentials;
        
        if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
            // En producción: usar variable de entorno
            credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        } else {
            // En desarrollo local: usar archivo
            const credentialsPath = path.join(__dirname, '../../superhotdog-ea5950f3bcbd.json');
            credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
        }
        
        // Crear JWT assertion
        const jwt = createJWT(credentials);
        
        // Intercambiar JWT por access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt
            })
        });
        
        if (!tokenResponse.ok) {
            const error = await tokenResponse.text();
            throw new Error(`Token request failed: ${error}`);
        }
        
        const tokenData = await tokenResponse.json();
        return tokenData.access_token;
        
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}

// Función para crear JWT
function createJWT(credentials) {
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };
    
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: credentials.client_email,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600 // 1 hora
    };
    
    const crypto = require('crypto');
    
    const encodedHeader = base64urlEncode(JSON.stringify(header));
    const encodedPayload = base64urlEncode(JSON.stringify(payload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    
    const signature = crypto
        .createSign('RSA-SHA256')
        .update(signingInput)
        .sign(credentials.private_key, 'base64');
    
    const encodedSignature = base64urlEncode(Buffer.from(signature, 'base64'));
    
    return `${signingInput}.${encodedSignature}`;
}

// Función para codificar en base64url
function base64urlEncode(data) {
    if (typeof data === 'string') {
        data = Buffer.from(data);
    }
    return data.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}