// chartUtils.ts - Utility functions for chart operations

export const chartUtils = {
  // Floor a date to bucket start (week, month, year)
  floorToBucket(dt: Date, bucketType: 'week' | 'month' | 'year'): Date {
    const d = new Date(dt);
    if (bucketType === 'week') {
      // Move to Monday of this week
      const day = (d.getDay() + 6) % 7;
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
    } else if (bucketType === 'month') {
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
    } else {
      d.setMonth(0, 1);
      d.setHours(0, 0, 0, 0);
    }
    return d;
  },

  // Advance date by one bucket
  advanceBucket(dt: Date, bucketType: 'week' | 'month' | 'year'): Date {
    const d = new Date(dt);
    if (bucketType === 'week') {
      d.setDate(d.getDate() + 7);
    } else if (bucketType === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else {
      d.setFullYear(d.getFullYear() + 1);
    }
    return d;
  },

  // Format bucket date for display
  formatBucket(dt: Date, bucketType: 'week' | 'month' | 'year'): string {
    if (bucketType === 'week') {
      // ISO week number by using Thursday trick
      const th = new Date(dt);
      th.setDate(dt.getDate() + 3);
      const week1 = new Date(th.getFullYear(), 0, 4);
      const weekNo = Math.ceil(((th.getTime() - week1.getTime()) / 86400000 + 1) / 7);
      return `${th.getFullYear()}-W${weekNo}`;
    } else if (bucketType === 'month') {
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    } else {
      return dt.getFullYear().toString();
    }
  },

  // Format currency values
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  },

  // Custom tooltip formatter for the chart
  tooltipFormatter(params: any): string {
    let result = `<div style="font-weight:bold;margin-bottom:5px;">${params[0].axisValue}</div>`;

    // Sort bars by value in descending order for better readability
    params.sort((a: any, b: any) => b.value - a.value);

    params.forEach((item: any) => {
      result += `<div style="display:flex;justify-content:space-between;margin:3px 0;">
        <span style="display:inline-block;margin-right:10px;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${item.color};margin-right:5px;"></span>
          ${item.seriesName}:
        </span>
        <span style="font-weight:bold;">${this.formatCurrency(item.value)}</span>
      </div>`;
    });

    // Add a total if there's more than one property
    if (params.length > 1) {
      const total = params.reduce((sum: number, item: any) => sum + item.value, 0);
      result += `<div style="margin-top:5px;padding-top:5px;border-top:1px solid #eee;">
        <div style="display:flex;justify-content:space-between;">
          <span style="font-weight:bold;">Total:</span>
          <span style="font-weight:bold;">${this.formatCurrency(total)}</span>
        </div>
      </div>`;
    }

    return result;
  }
};