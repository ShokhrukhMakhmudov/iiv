import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
  },
  course: { type: String, required: true },
  file: {
    type: String,
    required: true,
  },
});

const Certificate =
  mongoose.models?.Certificate ||
  mongoose.model("Certificate", certificateSchema);

export default Certificate;
