import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email обязателен"],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Неверный формат email"],
  },
  password: {
    type: String,
    required: [true, "Пароль обязателен"],
    minlength: [6, "Пароль должен быть минимум 6 символов"],
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
