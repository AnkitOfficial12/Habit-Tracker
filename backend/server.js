import "dotenv/config";
import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habit.js"
import logRoutes from './routes/logs.js'

const app = express();

const allowdOrigins = (process.env.CLIENT_URL || "").split(",").map(origin => origin.trim()).filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
    }
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(`Origin ${origin} not allowed by CORS`);
},

    credentials: true,
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({limit: "1mb"}));

app.get("/api/health", (req, res) => {
    res.status(200).json({status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/logs", logRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(PORT, () => 
        console.log(`Server running on port ${PORT}`)
    );
});