import UserDto from "../user.dto.js";
export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUserByEmail = async (email) => {
    const UserEmailToFind = new UserDto({ email });
    const result = await this.dao.getUserByEmail(UserEmailToFind);
    if (!result) return null;
    return new UserDto(result);
  };
  getUserByCreds = async (email, password) => {
    const UserToFind = new UserDto({ email, password });
    const result = await this.dao.getUserByCreds(UserToFind);
    if (!result) return null;
    return new UserDto(result);
  };
  insert = async (userData) => {
    const UserToInsert = new UserDto(userData);

    const result = await this.dao.insert(UserToInsert);
    if (!result) return null;
    return new UserDto(result);
  };
  getUserByID = async (id) => {
    const UserToFind = new UserDto({_id:id});
    const result = await this.dao.getUserByID(UserToFind);
    if (!result) return null;
    return new UserDto(result);
  };
  newPassword = async (user) => {
    const UserToInsert = new UserDto(user);
    const result = await this.dao.newPassword(UserToInsert);
    return result;
  };
}
