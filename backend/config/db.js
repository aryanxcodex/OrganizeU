import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected`);
  } catch (error) {
    console.error(`Error : ${error.message}`);
    process.exit(1);
  }
};

const conn = mongoose.connection;

export { connectDB, conn };
