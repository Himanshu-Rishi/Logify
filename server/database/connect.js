import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import ENV from '../config.js'

async function connect(){
    const mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();
  mongoose.set('strictQuery', true);
  const db = await mongoose.connect(ENV.ATLAS_URL);
  console.log("Database connected successfully.")
  return db
};

export default connect;