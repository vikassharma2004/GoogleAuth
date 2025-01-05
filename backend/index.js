import  express from "express"
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import AuthRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();
const app=express();

const corsoption = {
    credentials: true,
    origin: "https://google-auth-snowy.vercel.app",
    methods: ["GET,PUT,PATCH,DELETE,POST,HEAD"],
   // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], 
  };


const port=process.env.PORT || 5000

app.use(cors(corsoption))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
// ... existing code ...
const PORT = process.env.PORT || 5000;

 

app.get("/", (req, res) => {
  res.send("backend started");
});

app.use("/api/auth", AuthRoutes);

// Catch-all handler for undefined routes
app.use((req, res, next) => {
  res.status(404).send({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  connectDB();
});
