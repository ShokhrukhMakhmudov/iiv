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
  issueDate: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
});

const Certificate =
  mongoose.models?.Certificate ||
  mongoose.model("Certificate", certificateSchema);

export default Certificate;
