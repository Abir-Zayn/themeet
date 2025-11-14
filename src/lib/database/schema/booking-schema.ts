
import { Schema } from "mongoose";
import { IBooking } from "../types/booking-doc";

export const BookingSchema = new Schema<IBooking>(
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
        values: ['yes', 'no', 'online'],
        message: "Attending must be one of: yes, no, online",
      },
      required: [true, "Attendance status is required"],
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);