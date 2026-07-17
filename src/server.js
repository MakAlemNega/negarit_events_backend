import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // lets Express read JSON request bodies

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => res.send("Negarit Events API is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
