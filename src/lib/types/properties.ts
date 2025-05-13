// Property types for the vacation rental management system

// Address type
export type Address = {
    full?: string;
    lat?: number;
    lng?: number;
    street?: string;
    apartment?: string;
    floor?: string;
    city: string;
    state: string;
    country?: string;
    zipcode?: string;
    neighborhood?: string;
    buildingName?: string;
    county?: string;
  };
  
  // Price structure
  export type Prices = {
    basePrice: number;
    currency: string;
    monthlyPriceFactor?: number;
    weeklyPriceFactor?: number;
    extraPersonFee?: number;
    guestsIncludedInRegularFee?: number;
    securityDepositFee?: number;
    cleaningFee?: number;
    petFee?: number;
  };
  
  // Terms for stay duration
  export type Terms = {
    minNights: number;
    maxNights: number;
  };
  
  // Image references
  export type Picture = {
    thumbnail: string;
    original?: string;
    _id?: string;
  };
  
  // Cleaning status
  export type CleaningStatus = {
    value: 'clean' | 'dirty';
    updatedAt?: string;
  };
  
  // Channel integrations (like Airbnb, Booking.com, etc.)
  export type Integration = {
    _id?: string;
    platform: string;
    externalUrl?: string;
    status?: string;
  };
  
  // Public description sections
  export type PublicDescription = {
    summary?: string;
    space?: string;
    access?: string;
    interaction?: string;
    neighborhood?: string;
    transit?: string;
    notes?: string;
    houseRules?: string;
  };
  
  // Room configuration
  export type ListingRoom = {
    _id: string;
    roomNumber: number;
    beds: {
      _id: string;
      type: string;
      quantity: number;
    }[];
  };
  
  // Custom field
  export type CustomField = {
    _id: string;
    fieldId: string;
    value: string;
  };
  
  // Main Property type
  export type Property = {
    _id: string;
    nickname: string;
    title: string;
    propertyType: string;
    roomType?: string;
    address: Address;
    bedrooms: number;
    bathrooms: number;
    beds?: number;
    accommodates: number;
    prices: Prices;
    terms?: Terms;
    active: boolean;
    cleaningStatus: CleaningStatus;
    picture: {
      thumbnail: string;
    };
    pictures?: Picture[];
    amenities?: string[];
    amenitiesNotIncluded?: string[];
    publicDescription?: PublicDescription;
    defaultCheckInTime?: string;
    defaultCheckOutTime?: string;
    integrations?: Integration[];
    listingRooms?: ListingRoom[];
    customFields?: CustomField[];
    isListed?: boolean;
    createdAt?: string;
    lastUpdatedAt?: string;
    timezone?: string;
    areaSquareFeet?: number | null;
    minimumAge?: number;
    tags?: string[];
    offeredServices?: string[];
  };
  
  // Filter options for the property list
  export type PropertyFilters = {
    search?: string;
    propertyType?: string;
    location?: string;
    status?: 'active' | 'inactive' | '';
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    amenities?: string[];
  };

export type FilterOptions = {
    search?: string;
    propertyType?: string;
    location?: string;
    status?: string;
  }