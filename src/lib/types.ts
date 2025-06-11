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
	address_neighborhood?: string;
	room_type?: string;
	description_summary?: string;
	// Doorloop specific fields
	numActiveUnits?: number;
	class?: string;
	settings?: any;
	name?: string;
} 