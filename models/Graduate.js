import mongoose from "mongoose";

const graduateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  surname: { type: String, required: true },
  photo: { type: String },
  passport: { type: String, required: true, unique: true },
  jshir: { type: String, required: true, unique: true },
});

const Graduate =
  mongoose.models?.Graduate || mongoose.model("Graduate", graduateSchema);

export default Graduate;
