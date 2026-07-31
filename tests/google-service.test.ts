import { describe, it, expect } from "vitest";
import { generateHotelListXml } from "../src/feeds/hotelList";
import { generateLandingPagesXml } from "../src/feeds/landingPages";
import { computeOptionBPrices } from "../src/pricing/optionB";
import { parseGoogleQueryXml, generateTransactionXml } from "../src/api/liveQuery";

describe("google-checkinsai Microservice Tests", () => {
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

  it("calculates Option B public rate vs member discount rate accurately", () => {
    const res = computeOptionBPrices(200, 10, 10);
    expect(res.netRate).toBe(200);
    expect(res.publicGrossRate).toBe(220); // Net $200 + 10% margin = $220
    expect(res.memberDiscountRate).toBe(198); // Public $220 - 10% discount = $198
  });

  it("parses Google query XML and generates Transaction response XML", () => {
    const sampleQueryXml = `<Query><Property>h101</Property><Checkin>2026-09-01</Checkin><Checkout>2026-09-03</Checkout></Query>`;
    const parsed = parseGoogleQueryXml(sampleQueryXml);
    expect(parsed).not.toBeNull();
    expect(parsed?.hotelId).toBe("h101");
    expect(parsed?.checkIn).toBe("2026-09-01");

    const transactionXml = generateTransactionXml({
      hotelId: "h101",
      checkIn: "2026-09-01",
      checkOut: "2026-09-03",
      currency: "USD",
      netRate: 200,
      publicGrossRate: 220,
      memberDiscountRate: 198,
      taxesAndFees: 0,
      roomName: "Deluxe King",
      mealType: "breakfast",
    });

    expect(transactionXml).toContain('<Transaction timestamp=');
    expect(transactionXml).toContain('<Property>h101</Property>');
    expect(transactionXml).toContain('<Baserate currency="USD">220.00</Baserate>');
  });
});
