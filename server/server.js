import "dotenv/config";
import cors from "cors";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import history from "connect-history-api-fallback";

import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());

app.use(routes);

app.use(history({ index: "/index.html" }));

app.use(express.static(path.join(__dirname, "../dist")));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});