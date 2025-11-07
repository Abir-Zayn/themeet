'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/src/lib/mongodb';
import Booking from '@/src/lib/database/booking.model';
import { BookingFormData, bookingFormSchema } from '../schema/booking-form-schema';

export type FormState = {
  message: string;
  status: 'SUCCESS' | 'ERROR';
  errors?: Record<string, string[]>;
};

export async function createBooking(
  _prevState: FormState,
  formData: FormData,
  eventId: string // Pass event ID from parent component
): Promise<FormState> {
  try {
    // Parse and validate form data using your Zod schema
    const validatedData = bookingFormSchema.parse({
      email: formData.get('email') as string,
      personName: formData.get('personName') as string,
      organizations: formData.get('organizations') as string,
      phone: formData.get('phone') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      donate: parseInt(formData.get('donate') as string) || 0,
      attending: formData.get('attending') as 'yes' | 'no' | 'high-chance' | 'online',
    }) as BookingFormData;

    // Connect to database
    await connectToDatabase();

    // Check for existing booking
    const existingBooking = await Booking.findOne({
      eventId,
      email: validatedData.email,
    });

    if (existingBooking) {
      return {
        message: 'You already have a booking for this event.',
        status: 'ERROR',
      };
    }

    // Create booking
    const newBooking = new Booking({
      ...validatedData,
      eventId,
    });

    await newBooking.save();

    revalidatePath('/'); // Revalidate relevant paths, adjust as needed

    return {
      message: 'Booking created successfully!',
      status: 'SUCCESS',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        message: 'Invalid form data.',
        status: 'ERROR',
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const mongoError = error as { code?: number };
      if (mongoError.code === 11000) {
        return {
          message: 'A booking with this email already exists for the event.',
          status: 'ERROR',
        };
      }
    }

    console.error('Booking creation error:', error);
    return {
      message: 'Failed to create booking. Please try again.',
      status: 'ERROR',
    };
  }
}