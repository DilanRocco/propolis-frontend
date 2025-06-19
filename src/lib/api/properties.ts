import { PUBLIC_API_URL } from '$env/static/public';

export interface ListingPicture {
  full_url: string;
  thumbnail_url?: string;
  caption?: string;
  display_order: number;
}

export interface DetailedListing {
  id: string;
  account_id?: string;
  created_at?: string;
  last_updated_at?: string;
  imported_at?: string;
  last_activity_at?: string;

  title?: string;
  nickname?: string;
  property_type?: string;
  room_type?: string;

  accommodates?: number;
  bedrooms?: number;
  bathrooms?: number;
  area_square_feet?: number;
  minimum_age?: number;

  complex_id?: string;
  cleaning_status?: string;
  active?: string;

  address_building_name?: string;
  address_city?: string;
  address_state?: string;
  address_neighborhood?: string;
  address_latitude?: string;
  address_longitude?: string;
  address_full?: string;

  thumbnail_url?: string;

  base_price?: number;
  currency?: string;
  weekly_price_factor?: number;
  monthly_price_factor?: number;
  extra_person_fee?: number;
  security_deposit_fee?: number;

  guests_included?: number;
  min_nights?: number;
  max_nights?: number;

  description_summary?: string;

  payment_provider_id?: string;
  account_taxes?: any;
  tags: string[];
  amenities: string[];

  // Enhanced picture information
  pictures: string[]; // Array of full_url strings for backward compatibility
  detailed_pictures: ListingPicture[]; // Detailed picture objects with metadata
}

/**
 * Fetch a specific property by ID with detailed picture information from jd_listing_pictures table
 */
export async function fetchPropertyById(listingId: string, fetchFn: typeof fetch = fetch): Promise<DetailedListing> {
  try {
    const response = await fetchFn(`${PUBLIC_API_URL}/api/properties/listings/${encodeURIComponent(listingId)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Property with ID '${listingId}' not found`);
      }
      throw new Error(`Failed to fetch property: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    throw error;
  }
}

/**
 * Fetch all properties with basic picture information
 */
export async function fetchAllProperties(fetchFn: typeof fetch = fetch): Promise<any[]> {
  try {
    const response = await fetchFn(`${PUBLIC_API_URL}/api/properties/listings`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all properties:', error);
    throw error;
  }
}
