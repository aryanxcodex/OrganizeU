import mongoose from "mongoose";
const Schema = mongoose.Schema;

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

const cards = mongoose.model("cards", cardSchema);

export default cards;