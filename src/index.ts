import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import path from "path";

const publicPath = path.join(__dirname, "public");

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.static(publicPath));

app.get("*", (req: Request, res: Response) => {
  res.send("Welcome to Daily Python Jobs");
});

app.listen(port, () => {
  console.log(`port ${port} where it all happens`);
});
