import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
dotenv.config();
async function connect(){
    const mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();
  mongoose.set('strictQuery', true);
  const db = await mongoose.connect(process.env.REACT_APP_ATLAS_URL);
  console.log("Database connected successfully.")
  return db
};

export default connect;