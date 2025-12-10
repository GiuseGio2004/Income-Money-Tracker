# Backend (Node.js + TypeScript)

## Arranque rápido

1. **Instalar dependencias**
   ```bash
   cd Backend
   npm install
   ```

2. **Configurar variables de entorno**
   - Copia `.env.example` a `.env` y completa:
     ```
     MERCADOPAGO_TOKEN=APP_USR-...
     CUENTA_DNI_TOKEN=...
     FRONTEND_ORIGIN=http://localhost:3000
     ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   El servidor arrancará en http://localhost:8000

4. **Health check**
   - GET http://localhost:8000/api/health

## Endpoints

- GET `/api/ingresos/mercadopago?dias=30`
- GET `/api/ingresos/cuentadni?dias=30`

## Scripts

- `npm run dev`: desarrollo con recarga
- `npm run build`: compila a `dist/`
- `npm start`: ejecuta la versión compilada

## Notas

- El frontend ya apunta a `NEXT_PUBLIC_API_URL=http://localhost:8000`.
- Si cambias el puerto, actualízalo en `Frontend/.env.local`.
