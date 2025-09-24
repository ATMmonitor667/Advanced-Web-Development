import supabase from "../utils/supabase.js"
import dotenv from "dotenv"
dotenv.config({})
async function getAllfighters(req, res){
  const {data , error} = await supabase.from("UFC_Fighter").select("*")
  if(error){
     res.error(error)
  }
  res.send(data)

}

async function getFighterByName(req, res) {
  const fightName = req.params.name;

  const { data, error } = await supabase
    .from("UFC_Fighter")
    .select("*")
    .ilike("fighterName", fightName); // case-insensitive match

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}

export default { getAllfighters, getFighterByName }