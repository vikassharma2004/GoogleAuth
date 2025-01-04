import  express from "express"
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import AuthRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();

const corsoption = {
    credentials: true,
    origin: "https://google-auth-snowy.vercel.app",
    methods: "GET,PUT,PATCH,DELETE,POST,HEAD",
  };
const app=express();


const port=process.env.PORT || 5000

app.use(cors(corsoption))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
// ... existing code ...
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
    server.listen(PORT + 1);
  } else {
    console.error(err);
  }
});
// ... existing code ...

app.use("/api/auth",AuthRoutes)

//Rg4weqA2m3GmI2e7