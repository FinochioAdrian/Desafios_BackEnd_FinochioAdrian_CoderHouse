import mongoose from "mongoose";
 
export default function connectDB(url) {
  
  
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