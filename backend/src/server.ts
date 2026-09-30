import express from "express";
import "dotenv/config";
import cors from "cors";
import healthRoutes from "./routes/health.routes"
import { testDatabaseConnection } from "./services/database.service";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import opportunityRoutes from "./routes/opportunity.routes";
//creating express application
const app = express();

const PORT = 5000;

//add cors middleware
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/health",healthRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/opportunities", opportunityRoutes);

app.listen(PORT, async() => {
  console.log(`Server running on http://localhost:${PORT}`);

 await testDatabaseConnection();
});