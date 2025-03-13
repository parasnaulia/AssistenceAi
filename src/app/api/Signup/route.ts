import mysqlpool from "@/app/config/dbconfig";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse request body
    const data = await req.json();
    const { name, email, password } = data;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Required fields are missing",
          success: false,
        },
        { status: 400 }
      );
    }

    console.log("Received Data:", data);

    // Insert into the database
    const [result] = await mysqlpool.query(
      `INSERT INTO users (Name, Email, Password) VALUES (?, ?, ?)`,
      [name, email, password]
    );

    if (result) {
      return NextResponse.json(
        {
          message: "Data successfully added",
          success: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to insert data",
        success: false,
      },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error("Database Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Database connection error",
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
