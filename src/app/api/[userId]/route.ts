import mysqlpool from "@/app/config/dbconfig";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    console.log("Request received:", req);
    console.log("Params:", params);

    // Ensure userId exists
    if (!params?.userId) {
      return NextResponse.json(
        { message: "User ID is missing", success: false },
        { status: 400 }
      );
    }

    // Execute the SQL query correctly
    const [rows] = await mysqlpool.query(`SELECT * FROM aiuser WHERE userId = ?`, [params.userId]);

    if (rows.length > 0) {
      return NextResponse.json({
        message: "Yes, user has AIs",
        success: true,
        data: rows, // Returning AI data
      });
    } else {
      return NextResponse.json(
        { message: "No, user does not have AIs", success: false },
        { status: 404 }
      );
    }
  } catch (e) {
    console.error("Error fetching data:", e);
    return NextResponse.json(
      { message: "Server error while fetching AIs", success: false },
      { status: 500 }
    );
  }
}
