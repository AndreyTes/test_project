import express from "express";
import { sequelize } from "./models";
import lessonsRoutes from "./routes/lessons.routes";

const app = express();
app.use(express.json());

app.use("/lessons", lessonsRoutes);

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
