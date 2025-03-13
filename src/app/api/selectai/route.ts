import mysqlpool from "@/app/config/dbconfig";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { message: "Invalid or empty data", success: false },
        { status: 400 }
      );
    }

    console.log("Received data:", data);

    const insertResults = [];

    for (const item of data) {
      try {
        // Ensure `valuesData` exists
        const { userId, valuesData, id } = item;
        if (!valuesData) {
          console.warn("Skipping item due to missing valuesData:", item);
          continue; // Skip this entry if valuesData is missing
        }

        const result = await mysqlpool.query(
          `INSERT INTO aiuser (userId, aName, description, src, aiId) VALUES (?, ?, ?, ?, ?)`,
          [
            userId,
            valuesData?.name,
            valuesData?.instruction,
            valuesData?.src,
            id,
          ]
        );

        insertResults.push(result);
      } catch (insertError) {
        console.error("Error inserting item:", item, insertError);
      }
    }

    if (insertResults.length > 0) {
      return NextResponse.json({
        message: "Data inserted successfully",
        success: true,
        data: insertResults,
      });
    }

    return NextResponse.json(
      { message: "No data inserted", success: false },
      { status: 400 }
    );
  } catch (e) {
    console.error("Error inserting data:", e);
    return NextResponse.json(
      { message: "Server error during insertion", success: false },
      { status: 500 }
    );
  }
}
