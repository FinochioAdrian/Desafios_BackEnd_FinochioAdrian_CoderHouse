import dotenv from "dotenv";

const environment = "PRODUCTION";

dotenv.config(
    {
    path:environment === "DEVELOPMENT" ? "./.env.development" : "./.env.production",
 
 } 
);

export default {
  ENTORNO: process.env.ENTORNO,
  PRIVATE_KEY_COOKIE: process.env.PRIVATE_KEY_COOKIE,
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  PRIVATE_KEY_JWT: process.env.PRIVATE_KEY_JWT,
  CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
  CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
  CALLBACK_URL_GITHUB: `${process.env.DOMAIN_URN}:${process.env.PORT}${process.env.ENDPOINT_URL_GITHUB}`,
};
