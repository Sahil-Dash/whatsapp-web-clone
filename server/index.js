import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port:- http://localhost:${process.env.PORT}`); // eslint-disable-line no-console
});

global.onlineUsers = new Map();
