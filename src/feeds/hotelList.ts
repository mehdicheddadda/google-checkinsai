import { HotelProperty } from "../types";

/**
 * Generates the Google Hotel List XML feed (<listings>) matching local_feed.xsd standard.
 */
export function generateHotelListXml(properties: HotelProperty[], language = "en"): string {
  const listingsXml = properties
    .map(
      (p) => `  <listing>
    <id>${escapeXml(p.id)}</id>
    <name>${escapeXml(p.name)}</name>
    <address format="simple">
      <component name="addr1">${escapeXml(p.addressLine1)}</component>
      <component name="city">${escapeXml(p.city)}</component>
      ${p.province ? `<component name="province">${escapeXml(p.province)}</component>` : ""}
      ${p.postalCode ? `<component name="postal_code">${escapeXml(p.postalCode)}</component>` : ""}
      <component name="country">${escapeXml(p.countryCode)}</component>
    </address>
    <country>${escapeXml(p.countryCode)}</country>
    <latitude>${p.latitude}</latitude>
    <longitude>${p.longitude}</longitude>
    ${p.phone ? `<phone type="main">${escapeXml(p.phone)}</phone>` : ""}
  </listing>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<listings xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:noNamespaceSchemaLocation="http://www.gstatic.com/localfeed/local_feed.xsd">
  <language>${language}</language>
${listingsXml}
</listings>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
