"use server";

import connectMongoDb from "../../../../../lib/mongodb";
import Certificate from "../../../../../models/Certificate";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  await connectMongoDb();
  console.log(search);

  try {
    const certificates = await Certificate.find({
      $or: [
        { certificateNumber: { $regex: search, $options: "i" } }, // Поиск по certificateNumber
        { file: { $regex: search, $options: "i" } }, // Поиск по file
      ],
    });
    return new Response(JSON.stringify(certificates), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
