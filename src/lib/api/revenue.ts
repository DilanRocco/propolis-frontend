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
    total_host_payout_usd: number;
    total_paid_usd: number;
    total_balance_due_usd: number;
    reservation_count: number;
    revenue_by_currency: {
      USD: number;
    };
    date_range: {
      start_date: string;
      end_date: string;
    };
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

export interface JurnyShortTermKPIsResponse {
  revenue: string;
  occupancy: number;
  adr: string;
  revpar: string;
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
 * @param propertyId - Property ID for filtering
 */
export async function getGuestyRevenue(
  startDate?: string,
  endDate?: string,
  propertyId?: string
): Promise<GuestyRevenueResponse> {
  const url = new URL(`${PUBLIC_API_URL}/api/guesty/revenue`);
  
  if (startDate) {
    url.searchParams.append('start_date', startDate);
  }
  
  if (endDate) {
    url.searchParams.append('end_date', endDate);
  }
  
  if (propertyId) {
    url.searchParams.append('property_id', propertyId);
  }

  console.log('🔍 Calling Guesty API with URL:', url.toString());
  console.log('🔍 Property ID being sent:', propertyId || 'NONE (unfiltered)');

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
 * @param propertyId - Property ID for filtering
 */
export async function getShortTermOccupancyRate(
  startDate?: string,
  endDate?: string,
  propertyId?: string
): Promise<ShortTermOccupancyResponse> {
  const url = new URL(`${PUBLIC_API_URL}/occupancy-rate`);
  
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
    throw new Error(`Failed to fetch short-term occupancy rate: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Extract total income from Doorloop profit and loss data
 */
export function extractLongTermRevenue(profitLossData: DoorloopProfitLossResponse | null | undefined): number {
  if (!profitLossData || !profitLossData.data || !profitLossData.data.data) {
    return 0;
  }
  
  const incomeEntry = profitLossData.data.data.find(
    item => item.typeId === 'INCOME' && item.type === 'category'
  );
  
  return incomeEntry?.totalWithSubAccounts || 0;
}


/**
 * Fetch Jurny short-term KPIs data
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @param propertyId - Optional property ID for filtering
 */
export async function getJurnyShortTermKPIs(
  startDate: string,
  endDate: string,
  propertyName?: string
): Promise<JurnyShortTermKPIsResponse> {
  const url = new URL(`${PUBLIC_API_URL}/api/jurny/short-term-kpis`);
  
  // Add required date parameters (backend expects date_start and date_to)
  url.searchParams.append('date_start', startDate);
  url.searchParams.append('date_to', endDate);
  
  // Add property name if provided
  if (propertyName) {
    url.searchParams.append('property_name', propertyName);
  }

  console.log('🔍 Calling Jurny Short-Term KPIs API with URL:', url.toString());
  console.log('🔍 Parameters:', { startDate, endDate, propertyName });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorText = '';
      let errorJson = null;
      
      try {
        errorText = await response.text();
        // Try to parse as JSON if possible
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          // Not JSON, use as text
        }
      } catch (e) {
        errorText = 'Could not read error response';
      }
      
      console.error('🔍 Jurny API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: url.toString(),
        parameters: { startDate, endDate, propertyName },
        body: errorText,
        parsedError: errorJson
      });
      
      const errorMessage = errorJson?.detail || errorJson?.message || errorText || response.statusText;
      throw new Error(`Failed to fetch Jurny short-term KPIs: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    const responseText = await response.text();
    console.log('🔍 Jurny API Raw Response Text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('🔍 Jurny Short-Term KPIs API Response (parsed):', data);
    } catch (parseError) {
      console.error('🔍 Jurny API JSON Parse Error:', parseError);
      console.error('🔍 Response text that failed to parse:', responseText);
      throw new Error(`Failed to parse Jurny API response as JSON: ${parseError}`);
    }
    
    return data;
  } catch (error) {
    console.error('🔍 Jurny API Call Error:', error);
    // Re-throw with more context if it's not already our custom error
    if (error instanceof Error && !error.message.includes('Failed to fetch Jurny')) {
      throw new Error(`Jurny API call failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Extract total revenue from Guesty revenue data
 */
export function extractShortTermRevenue(guestyData: GuestyRevenueResponse): number {
  console.log('Extracting short-term revenue from:', guestyData);
  console.log('Summary object:', guestyData?.summary);
  console.log('Total revenue USD:', guestyData?.summary?.total_revenue_usd);
  const revenue = guestyData.summary?.total_revenue_usd || 0;
  console.log('Final extracted revenue:', revenue);
  return revenue;
} 