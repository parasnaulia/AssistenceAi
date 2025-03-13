import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const secretKey = process.env.JWT_SECRET || "default_secret_key";

    // Get cookies using Next.js built-in `cookies()`
    const cookieStore = cookies();
    const token = cookieStore.get("AiCookie")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "JWT token not found", success: false },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const cookieData = jwt.verify(token, secretKey);
    console.log(cookieData);

    return NextResponse.json({
      message: "Credentials Fetched",
      data: cookieData,
      success: true,
    });
  } catch (e) {
    console.error("Error fetching user credentials: ", e);
    return NextResponse.json(
      {
        message: "Credentials not fetched",
        error: e.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
