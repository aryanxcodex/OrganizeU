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
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  // Join user to board's chat room
  socket.on("joinBoard", (boardId, userId) => {
    socket.join(boardId);
    console.log(`User ${userId} joined board ${boardId} chat room`);
  });

  // Handle chat messages
  socket.on("chatMessage", ({ boardId, userId, userProfileImage, message }) => {
    io.to(boardId).emit("chatMessage", { userId, userProfileImage, message }); // Broadcast message to board members
    console.log(`User ${userId} sent message to board ${boardId}: ${message}`);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
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

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
