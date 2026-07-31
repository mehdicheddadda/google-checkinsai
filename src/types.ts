export interface HotelProperty {
  id: string;
  name: string;
  addressLine1: string;
  city: string;
  province?: string;
  postalCode?: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  phone?: string;
}

export interface LiveQueryRequest {
  hotelId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  occupancy: {
    adults: number;
    children?: number;
  };
  userCountry?: string;
  currency?: string;
}

export interface LiveQueryResponse {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  netRate: number;
  publicGrossRate: number;
  memberDiscountRate: number;
  taxesAndFees: number;
  roomName: string;
  mealType: string;
}
