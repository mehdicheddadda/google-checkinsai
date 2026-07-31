import { describe, it, expect } from "vitest";
import { generateHotelListXml } from "../src/feeds/hotelList";
import { generateLandingPagesXml } from "../src/feeds/landingPages";
import { computeAdminGooglePrices } from "../src/pricing/optionB";
import { parseGoogleQueryXml, generateTransactionXml } from "../src/api/liveQuery";

describe("google-checkinsai Admin Google Rate Tests", () => {
  it("generates valid Hotel List XML with required <listings> root tag", () => {
    const xml = generateHotelListXml([
      {
        id: "h101",
        name: "Test Hotel",
        addressLine1: "1 Market St",
        city: "San Francisco",
        countryCode: "US",
        latitude: 37.79,
        longitude: -122.4,
      },
    ]);
    expect(xml).toContain("<listings");
    expect(xml).toContain("<id>h101</id>");
    expect(xml).toContain("<name>Test Hotel</name>");
  });

  it("generates valid Landing Pages POS XML with <PointsOfSale> root tag", () => {
    const xml = generateLandingPagesXml("Checkins.ai", "https://checkins.ai");
    expect(xml).toContain("<PointsOfSale>");
    expect(xml).toContain('display_text="Checkins.ai"');
    expect(xml).toContain("https://checkins.ai/hotels/(PARTNER-HOTEL-ID)");
  });

  it("calculates Admin Google Rate Markup and Member Rate directly from Wholesale Net", () => {
    const res = computeAdminGooglePrices(200, {
      id: "admin-rule-1",
      scope: "global",
      googleMarkupPercent: 12, // 12% markup for Google Rate
      memberMarkupPercent: 5,  // 5% markup for Member Rate
      status: "active",
    });

    expect(res.wholesaleNetRate).toBe(200);
    expect(res.googlePublicRate).toBe(224); // Wholesale $200 + 12% = $224 (Sent to Google)
    expect(res.siteMemberRate).toBe(210);  // Wholesale $200 + 5% = $210 (Shown on checkins.ai when logged in)
  });

  it("parses Google query XML and generates Transaction response XML", () => {
    const sampleQueryXml = `<Query><Property>h101</Property><Checkin>2026-09-01</Checkin><Checkout>2026-09-03</Checkout></Query>`;
    const parsed = parseGoogleQueryXml(sampleQueryXml);
    expect(parsed).not.toBeNull();
    expect(parsed?.hotelId).toBe("h101");

    const pricing = computeAdminGooglePrices(200, {
      id: "rule-1",
      scope: "global",
      googleMarkupPercent: 12,
      memberMarkupPercent: 5,
      status: "active",
    });

    const transactionXml = generateTransactionXml({
      hotelId: "h101",
      checkIn: "2026-09-01",
      checkOut: "2026-09-03",
      currency: "USD",
      netRate: pricing.wholesaleNetRate,
      publicGrossRate: pricing.googlePublicRate,
      memberDiscountRate: pricing.siteMemberRate,
      taxesAndFees: 0,
      roomName: "Deluxe King",
      mealType: "breakfast",
    });

    expect(transactionXml).toContain('<Transaction timestamp=');
    expect(transactionXml).toContain('<Baserate currency="USD">224.00</Baserate>');
  });
});
