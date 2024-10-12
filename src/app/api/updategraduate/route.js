import connectMongoDb from "../../../../lib/mongodb";
import Graduate from "../../../../models/Graduate";

export async function PUT(req, res) {
  await connectMongoDb();

  const { name, lastname, surname, passport, jshir, photo, id } = await req.json();

  try {
    const updatedGraduate = await Graduate.findByIdAndUpdate(
      id,
      {
        name,
        surname,
        lastname,
        passport: passport?.toUpperCase(),
        jshir: jshir,
        photo,
      },
      { new: true, runValidators: true }
    );

    if (!updatedGraduate) {
      return new Response(
        JSON.stringify({ success: false, message: "Bitiruvchi topilmadi" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, graduate: updatedGraduate }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400 }
    );
  }
}
