export interface Listing {
	_id: string;
	id: string;
	title: string;
	description: string;
	address: {
		formattedAddress: string;
		location: {
			lat: number;
			lng: number;
		};
	};
	pictures: string[];
	amenities: string[];
	type: string;
	source: 'guesty' | 'doorloop';
	// Optional fields that might come from either source
	active?: boolean;
	base_price?: number;
	currency?: string;
	accommodates?: number;
	bedrooms?: number;
	property_type?: string;
	nickname?: string;
	address_full?: string;
	address_building_name?: string;
	address_city?: string;
	address_state?: string;
	address_zip?: string;
	address_street1?: string;
	address_street2?: string;
	address_neighborhood?: string;
	room_type?: string;
	description_summary?: string;
	security_deposit_fee?: number;
	extra_person_fee?: number;
	guests_included?: number;
	weekly_price_factor?: number;
	monthly_price_factor?: number;
	minimum_age?: number;
	min_nights?: number;
	max_nights?: number;
	area_square_feet?: number;
	bathrooms?: number;
	thumbnail_url?: string;
	cleaning_status?: string;
	tags?: string[];
	// Doorloop specific fields
	numActiveUnits?: number;
	class?: string;
	settings?: any;
	name?: string;
} 