import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  certificateNumber: {
    type: String,
    default: null,
    index: true,
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

certificateSchema.index(
  { certificateNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { certificateNumber: { $ne: null } },
  }
);

const Certificate =
  mongoose.models?.Certificate ||
  mongoose.model("Certificate", certificateSchema);

export default Certificate;
