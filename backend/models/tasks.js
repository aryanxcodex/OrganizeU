import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { connectDB } from "../config/db.js";

// connectDB();

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  assignedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "cards",
  },
});

const tasks = mongoose.model("tasks", taskSchema);

export default tasks;
