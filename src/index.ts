import { Hono } from "hono";
import { generateHotelListXml } from "./feeds/hotelList";
import { generateLandingPagesXml } from "./feeds/landingPages";
import { parseGoogleQueryXml, generateTransactionXml } from "./api/liveQuery";
import { computeAdminGooglePrices, GoogleMarginRule } from "./pricing/optionB";

const app = new Hono();

// Health Check
app.get("/health", (c) => c.json({ status: "ok", service: "google-checkinsai", time: new Date().toISOString() }));

// 1. Google Hotel List Feed XML (<listings>)
app.get("/feeds/google-hotel-list.xml", (c) => {
  const sampleProperties = [
    {
      id: "sample_hotel_001",
      name: "Sample Hotel CheckinsAI",
      addressLine1: "123 Main Street",
      city: "San Francisco",
      province: "CA",
      postalCode: "94105",
      countryCode: "US",
      latitude: 37.7749,
      longitude: -122.4194,
      phone: "+14155550100",
    },
  ];

  const xml = generateHotelListXml(sampleProperties);
  return c.text(xml, 200, { "Content-Type": "application/xml; charset=utf-8" });
});

// 2. Google Landing Pages POS XML (<PointsOfSale>)
app.get("/feeds/google-landing-pages.xml", (c) => {
  const xml = generateLandingPagesXml("Checkins.ai", "https://checkins.ai");
  return c.text(xml, 200, { "Content-Type": "application/xml; charset=utf-8" });
});

// 3. Google Live Pricing Query Endpoint (<Transaction>)
app.post("/api/google/live-query", async (c) => {
  const bodyText = await c.req.text();
  const query = parseGoogleQueryXml(bodyText);

  if (!query) {
    return c.text("Invalid Google Query Payload", 400);
  }

  // Wholesale net rate from RateHawk supplier engine
  const wholesaleNetRate = 200;

  // Active Admin Portal Google Margin Rule (e.g. 12% Google Rate Markup)
  const adminGoogleRule: GoogleMarginRule = {
    id: "admin-rule-global",
    scope: "global",
    googleMarkupPercent: 12,
    memberMarkupPercent: 5,
    status: "active",
  };

  const pricing = computeAdminGooglePrices(wholesaleNetRate, adminGoogleRule);

  const xmlResponse = generateTransactionXml({
    hotelId: query.hotelId,
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    currency: query.currency || "USD",
    netRate: pricing.wholesaleNetRate,
    publicGrossRate: pricing.googlePublicRate,
    memberDiscountRate: pricing.siteMemberRate,
    taxesAndFees: pricing.taxesAndFees,
    roomName: "Standard Deluxe Room",
    mealType: "breakfast",
  });

  return c.text(xmlResponse, 200, { "Content-Type": "application/xml; charset=utf-8" });
});

export default app;
