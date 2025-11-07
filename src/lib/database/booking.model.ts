import { Schema, model, models, Document, Types } from "mongoose";
import Event from "./event.model"; // Uncomment if Event model exists

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
  attending: 'yes' | 'no' | 'high-chance' | 'online';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    personName: {
      type: String,
      required: [true, "Person name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      validate: {
        validator: function (phone: string) {
          return /^\+?[\d\s-]{10,}$/.test(phone);
        },
        message: "Please enter a valid phone number",
      },
    },
    organizations: {
      type: String,
      required: [true, "Organization is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "City must be at least 2 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      minlength: [2, "State must be at least 2 characters"],
    },
    donate: {
      type: Number,
      required: true,
      min: [0, "Donation cannot be negative"],
      default: 0,
    },
    attending: {
      type: String,
      enum: {
        values: ['yes', 'no', 'high-chance', 'online'],
        message: "Attending must be one of: yes, no, high-chance, online",
      },
      required: [true, "Attendance status is required"],
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook to validate event exists before creating booking (if Event model is available)
BookingSchema.pre("save", async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's new or modified
  if (booking.isModified("eventId") || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select("_id");

      if (!eventExists) {
        const error = new Error(
          `Event with ID ${booking.eventId} does not exist`
        );
        error.name = "ValidationError";
        return next(error);
      }
    } catch {
      const validationError = new Error(
        "Invalid event ID format or database error"
      );
      validationError.name = "ValidationError";
      return next(validationError);
    }
  }

  next();
});

// Create indexes for faster queries
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 }); // For event bookings by date
BookingSchema.index({ email: 1 }); // For user booking lookups
BookingSchema.index({ personName: 1 }); // For name searches

// Enforce one booking per event per email
BookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: "uniq_event_email" }
);

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
