import express from "express";
import dotenv from "dotenv"

dotenv.config({})


const app = express();
//app.use(express.static("",))

const PORT = process.env.PORT || 3000;


app.listen(PORT, (req, res)=>
{
  console.log(`The server is running on port: ${PORT}`)
})