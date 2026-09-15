import { getSupabaseClient, isSupabaseConfigured, checkSupabaseHealth } from '../services/supabaseClient';
import { platformDb, DatabaseUser } from './db';

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
    const health = await checkSupabaseHealth();
    const localStats = platformDb.getDatabaseStats();

    return {
      provider: health.connected ? 'SUPABASE_POSTGRES' : 'LOCAL_STORAGE_FALLBACK',
      supabase: health,
      localDb: localStats,
      activeMode: health.connected ? 'Cloud (Supabase Live)' : 'Local Offline Resilient',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fetch government MSP rates
   */
  public async getMspRates() {
    const client = getSupabaseClient(true);
    if (client) {
      try {
        const { data, error } = await client
          .from('crops_msp')
          .select('*')
          .order('crop_name');

        if (!error && data && data.length > 0) {
          return { source: 'supabase', data };
        }
      } catch (err) {
        console.warn('⚠️ Supabase getMspRates query failed, returning local default:', err);
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
    const client = getSupabaseClient(true);
    if (client) {
      try {
        const { data, error } = await client
          .from('mandi_rates')
          .select('*')
          .order('commodity');

        if (!error && data && data.length > 0) {
          return { source: 'supabase', data };
        }
      } catch (err) {
        console.warn('⚠️ Supabase getMandiRates query failed, returning local default:', err);
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
    const client = getSupabaseClient(true);
    if (client) {
      try {
        await client.from('audit_logs').insert([
          { action, actor, details, status, created_at: new Date().toISOString() }
        ]);
      } catch (err) {
        console.warn('⚠️ Supabase audit log insert error:', err);
      }
    }

    // Always keep local copy in sync
    platformDb.logAudit(action, actor, details, status);
  }
}

export const supabaseService = new SupabaseDataService();
