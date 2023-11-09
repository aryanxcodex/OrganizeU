import mongoose from "mongoose";
const Schema = mongoose.Schema;

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  assignedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

const tasks = mongoose.model("tasks", taskSchema);

export default tasks;
