import { z } from 'zod';

export const GeoFromIpSchema = z.object({
  ip: z.string(),
  country_code: z.string(),
  country_name: z.string(),
  region_name: z.string(),
  city_name: z.string(),
  latitude: z.union([z.number(), z.null()]),
  longitude: z.union([z.number(), z.null()]),
  zip_code: z.string(),
  time_zone: z.string(),
  asn: z.string(),
  as: z.string(),
  is_proxy: z.boolean(),
});

export type GeoFromIp = z.infer<typeof GeoFromIpSchema>;

export const GeoFromIpErrorSchema = z.object({
  error: z.object({ error_code: z.number(), error_message: z.string() }),
});

export type GeoFromIpError = z.infer<typeof GeoFromIpErrorSchema>;
