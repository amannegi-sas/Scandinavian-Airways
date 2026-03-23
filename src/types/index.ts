export type CabinClass = 'economy' | 'plus' | 'business';
export type TripType = 'roundtrip' | 'oneway' | 'multicity';
export type FlightStatus = 'scheduled' | 'boarding' | 'departed' | 'landed' | 'delayed' | 'cancelled';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightSegment {
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  stops: number;
}

export interface Fare {
  id: string;
  cabinClass: CabinClass;
  price: number;
  currency: string;
  label: string;
  baggage: string;
  changeable: boolean;
  refundable: boolean;
  pointsEarned: number;
}

export interface Flight {
  id: string;
  outbound: FlightSegment;
  inbound?: FlightSegment;
  fares: Fare[];
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: CabinClass;
  tripType: TripType;
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passport?: string;
  euroBonusNumber?: string;
}

export interface Booking {
  id: string;
  pnr: string;
  flight: Flight;
  selectedFare: Fare;
  passengers: Passenger[];
  totalPrice: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface EuroBonusMember {
  memberId: string;
  firstName: string;
  lastName: string;
  tier: 'member' | 'silver' | 'gold' | 'diamond';
  points: number;
  tierPoints: number;
  expiryDate: string;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  airportCode: string;
  imageUrl: string;
  description: string;
  priceFrom: number;
  currency: string;
  tags: string[];
  popular: boolean;
}

export interface FlightStatusInfo {
  flightNumber: string;
  date: string;
  status: FlightStatus;
  origin: Airport;
  destination: Airport;
  scheduledDeparture: string;
  estimatedDeparture: string;
  scheduledArrival: string;
  estimatedArrival: string;
  gate?: string;
  terminal?: string;
  delay?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
}
