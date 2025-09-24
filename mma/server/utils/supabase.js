import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.SUPABASE_URL || "";
const API_KEY = process.env.SUPABASE_KEY || "";

if (API_URL === "" || API_KEY === "") {
  console.error("There is an error in the Supabase key or the URL");
}

const supabase = createClient(API_URL, API_KEY);

export default supabase;