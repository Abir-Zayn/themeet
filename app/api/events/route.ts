import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const event = await req.json();

    if (typeof event !== "object" || event === null) {
      return NextResponse.json(
        { message: "Invalid JSON data" },
        { status: 400 }
      );
    }

    // Exclude fields that should not be set during creation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, ...eventData } = event;

    const createdEvent = await Event.create(eventData);
    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/events:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
