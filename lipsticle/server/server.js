import express from "express"
import dotenv from "dotenv"
import chatRoute from "./routes/chatRoute.js";
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
}
);

app.use(express.json());


app.use("/api", chatRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
}
);