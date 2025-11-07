import connectDB from "@/src/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/src/lib/database/event.model";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let eventData: any = {};
    let imageUrl: string = "";

    // Handle multipart/form-data (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File;

      if (!file) {
        return NextResponse.json(
          {
            message: "Image file is required",
          },
          { status: 400 }
        );
      }

      // Extract other form data
      for (const [key, value] of formData.entries()) {
        if (key !== "image") {
          eventData[key] = value;
        }
      }

      // Upload to Cloudinary
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "the-meet" },
            (error, result) => {
              if (error) {
                reject(error);
              }
              resolve(result);
            }
          )
          .end(buffer);
      });

      imageUrl = (uploadResult as { secure_url: string }).secure_url;
    }
    // Handle JSON (with image URL)
    else if (contentType.includes("application/json")) {
      const body = await req.json();
      const { image, ...restData } = body;

      if (!image) {
        return NextResponse.json(
          {
            message: "Image URL is required",
          },
          { status: 400 }
        );
      }

      eventData = restData;
      imageUrl = image;
    } else {
      return NextResponse.json(
        {
          message:
            'Content-Type must be either "multipart/form-data" or "application/json"',
        },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, ...filteredEventData } = eventData;
    filteredEventData.image = imageUrl;

    const createdEvent = await Event.create(filteredEventData);
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

// Get route for all events fetching
export async function GET() {
  try {
    await connectDB();
    //show the new events at top
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json(
      { message: "Event Fetching Failed" },
      { status: 500 }
    );
  }
}
