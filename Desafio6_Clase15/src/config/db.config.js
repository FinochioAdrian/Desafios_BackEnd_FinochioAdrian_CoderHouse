import mongoose from "mongoose";
 
export default function connectDB() {
  const url = "mongodb+srv://eidrienhez33:K0DW1LhyMOcpSKZy@ecommercecluster.nmjs8p9.mongodb.net/ecommerce?retryWrites=true&w=majority";
  
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