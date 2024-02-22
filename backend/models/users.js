import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";

// connectDB();

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,  //CloudinaryLink
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  boards: [
    {
      type: Schema.Types.ObjectId,
      ref: "boards",
    },
  ],
});

userSchema.index(
  { createdAt: 1 },
  {
    expires: 86400, // 10 mins
    partialFilterExpression: {
      isVerified: false,
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const user = mongoose.model("users", userSchema);

export default user;
