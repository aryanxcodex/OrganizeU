import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import path from "path";
import userRoutes from "./routes/usersRoutes.js";
import boardsRoutes from "./routes/boardsRoutes.js";
import cardsRoutes from "./routes/cardsRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();

const server = createServer(app);

const io = new Server(server, {
  corsOptions,
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
});

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/u", userRoutes);
app.use("/api/b", boardsRoutes);
app.use("/api/c", cardsRoutes);
app.use("/api/t", tasksRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Ready");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
