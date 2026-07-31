export interface PriceBreakdown {
  netRate: number;
  marginPercent: number;
  publicGrossRate: number;
  memberDiscountPercent: number;
  memberDiscountRate: number;
  taxesAndFees: number;
}

/**
 * Computes Option B Pricing:
 *  - Public Gross Rate = Net + Standard Margin (Sent to Google Live Queries & Price Accuracy Bots)
 *  - Member Discount Rate = Public Gross Rate * (1 - Member Discount %)
 */
export function computeOptionBPrices(
  netRate: number,
  marginPercent = 10,
  memberDiscountPercent = 10,
  taxesAndFees = 0
): PriceBreakdown {
  const marginAmount = netRate * (marginPercent / 100);
  const publicGrossRate = Math.round((netRate + marginAmount) * 100) / 100;
  
  const discountAmount = publicGrossRate * (memberDiscountPercent / 100);
  const memberDiscountRate = Math.round((publicGrossRate - discountAmount) * 100) / 100;

  return {
    netRate,
    marginPercent,
    publicGrossRate,
    memberDiscountPercent,
    memberDiscountRate,
    taxesAndFees,
  };
}
