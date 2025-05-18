import { z } from "zod";

export const ListingNormalizedSchema = z.object({
  id: z.string(),
  account_id: z.string().nullable(),
  created_at: z.string().nullable(),
  last_updated_at: z.string().nullable(),
  imported_at: z.string().nullable(),
  last_activity_at: z.string().nullable(),

  title: z.string(),
  nickname: z.string(),
  active: z.boolean(),

  property_type: z.string(),
  room_type: z.string(),
  accommodates: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  area_square_feet: z.number(),
  minimum_age: z.number().nullable(),

  cleaning_status: z.enum(["clean", "needs-cleaning"]),

  address_full: z.string(),
  address_building_name: z.string(),
  address_city: z.string(),
  address_state: z.string(),
  address_neighborhood: z.string(),
  address_latitude: z.number().nullable(),
  address_longitude: z.number().nullable(),

  thumbnail_url: z.string(),

  base_price: z.number(),
  currency: z.string(),
  weekly_price_factor: z.number(),
  monthly_price_factor: z.number(),
  extra_person_fee: z.number(),
  guests_included: z.number(),
  security_deposit_fee: z.number(),

  min_nights: z.number(),
  max_nights: z.number(),

  description_summary: z.string(),

  complex_id: z.string().nullable(),
  payment_provider_id: z.string().nullable(),

  tags: z.array(z.string()),
});

export type FilterOptions = {
  search?: string;
  propertyType?: string;
  location?: string;
  status?: string;
}

// Type for convenience
export type Listing = z.infer<typeof ListingNormalizedSchema>;