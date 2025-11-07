import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "../../../../lib/mongodb";
import Profile from "../../../../lib/database/profile-model";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const { username, email, password } = await request.json();

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingProfile = await Profile.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingProfile) {
      if (existingProfile.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
      if (existingProfile.username === username) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newProfile = new Profile({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // Save user to database
    await newProfile.save();

    // Return success response (without password)
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newProfile._id,
          username: newProfile.username,
          email: newProfile.email,
          createdAt: newProfile.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);

    // Handle MongoDB duplicate key error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      const field = 'keyValue' in error ? Object.keys((error as any).keyValue)[0] : 'field';
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}