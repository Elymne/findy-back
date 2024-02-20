import express, { Application } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app: Application = express();
const port = process.env.PORT ?? "3000";

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
