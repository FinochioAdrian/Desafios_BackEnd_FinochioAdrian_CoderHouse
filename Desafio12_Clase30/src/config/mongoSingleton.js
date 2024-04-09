import mongoose from "mongoose";
import envConfig from "./config.js";



function connectDB(url) {
  try {
    mongoose.connect(url);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`⚡️[Database] Database connected: ${url}`);
  });
  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
}

export default class MongoSingleton {
  static #instance;
  static URL = envConfig.MONGO_URL;

  constructor() {
    connectDB(envConfig.MONGO_URL);
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Already connected");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    
    return this.#instance;
  }
}
