import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Helper: formatear movimientos
function formatMovimientos(movs: any[], origen: string) {
  return movs.map((m: any) => {
    // Preferir el monto total pagado por el cliente (antes de comisiones)
    const totalAmount = m.total_paid_amount ?? m.transaction_amount ?? 0;
    const feeDetails = m.fee_details || [];
    const totalFee = feeDetails.reduce((sum: number, fee: any) => sum + Number(fee.amount || 0), 0);
    const netAmount = totalAmount - totalFee;
    return {
      fecha: m.fecha || (m.date_created ? m.date_created.slice(0, 10) : ''),
      descripcion: m.descripcion || (m.description ? m.description : 'Sin descripción'),
      monto: Number(m.monto ?? totalAmount ?? 0), // Usar monto total pagado
      tipo: m.tipo || (totalAmount > 0 ? 'ingreso' : 'egreso'),
      origen,
      id: String(m.id ?? '')
    };
  });
}

// MercadoPago
app.get('/api/ingresos/mercadopago', async (req: Request, res: Response) => {
  try {
    const dias = Number(req.query.dias) || 30;
    const token = process.env.MERCADOPAGO_TOKEN;
    if (!token || token === 'REEMPLAZA_CON_TU_TOKEN_MERCADOPAGO') {
      return res.status(500).json({ error: 'Token de MercadoPago no configurado' });
    }

    const url = 'https://api.mercadopago.com/v1/payments/search';
    const params = {
      sort: 'date_created',
      criteria: 'desc',
      range: 'date_created',
      begin_date: `NOW-${dias}DAYS`,
      end_date: 'NOW',
      limit: 50,
      status: 'approved'
    };
    const resp = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    const movimientos = formatMovimientos(resp.data.results || [], 'MercadoPago');
    // Debug: loguear el movimiento del 21 de noviembre si existe
    const movNov21 = (resp.data.results || []).find((m: any) => m.date_created?.startsWith('2024-11-21'));
    if (movNov21) {
      console.log('[DEBUG] Movimiento 21 Nov (crudo):', movNov21);
      console.log('[DEBUG] Montos:', {
        transaction_amount: movNov21.transaction_amount,
        total_paid_amount: movNov21.total_paid_amount,
        net_amount: movNov21.net_amount,
        fee_details: movNov21.fee_details
      });
    }
    res.json({
      source: 'mercadopago',
      dias,
      saldo: 0, // TODO: endpoint de saldo si lo necesitas
      movimientos
    });
  } catch (err: any) {
    console.error('[MercadoPago]', err.response?.data || err.message);
    res.status(500).json({ error: 'Error al obtener datos de MercadoPago' });
  }
});

// CuentaDNI (placeholder: adaptar a la API real)
app.get('/api/ingresos/cuentadni', async (req: Request, res: Response) => {
  try {
    const dias = Number(req.query.dias) || 30;
    const token = process.env.CUENTA_DNI_TOKEN;
    if (!token || token === 'REEMPLAZA_CON_TU_TOKEN_CUENTADNI') {
      return res.status(500).json({ error: 'Token de CuentaDNI no configurado' });
    }
    // TODO: implementar llamada real a la API de CuentaDNI
    res.json({
      source: 'cuentadni',
      dias,
      saldo: 0,
      movimientos: []
    });
  } catch (err: any) {
    console.error('[CuentaDNI]', err.message);
    res.status(500).json({ error: 'Error al obtener datos de CuentaDNI' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend en http://localhost:${PORT}`);
});
