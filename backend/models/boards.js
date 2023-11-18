import mongoose from "mongoose";
const Schema = mongoose.Schema;
import tasks from "./tasks.js";
import { connectDB } from "../config/db.js";

connectDB();

const boardSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      role: {
        type: String,
        default: "member",
      },
    },
  ],
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "cards",
    },
  ],
});

const boards = mongoose.model("boards", boardSchema);

export default boards;
