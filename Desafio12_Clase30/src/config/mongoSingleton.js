import mongoose from "mongoose";
import envConfig from "./config.js";

export default class MongoSingleton {
  static #instance;
  
  constructor() {
    try {
      this.URL = envConfig.MONGO_URL
      mongoose.connect(this.URL);
    } catch (err) {
      console.log(err.message);
      process.exit(1);
    }
  }
  static getInstance() {
    if (this.#instance) {
      console.log("Already connected");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
      console.log(`⚡️[Database] Database connected: ${this.URL}`);
    });

    dbConnection.on("error", (err) => {
      console.error(`connection error: ${err}`);
    });
    return this.#instance;
  }
}
