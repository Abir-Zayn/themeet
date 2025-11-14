import { model, models } from "mongoose";
import Event from "./event.model"; // Uncomment if Event model exists
import { IBooking } from "./types/booking-doc";
import { BookingSchema } from "./schema/booking-schema";





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
