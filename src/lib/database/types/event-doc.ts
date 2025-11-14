import { Document } from "mongoose";

// TypeScript interface for Event document
export interface IEvent extends Document {
  eventId: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  totalParticipants?: number;
  createdAt: Date;
  updatedAt: Date;
}