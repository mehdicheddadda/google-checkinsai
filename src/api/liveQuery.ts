import { LiveQueryRequest, LiveQueryResponse } from "../types";
import { computeOptionBPrices } from "../pricing/optionB";

/**
 * Parses Google Live Query XML (<Query>) request payload.
 */
export function parseGoogleQueryXml(xmlText: string): LiveQueryRequest | null {
  try {
    const hotelIdMatch = xmlText.match(/<Property>([^<]+)<\/Property>/) || xmlText.match(/<Hotel>([^<]+)<\/Hotel>/);
    const checkInMatch = xmlText.match(/<Checkin>([^<]+)<\/Checkin>/);
    const checkOutMatch = xmlText.match(/<Checkout>([^<]+)<\/Checkout>/);
    const adultsMatch = xmlText.match(/<NumAdults>([^<]+)<\/NumAdults>/);

    if (!hotelIdMatch || !checkInMatch || !checkOutMatch) {
      return null;
    }

    return {
      hotelId: hotelIdMatch[1].trim(),
      checkIn: checkInMatch[1].trim(),
      checkOut: checkOutMatch[1].trim(),
      occupancy: {
        adults: adultsMatch ? parseInt(adultsMatch[1], 10) : 2,
      },
    };
  } catch (e) {
    return null;
  }
}

/**
 * Generates Google Transaction XML (<Transaction>) response payload.
 */
export function generateTransactionXml(res: LiveQueryResponse): string {
  const timestamp = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<Transaction timestamp="${timestamp}">
  <Result>
    <Property>${res.hotelId}</Property>
    <Checkin>${res.checkIn}</Checkin>
    <Nights>${calculateNights(res.checkIn, res.checkOut)}</Nights>
    <Baserate currency="${res.currency}">${res.publicGrossRate.toFixed(2)}</Baserate>
    <Tax currency="${res.currency}">${res.taxesAndFees.toFixed(2)}</Tax>
    <OtherFees currency="${res.currency}">0.00</OtherFees>
    <RoomBundle>
      <RoomID>standard</RoomID>
      <Name>${escapeXml(res.roomName)}</Name>
      <Meal>
        <MealType>${res.mealType}</MealType>
      </Meal>
    </RoomBundle>
  </Result>
</Transaction>`;
}

function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  const nights = Math.round((end - start) / (1000 * 3600 * 24));
  return nights > 0 ? nights : 1;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
