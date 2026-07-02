import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  SUPABASE_URL: z.string().min(1).default('https://example.supabase.co'),
  SUPABASE_ANON_KEY: z.string().min(1).default('placeholder-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).default('placeholder-service-role-key'),
  JWT_SECRET: z.string().min(1).default('local-development-secret'),
  IVA_RATE: z.string().default('0.16'),
  MAX_DISCOUNT_PERCENT: z.string().default('20')
});

export const env = envSchema.parse(process.env);
export const ivaRate = Number(env.IVA_RATE);
export const maxDiscountPercent = Number(env.MAX_DISCOUNT_PERCENT);
