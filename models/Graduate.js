import mongoose from "mongoose";

const graduateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  passport: { type: String, required: true, unique: true },
  jshir: { type: String, required: true, unique: true },
  graduationDate: { type: Date, required: true },
  certificateCount: { type: Number, default: 0 },
});

const Graduate =
  mongoose.models?.Graduate || mongoose.model("Graduate", graduateSchema);

export default Graduate;
