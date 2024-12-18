// utils.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const validateEnv = (keys: string[]) => {
  keys.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
};

export const initializeStripe = (): Stripe => {
  validateEnv(['STRIPE_SECRET_KEY']);
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
  });
};

export const initializeSupabase = () => {
  validateEnv(['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};
