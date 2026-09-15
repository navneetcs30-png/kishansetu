import { Pool } from 'pg';
import { getSupabaseClient, isSupabaseConfigured, checkSupabaseHealth } from '../services/supabaseClient';
import { platformDb } from './db';

// Lazy initialized PostgreSQL connection pool for direct database connection
let pgPool: Pool | null = null;

function getPgPool(): Pool | null {
  const connStr = process.env.DATABASE_URL;
  if (!connStr) return null;

  if (!pgPool) {
    try {
      pgPool = new Pool({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
      pgPool.on('error', (err) => {
        console.warn('⚠️ Supabase Postgres Pool error (non-fatal):', err.message);
      });
    } catch (e: any) {
      console.warn('⚠️ Failed to initialize Postgres pool:', e.message);
      pgPool = null;
    }
  }
  return pgPool;
}

export interface FarmerVerificationRecord {
  id: string;
  userId?: string;
  farmerName: string;
  aadhaarMasked: string;
  state: string;
  district: string;
  village: string;
  landSizeAcres: number;
  cropsGrown: string[];
  kisanId?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  documents: any[];
  reviewerNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export class SupabaseDataService {
  /**
   * Retrieves overall database connection health & diagnostic metrics
   */
  public async getStatus() {
    const timestamp = new Date().toISOString();
    const pool = getPgPool();

    // 1. First priority: Direct Postgres Connection Pool
    if (pool) {
      const start = Date.now();
      try {
        const res = await pool.query('SELECT NOW() as db_time, version() as version;');
        const latencyMs = Date.now() - start;
        return {
          provider: 'SUPABASE_POSTGRESQL_CLOUD',
          activeMode: 'Supabase Cloud Live (PostgreSQL 17)',
          supabase: {
            configured: true,
            connected: true,
            endpoint: 'db.zbwpvedsulwjzbejynqa.supabase.co:5432',
            latencyMs,
            serverTime: res.rows[0]?.db_time,
            version: res.rows[0]?.version?.split(',')[0],
            timestamp,
          },
          localDb: platformDb.getDatabaseStats(),
          timestamp,
        };
      } catch (err: any) {
        console.warn('⚠️ Direct Postgres health check failed, falling back:', err.message);
      }
    }

    // 2. Second priority: Supabase JS Client
    const health = await checkSupabaseHealth();
    if (health.connected) {
      return {
        provider: 'SUPABASE_REST_CLOUD',
        activeMode: 'Supabase Cloud Live (REST API)',
        supabase: health,
        localDb: platformDb.getDatabaseStats(),
        timestamp,
      };
    }

    // 3. Fallback: Local database
    return {
      provider: 'LOCAL_STORAGE_FALLBACK',
      activeMode: 'Local Offline Resilient',
      supabase: health,
      localDb: platformDb.getDatabaseStats(),
      timestamp,
    };
  }

  /**
   * Fetch government MSP rates
   */
  public async getMspRates() {
    const pool = getPgPool();
    if (pool) {
      try {
        const { rows } = await pool.query('SELECT * FROM public.crops_msp ORDER BY crop_name ASC;');
        if (rows && rows.length > 0) {
          return { source: 'supabase_postgres', data: rows };
        }
      } catch (err: any) {
        console.warn('⚠️ Postgres getMspRates query failed:', err.message);
      }
    }

    const client = getSupabaseClient(true);
    if (client) {
      try {
        const { data, error } = await client
          .from('crops_msp')
          .select('*')
          .order('crop_name');

        if (!error && data && data.length > 0) {
          return { source: 'supabase_rest', data };
        }
      } catch (err) {
        console.warn('⚠️ Supabase REST getMspRates query failed:', err);
      }
    }

    // Default fallback MSP rates
    return {
      source: 'local_fallback',
      data: [
        { crop_name: 'Wheat', hindi_name: 'गेहूं', category: 'Grain', msp_rate: 2275.0, unit: 'Quintal (100 kg)', effective_year: '2025-26' },
        { crop_name: 'Paddy (Common)', hindi_name: 'धान (सामान्य)', category: 'Grain', msp_rate: 2183.0, unit: 'Quintal (100 kg)', effective_year: '2025-26' },
        { crop_name: 'Paddy (Grade A)', hindi_name: 'धान (ग्रेड-ए)', category: 'Grain', msp_rate: 2203.0, unit: 'Quintal (100 kg)', effective_year: '2025-26' },
        { crop_name: 'Mustard / Rapeseed', hindi_name: 'सरसों', category: 'Oilseed', msp_rate: 5650.0, unit: 'Quintal (100 kg)', effective_year: '2025-26' },
        { crop_name: 'Gram (Chana)', hindi_name: 'चना', category: 'Pulse', msp_rate: 5440.0, unit: 'Quintal (100 kg)', effective_year: '2025-26' },
        { crop_name: 'Maize', hindi_name: 'मक्का', category: 'Grain', msp_rate: 2090.0, unit: 'Quintal (100 kg)', effective_year: '2025-26' },
        { crop_name: 'Bajra', hindi_name: 'बाजरा', category: 'Grain', msp_rate: 2500.0, unit: 'Quintal (100 kg)', effective_year: '2025-26' }
      ]
    };
  }

  /**
   * Fetch wholesale vegetable mandi spot prices
   */
  public async getMandiRates() {
    const pool = getPgPool();
    if (pool) {
      try {
        const { rows } = await pool.query('SELECT * FROM public.mandi_rates ORDER BY commodity ASC;');
        if (rows && rows.length > 0) {
          return { source: 'supabase_postgres', data: rows };
        }
      } catch (err: any) {
        console.warn('⚠️ Postgres getMandiRates query failed:', err.message);
      }
    }

    const client = getSupabaseClient(true);
    if (client) {
      try {
        const { data, error } = await client
          .from('mandi_rates')
          .select('*')
          .order('commodity');

        if (!error && data && data.length > 0) {
          return { source: 'supabase_rest', data };
        }
      } catch (err) {
        console.warn('⚠️ Supabase REST getMandiRates query failed:', err);
      }
    }

    return {
      source: 'local_fallback',
      data: [
        { commodity: 'Potato', hindi_name: 'आलू', market_name: 'Agra Mandi', state: 'Uttar Pradesh', min_price: 1300, modal_price: 1450, max_price: 1600, unit: '₹/Quintal' },
        { commodity: 'Onion', hindi_name: 'प्याज', market_name: 'Lasalgaon Mandi', state: 'Maharashtra', min_price: 1900, modal_price: 2100, max_price: 2350, unit: '₹/Quintal' },
        { commodity: 'Tomato', hindi_name: 'टमाटर', market_name: 'Kolar Mandi', state: 'Karnataka', min_price: 1600, modal_price: 1850, max_price: 2100, unit: '₹/Quintal' },
        { commodity: 'Green Peas', hindi_name: 'हरी मटर', market_name: 'Jabalpur Mandi', state: 'Madhya Pradesh', min_price: 3200, modal_price: 3600, max_price: 4000, unit: '₹/Quintal' },
        { commodity: 'Green Chilli', hindi_name: 'हरी मिर्च', market_name: 'Guntur Mandi', state: 'Andhra Pradesh', min_price: 3800, modal_price: 4200, max_price: 4700, unit: '₹/Quintal' },
        { commodity: 'Cauliflower', hindi_name: 'फूलगोभी', market_name: 'Hapur Mandi', state: 'Uttar Pradesh', min_price: 1400, modal_price: 1600, max_price: 1850, unit: '₹/Quintal' }
      ]
    };
  }

  /**
   * Record an audit event in Supabase or local log
   */
  public async recordAuditLog(action: string, actor: string, details: string, status: 'SUCCESS' | 'FAILED' | 'WARNING') {
    const pool = getPgPool();
    if (pool) {
      try {
        await pool.query(
          'INSERT INTO public.audit_logs (action, actor, details, status, created_at) VALUES ($1, $2, $3, $4, NOW());',
          [action, actor, details, status]
        );
      } catch (err: any) {
        console.warn('⚠️ Postgres audit log insert error:', err.message);
      }
    }

    // Always keep local copy in sync
    platformDb.logAudit(action, actor, details, status);
  }
}

export const supabaseService = new SupabaseDataService();
