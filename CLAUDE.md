# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development
```bash
# Start local development server with Netlify Functions
netlify dev

# Start development server with debug logs
netlify dev --debug

# Start on specific port
netlify dev --port 3000

# Simple Python server (fallback)
python3 -m http.server 8000
```

### Build & Deployment
```bash
# Build for production (static site)
netlify build

# Deploy to Netlify
git push origin main  # Auto-deploys via Netlify integration
```

## Project Architecture

This is a **static website** for Super Hot Dog restaurant in Bariloche with:

### Frontend Structure
- **Static HTML pages**: `index.html`, `success.html`, `failure.html`, `pending.html`
- **CSS**: Single stylesheet at `assets/styles.css` with superhero comic book theme
- **JavaScript**: Inline in HTML files (no separate JS files)
- **Assets**: Logo, favicon, and images in `assets/` directory

### Backend (Netlify Functions)
- **`netlify/functions/get-sheets-data.js`**: Fetches product catalog and business info from Google Sheets
- **`netlify/functions/create-preference.js`**: Creates MercadoPago payment preferences
- **`netlify/functions/save-order.js`**: Saves completed orders to Google Sheets "Pedidos" tab
- **`netlify/functions/get-orders.js`**: Retrieves orders from Google Sheets (optional for admin use)

### Data Sources
- **Google Sheets**: Three tabs - "Productos" (products), "Informacion" (business info), and "Pedidos" (orders)
- **Real-time updates**: Business hours, product availability, and catalog managed via Google Sheets
- **Order tracking**: All orders automatically registered with unique IDs (format: SHD-YYYYMMDD-XXX)

### Key Features
- **Business Hours Management**: Dynamic open/closed status with Argentina timezone
- **MercadoPago Integration**: Full payment processing with success/failure pages
- **WhatsApp Integration**: Order confirmations sent via WhatsApp
- **Responsive Design**: Mobile-first superhero comic book theme

## Environment Variables

Required in `.env` for local development and Netlify dashboard for production:

```bash
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_API_KEY=your_google_api_key_here  
MP_ACCESS_TOKEN=your_mercadopago_token_here
```

## Google Sheets Structure

### "Productos" Tab (A1:E)
- A: Nombre (Product Name)
- B: Descripción (Description) 
- C: Precio (Price - integer, no decimals)
- D: Categoría (Category: super-dogs, clasicos, pollo, acompañamientos, bebidas, combos)
- E: Disponible (Available: TRUE/FALSE)

### "Informacion" Tab (A1:B)
- A: Campo (Field names: nombre, direccion, telefono, instagram, lunes-domingo)
- B: Valor (Values including business hours in 24h format: "10:30-23:00")

### "Pedidos" Tab (A1:J)
- A: ID_Pedido (Format: SHD-YYYYMMDD-XXX)
- B: Fecha (ISO timestamp)
- C: Cliente (Customer name)
- D: Items_JSON (Stringified JSON of order items)
- E: Total (Order total)
- F: Estado (Status: pendiente, preparando, listo, entregado, cancelado)
- G: Pago_Metodo (Payment method: efectivo, mercadopago)
- H: Pago_ID (MercadoPago payment ID if applicable)
- I: Telefono (Customer phone)
- J: Notas (Customer notes)

## Code Conventions

- **No separate JS files**: JavaScript is embedded directly in HTML files
- **CSS**: Single stylesheet with CSS custom properties for theming
- **Colors**: Superhero theme (red #dc2626, blue #1e40af, yellow #fbbf24)
- **Phone numbers**: Include country code format: "+54 11 1234-5678"
- **Business hours**: 24-hour format "HH:MM-HH:MM"
- **Argentina timezone**: All time calculations use "America/Argentina/Buenos_Aires"

## Important Notes

- **No build process**: This is a static site that deploys directly
- **No package management**: Dependencies loaded via CDN (MercadoPago SDK, Google Fonts)
- **CORS handling**: Configured in `netlify.toml` for functions
- **Security**: Never commit API keys - use environment variables only