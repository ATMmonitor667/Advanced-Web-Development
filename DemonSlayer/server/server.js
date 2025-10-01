import express from "express";
import dotenv from "dotenv"

dotenv.config({})


const app = express();
//app.use(express.static("",))

const PORT = process.env.PORT || 3000;