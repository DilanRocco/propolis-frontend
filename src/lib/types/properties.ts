import { z } from "zod";

export const ListingNormalizedSchema = z.object({
  _id: z.string(),
  id: z.string(),
  title: z.string(),
  description: z.string(),
  address: z.object({
    formattedAddress: z.string(),
    location: z.object({
      lat: z.number(),
      lng: z.number()
    })
  }),
  pictures: z.array(z.string()),
  amenities: z.array(z.string()),
  type: z.string(),
  source: z.enum(['guesty', 'doorloop']),
  active: z.boolean().optional(),
  base_price: z.number().optional(),
  currency: z.string().optional(),
  accommodates: z.number().optional(),
  bedrooms: z.number().optional(),
  property_type: z.string().optional(),
  nickname: z.string().optional(),
  address_full: z.string().optional(),
  address_building_name: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  address_neighborhood: z.string().optional(),
  room_type: z.string().optional(),
  description_summary: z.string().optional(),
  security_deposit_fee: z.number().optional(),
  extra_person_fee: z.number().optional(),
  guests_included: z.number().optional(),
  weekly_price_factor: z.number().optional(),
  monthly_price_factor: z.number().optional(),
  minimum_age: z.number().optional(),
  min_nights: z.number().optional(),
  max_nights: z.number().optional(),
  area_square_feet: z.number().optional(),
  bathrooms: z.number().optional(),
  thumbnail_url: z.string().optional(),
  cleaning_status: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export type FilterOptions = {
  search?: string;
  propertyType?: string;
  location?: string;
  status?: string;
}

export type Listing = z.infer<typeof ListingNormalizedSchema>;

// export type PropertyType = {
//    coliving
// }