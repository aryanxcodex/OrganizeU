import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { connectDB } from "../config/db.js";

// connectDB();

const cardSchema = Schema({
  title: {
    type: String,
    require: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "boards",
  },
});

const cards = mongoose.model("cards", cardSchema);

export default cards;
