import { PUBLIC_API_URL } from '$env/static/public';
import type { DoorloopLeaseTenancyResponse } from '../types/doorloop';

export interface DoorloopOccupancyResponse {
  occupancy_rate: number;
  occupied_units: number;
  total_units: number;
  date_from: string;
  date_to: string;
  percentage: string;
}

/**
 * Fetch Doorloop occupancy rate for long-term rentals
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Promise<DoorloopOccupancyResponse>
 */
export async function getDoorloopOccupancyRate(
  startDate?: string,
  endDate?: string,
  propertyId?: string,
): Promise<DoorloopOccupancyResponse> {
  const url = new URL(`${PUBLIC_API_URL}/api/doorloop/occupancy-rate-doorloop`);
  
  if (startDate) {
    url.searchParams.append('date_from', startDate);
  }
  
  if (endDate) {
    url.searchParams.append('date_to', endDate);
  }

  if (propertyId) {
    url.searchParams.append('property_id', propertyId);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Doorloop occupancy rate: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch Doorloop average lease tenancy data
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @param propertyId - Optional property ID to filter by
 * @returns Promise<DoorloopLeaseTenancyResponse>
 */
export async function getDoorloopAverageLeaseTenancy(
  startDate?: string,
  endDate?: string,
  propertyId?: string,
): Promise<DoorloopLeaseTenancyResponse> {
  const url = new URL(`${PUBLIC_API_URL}/api/doorloop/avg_lease_tenancy`);
  
  if (startDate) {
    url.searchParams.append('date_from', startDate);
  }
  
  if (endDate) {
    url.searchParams.append('date_to', endDate);
  }

  if (propertyId) {
    url.searchParams.append('property_id', propertyId);
  }

  console.log('🔍 Lease Tenancy API Call:', {
    url: url.toString(),
    startDate,
    endDate,
    propertyId
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Doorloop average lease tenancy: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('🔍 Lease Tenancy API Response:', data);
  
  return data;
} 