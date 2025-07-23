import { PUBLIC_API_URL } from '$env/static/public';

export interface DoorloopProfitLossResponse {
  success: boolean;
  data: {
    columns: Array<{ title: string; field: string; cellFormatType?: string }>;
    data: Array<{
      id: string;
      type: string;
      typeId: string;
      name?: string;
      total?: number;
      totalWithSubAccounts?: number;
      absTotalWithSubAccounts?: number;
    }>;
  };
  parameters_used: {
    filter_accountingMethod: string;
  };
}

export interface GuestyRevenueResponse {
  results: Array<{
    _id: string;
    confirmationCode: string;
    status: string;
    guestsCount: number;
    nightsCount: number;
    checkInDateLocalized: string;
    checkOutDateLocalized: string;
    money: {
      hostPayout: number;
      hostPayoutUsd: number;
      totalPaid: number;
      balanceDue: number;
      totalTaxes: number;
      hostServiceFee: number;
      hostServiceFeeTax: number;
      hostServiceFeeIncTax: number;
      payments: Array<{
        status: string;
        amount: number;
        currency: string;
        paidAt?: string;
      }>;
    };
    listing: {
      _id: string;
      title: string;
      nickname: string;
    };
    guest: {
      fullName: string;
    };
    createdAt: string;
    confirmedAt: string;
  }>;
  summary: {
    total_revenue_usd: number;
    total_paid_usd: number;
    total_balance_due_usd: number;
    reservation_count: number;
    date_range: string | null;
  };
  title: string;
  count: number;
  limit: number;
  skip: number;
}

export interface ShortTermOccupancyResponse {
  occupancy_rate: number;
  occupied_units: number;
  total_units: number;
  date_from: string;
  date_to: string;
  message: string;
}

/**
 * Fetch Doorloop profit and loss data (long-term revenue)
 * @param accountingMethod - Accounting method (cash/accrual)
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @param propertyId - Property ID
 */
export async function getDoorloopProfitLoss(
  accountingMethod: string = 'cash',
  startDate?: string,
  endDate?: string,
  propertyId?: string,
): Promise<DoorloopProfitLossResponse> {
  const url = new URL(`${PUBLIC_API_URL}/api/doorloop/profit-and-loss`);
  
  url.searchParams.append('accounting_method', accountingMethod);
  
  if (startDate) {
    url.searchParams.append('start_date', startDate);
  }
  
  if (endDate) {
    url.searchParams.append('end_date', endDate);
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
    throw new Error(`Failed to fetch Doorloop profit and loss: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch Guesty revenue data (short-term revenue)
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 */
export async function getGuestyRevenue(
  startDate?: string,
  endDate?: string
): Promise<GuestyRevenueResponse> {
  const url = new URL(`${PUBLIC_API_URL}/api/guesty/revenue`);
  
  if (startDate) {
    url.searchParams.append('start_date', startDate);
  }
  
  if (endDate) {
    url.searchParams.append('end_date', endDate);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Guesty revenue: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch short-term occupancy rate from Guesty
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 */
export async function getShortTermOccupancyRate(
  startDate?: string,
  endDate?: string
): Promise<ShortTermOccupancyResponse> {
  const url = new URL(`${PUBLIC_API_URL}/occupancy-rate`);
  
  if (startDate) {
    url.searchParams.append('date_from', startDate);
  }
  
  if (endDate) {
    url.searchParams.append('date_to', endDate);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch short-term occupancy rate: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Extract total income from Doorloop profit and loss data
 */
export function extractLongTermRevenue(profitLossData: DoorloopProfitLossResponse): number {
  const incomeEntry = profitLossData.data.data.find(
    item => item.typeId === 'INCOME' && item.type === 'category'
  );
  
  return incomeEntry?.totalWithSubAccounts || 0;
}


/**
 * Extract total revenue from Guesty revenue data
 */
export function extractShortTermRevenue(guestyData: GuestyRevenueResponse): number {
  return guestyData.summary?.total_revenue_usd || 0;
} 