export interface GoogleMarginRule {
  id: string;
  scope: "global" | "zone" | "country" | "city" | "hotel";
  target?: string | null;
  googleMarkupPercent: number; // Markup applied to Wholesale Net Rate for Google feeds & Live Queries
  memberMarkupPercent: number; // Markup applied to Wholesale Net Rate for signed-in members on site
  status: "active" | "paused";
}

export interface DetailedPriceBreakdown {
  wholesaleNetRate: number;
  googleMarkupPercent: number;
  googlePublicRate: number;     // Rate sent to Google Live Queries & Price Accuracy Bots
  memberMarkupPercent: number;
  siteMemberRate: number;      // Rate displayed to logged-in members on checkins.ai
  taxesAndFees: number;
}

/**
 * Computes Google Rates & Member Rates directly from Wholesale Net Rates based on Admin Portal Rules:
 *  - Google Public Rate = Wholesale Net + (Wholesale Net * Google Markup %)
 *  - Site Member Rate = Wholesale Net + (Wholesale Net * Member Markup %)
 */
export function computeAdminGooglePrices(
  wholesaleNetRate: number,
  rule: GoogleMarginRule = {
    id: "default-google-rule",
    scope: "global",
    googleMarkupPercent: 12, // Default 12% Google Rate Markup from Wholesale
    memberMarkupPercent: 5,   // Default 5% Member Rate Markup from Wholesale
    status: "active",
  },
  taxesAndFees = 0
): DetailedPriceBreakdown {
  const googleMarkupAmount = wholesaleNetRate * (rule.googleMarkupPercent / 100);
  const googlePublicRate = Math.round((wholesaleNetRate + googleMarkupAmount) * 100) / 100;

  const memberMarkupAmount = wholesaleNetRate * (rule.memberMarkupPercent / 100);
  const siteMemberRate = Math.round((wholesaleNetRate + memberMarkupAmount) * 100) / 100;

  return {
    wholesaleNetRate,
    googleMarkupPercent: rule.googleMarkupPercent,
    googlePublicRate,
    memberMarkupPercent: rule.memberMarkupPercent,
    siteMemberRate,
    taxesAndFees,
  };
}
