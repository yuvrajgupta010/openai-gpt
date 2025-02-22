import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();
const app = express();

//allowed origins
let origins: Array<string>;
if (process.env.SERVER_ENV === "PROD") {
  origins = [
    "http://openai-gpt.yuvrajgupta.in",
    "https://openai-gpt.yuvrajgupta.in",
  ];
} else {
  origins = ["http://localhost:5173", "http://localhost:3000"];
}

//middlewares
app.use(
  cors({
    origin: origins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
if (process.env.SERVER_ENV === "DEV") {
  app.use(morgan("dev"));
}

app.get("/health-check", (req, res) => {
  return res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/v1", appRouter);

export default app;
