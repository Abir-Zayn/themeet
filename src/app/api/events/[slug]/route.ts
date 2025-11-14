import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Event from '@/src/lib/database/event.model';
import Booking from '@/src/lib/database/booking.model';
import { Types } from 'mongoose';

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    // 1 .Connect to database
    await connectDB();

    // 2. Extract slug from params (await the Promise)
    const { slug } = await params;

    // 3. Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { message: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    // 4. Sanitize slug (remove any potential malicious input)
    const sanitizedSlug = slug.trim().toLowerCase();

    // 5. Query events by slug
    const eventDocument = await Event.findOne({ slug: sanitizedSlug });

    // Handle events not found
    if (!eventDocument) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 }
      );
    }

    const eventId = eventDocument._id.toString();

    let totalParticipants = 0;

    const aggregation = await Booking.aggregate<{
      _id: Types.ObjectId;
      count: number;
    }>([
      {
        $match: {
          eventId: new Types.ObjectId(eventId),
          attending: { $in: ['yes', 'online'] },
        },
      },
      {
        $group: {
          _id: '$eventId',
          count: { $sum: 1 },
        },
      },
    ]);

    totalParticipants = aggregation[0]?.count ?? 0;

    // Return successful response with events data
    return NextResponse.json(
      {
        message: 'Event fetched successfully',
        event: { ...eventDocument.toObject(), totalParticipants },
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching events by slug:', error);
    }

    // Handle specific error types
    if (error instanceof Error) {
      // Handle database connection errors
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { message: 'Database configuration error' },
          { status: 500 }
        );
      }

      // Return generic error with error message
      return NextResponse.json(
        { message: 'Failed to fetch events', error: error.message },
        { status: 500 }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}