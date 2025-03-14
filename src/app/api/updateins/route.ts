import mysqlpool from "@/app/config/dbconfig";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    console.log("Received data:", data);

    // Validate required fields
    // if (!data.disc || !data.selected.aiId) {
    //   return NextResponse.json(
    //     { message: "aiId and description are required", success: false },
    //     { status: 400 }
    //   );
    // }

    // Execute the update query
    const [updateResult]: any = await mysqlpool.query(
      `UPDATE aiuser SET description=? WHERE aiId=?`,
      [data.disc, data.selected.aiId]
    );

    // console.log(data.selected.aiId)

    console.log(updateResult);

    if (updateResult.affectedRows > 0) {
      return NextResponse.json({
        message: "Data updated successfully",
        success: true,
      });
    }

    return NextResponse.json(
      { message: "No records updated, invalid aiId", success: false },
      { status: 404 }
    );
  } catch (e) {
    console.error("Error updating data:", e);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
