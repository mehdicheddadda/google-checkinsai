/**
 * Generates the Google Landing Pages POS XML feed (<PointsOfSale>)
 * linking Google Search/Maps users directly to CheckinsAI hotel pages.
 */
export function generateLandingPagesXml(
  brandName = "Checkins.ai",
  baseUrl = "https://checkins.ai"
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<PointsOfSale>
  <PointOfSale id="CheckinsAI_Primary">
    <DisplayNames display_text="${brandName}" display_language="en"/>
    <Match status="yes" language="en"/>
    <Match status="yes" currency="USD"/>
    <Match status="yes" country="US"/>
    <URL>${baseUrl}/hotels/(PARTNER-HOTEL-ID)?checkIn=(CHECKINYEAR)-(CHECKINMONTH)-(CHECKINDAY)&amp;checkOut=(CHECKOUTYEAR)-(CHECKOUTMONTH)-(CHECKOUTDAY)&amp;adults=(NUM-ADULTS)&amp;currency=(CURRENCY)&amp;utm_source=google_hba</URL>
  </PointOfSale>
</PointsOfSale>`;
}
