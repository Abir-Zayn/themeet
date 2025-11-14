import { Document, Types } from "mongoose";
// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  personName: string;
  email: string;
  phone: string;
  organizations: string;
  city: string;
  state: string;
  donate: number;
  attending: 'yes' | 'no' | 'online';
  createdAt: Date;
  updatedAt: Date;
}