import mongoose from "mongoose";
const Schema = mongoose.Schema;
// import { connectDB } from "../config/db.js";

// connectDB();

const cardSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "tasks",
    },
  ],
});

const boardSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  cards: [cardSchema],
});

const boards = mongoose.model("boards", boardSchema);

export default boards;
