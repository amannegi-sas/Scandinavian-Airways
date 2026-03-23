import type {
  Flight,
  FlightStatusInfo,
  Destination,
  EuroBonusMember,
  Booking,
  SearchParams,
} from '../types';
import { mockFlights, mockDestinations, mockFlightStatus, mockBookings, mockMember } from './mockData';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const flightApi = {
  searchFlights: async (params: SearchParams): Promise<Flight[]> => {
    await delay(900);
    return mockFlights.filter(
      (f) =>
        f.outbound.origin.code === params.origin &&
        f.outbound.destination.code === params.destination
    );
  },

  getFlightStatus: async (flightNumber: string, date: string): Promise<FlightStatusInfo> => {
    await delay(600);
    const found = mockFlightStatus.find(
      (s) => s.flightNumber === flightNumber && s.date === date
    );
    if (!found) throw new Error(`Flight ${flightNumber} not found on ${date}`);
    return found;
  },
};

export const destinationApi = {
  getDestinations: async (): Promise<Destination[]> => {
    await delay(500);
    return mockDestinations;
  },

  getPopularDestinations: async (): Promise<Destination[]> => {
    await delay(400);
    return mockDestinations.filter((d) => d.popular);
  },
};

export const bookingApi = {
  getBookings: async (): Promise<Booking[]> => {
    await delay(700);
    return mockBookings;
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    await delay(800);
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    booking.status = 'cancelled';
  },
};

export const euroBonusApi = {
  getMember: async (memberId: string): Promise<EuroBonusMember> => {
    await delay(500);
    if (memberId !== mockMember.memberId) throw new Error('Member not found');
    return mockMember;
  },
};
