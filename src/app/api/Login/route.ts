import mysqlpool from "@/app/config/dbconfig";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
import { cookies } from "next/headers"; // Correct way to set cookies

interface User {
  id: number;
  Name: string;
  Email: string;
  Password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Query user by email
    const [rows] = await mysqlpool.query<User[]>(
      `SELECT * FROM users WHERE email=?`,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 400 }
      );
    }

    const user = rows[0];

    // Secure password check using bcrypt
    // const isMatch = await bcrypt.compare(password, user.Password);
    if (rows[0]?.Password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials", success: false },
        { status: 400 }
      );
    }

    console.log("Password matches");

    // Use environment variable for JWT secret
    const secretKey = process.env.JWT_SECRET || "default_secret_key";

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.Name, email: user.Email },
      secretKey,
      { expiresIn: "1h" }
    );

    // Set secure HTTP-only cookie
    cookies().set("AiCookie", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({
      message: "Login Successful",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
