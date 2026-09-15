import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve environment variables safely in both Vite (browser) and Node environments
const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const val = (import.meta as any).env[key];
    if (val && typeof val === 'string' && val.trim()) return val.trim();
  }
  if (typeof process !== 'undefined' && process.env) {
    const val = process.env[key];
    if (val && typeof val === 'string' && val.trim()) return val.trim();
  }
  return '';
};

export const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');
export const SUPABASE_SERVICE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase client instance if credentials are valid, or null if unconfigured.
 */
export function getSupabaseClient(useServiceKey: boolean = false): SupabaseClient | null {
  const keyToUse = useServiceKey && SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !keyToUse) {
    return null;
  }

  // Prevent invalid dummy placeholder strings from causing crash
  if (SUPABASE_URL.includes('your-project-id') || keyToUse.includes('your-anon')) {
    return null;
  }

  if (!clientInstance || useServiceKey) {
    try {
      const client = createClient(SUPABASE_URL, keyToUse, {
        auth: {
          persistSession: typeof window !== 'undefined',
          autoRefreshToken: typeof window !== 'undefined',
        },
      });
      if (!useServiceKey) {
        clientInstance = client;
      }
      return client;
    } catch (err) {
      console.warn('⚠️ Error initializing Supabase client:', err);
      return null;
    }
  }

  return clientInstance;
}

/**
 * Returns true if Supabase URL and API Key are properly set up in environment variables.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project-id') &&
    !SUPABASE_ANON_KEY.includes('your-anon')
  );
}

export interface SupabaseHealthResult {
  configured: boolean;
  connected: boolean;
  url?: string;
  latencyMs?: number;
  error?: string;
  timestamp: string;
}

/**
 * Tests live connection to Supabase database.
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthResult> {
  const timestamp = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      timestamp,
      error: 'Supabase credentials not configured in .env',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      configured: false,
      connected: false,
      timestamp,
      error: 'Failed to instantiate Supabase client',
    };
  }

  const startTime = Date.now();
  try {
    const { error } = await client
      .from('crops_msp')
      .select('count', { count: 'exact', head: true });

    const latencyMs = Date.now() - startTime;

    if (error) {
      return {
        configured: true,
        connected: false,
        url: SUPABASE_URL,
        latencyMs,
        error: error.message,
        timestamp,
      };
    }

    return {
      configured: true,
      connected: true,
      url: SUPABASE_URL,
      latencyMs,
      timestamp,
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      url: SUPABASE_URL,
      latencyMs: Date.now() - startTime,
      error: err.message || 'Unknown network error reaching Supabase',
      timestamp,
    };
  }
}

export const supabase = getSupabaseClient();
