import MongoSingleton from "../config/mongoSingleton.js";
import config from "../config/config.js";

export default class DAOFactory {
  static #instance;
  #productsDao;
  #cartsDao;
  #usersDao;
  #messagesDao;

  constructor() {
    if (DAOFactory.#instance) {
      return DAOFactory.#instance;
    }
    DAOFactory.#instance = this;
  }

  static async getInstance() {
    if (!DAOFactory.#instance) {
      DAOFactory.#instance = new DAOFactory();
      await DAOFactory.#instance.initialize();
    }
    return DAOFactory.#instance;
  }

  async initialize() {
    switch (config.PERSISTENCE) {
      case "MONGO":
        const { default: ProductsMongoDAO } = await import("./products/products.dao.js");
        const { default: CartsMongoDAO } = await import("./carts/cart.dao.js");
        const { default: UsersMongoDAO } = await import("./users/users.dao.js");
        const { default: MessagesMongoDAO } = await import("./messages/messages.dao.js");
        const connection = await MongoSingleton.getInstance();
        this.#productsDao = ProductsMongoDAO;
        this.#cartsDao = CartsMongoDAO;
        this.#usersDao = UsersMongoDAO;
        this.#messagesDao = MessagesMongoDAO;
        break;
      case "MEMORY":

      case "FILE":

      default:
        throw new Error("Invalid persistence type.");
    }
  }

  async getProductsDao() {
    if (!this.#productsDao) {
      await this.initialize();
    }
    return this.#productsDao;
  }

  async getCartsDao() {
    if (!this.#cartsDao) {
      await this.initialize();
    }
    return this.#cartsDao;
  }
  async getUsersDao() {
    if (!this.#usersDao) {
      await this.initialize();
    }
    return this.#usersDao;
  }
  async getMessagesDao() {
    if (!this.#usersDao) {
      await this.initialize();
    }
    return this.#usersDao;
  }
}

const factoryInstance = await DAOFactory.getInstance();
export const Products = await factoryInstance.getProductsDao();
export let Carts = await factoryInstance.getCartsDao();
export let Users = await factoryInstance.getUsersDao()
export let Messages = await factoryInstance.getMessagesDao()