import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import appRoutes from "./app/routes";

// For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json()); // Middleware to accept JSON data

app.use("", appRoutes);

app.get("*", (req: Request, res: Response) => {
  res.send("Welcome to Daily Python Jobs");
});

app.listen(port, () => {
  console.log(`port ${port} where it all happens`);
});
