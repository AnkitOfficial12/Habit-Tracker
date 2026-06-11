import "dotenv/config";
import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

const allowdOrigins = (process.env.CLIENT_URL || "").split(",").map(origin => origin.trim()).filter(Boolean);
