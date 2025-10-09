export interface DoorloopAddress {
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  street2?: string;
  lat?: number;
  lng?: number;
  isValidAddress?: boolean;
}

export interface DoorloopPicture {
  fileId: string;
  rank: number;
  url: string;
}

export interface DoorloopOwner {
  owner: string;
  ownershipPercentage: number;
}

export interface DoorloopProperty {
  active: boolean;
  address: DoorloopAddress;
  numActiveUnits: number;
  class: string;
  settings: {
    paymentAllocations?: {
      accounts: any[];
    };
    defaultAccounts?: {
      bank_operating: string;
      bank_trust: string;
    };
    managementFees?: {
      collectManagementFees: boolean;
    };
  };
  name: string;
  description?: string;
  amenities?: string[];
  pictures?: DoorloopPicture[];
  owners: DoorloopOwner[];
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  boardMembers: any[];
}

export interface DoorloopUnit {
  active: boolean;
  addressSameAsProperty: boolean;
  rentalApplicationListing: {
    activeListing: boolean;
  };
  address: DoorloopAddress;
  baths: number;
  beds: number;
  marketRent?: number;
  name: string;
  property: string; // ID of the parent property
  size?: number;
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  pictures?: DoorloopPicture[];
  inEviction: boolean;
  amenities: string[];
  description?: string;
}

export interface DoorloopResponse {
  data: DoorloopProperty[];
  total: number;
}

export interface DoorloopUnitsResponse {
  success: boolean;
  data: DoorloopUnit[];
}

export interface DoorloopLeaseTenancyResponse {
  lease_count: number;
  total_lease_duration: number;
  average_lease_duration: number;
  property_id?: string;
} 