import Joi from "joi";
export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  constructor(UserInfo: UserInfo) {
    this.firstName = UserInfo.firstName;
    this.lastName = UserInfo.lastName;
    this.email = UserInfo.email;
    this.password = UserInfo.password;
  }
  save() {
    return true;
  }
}

export const validUser = function (user: User) {
  const schema = {
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    email: Joi.string().min(2).max(50).required().email(),
    password: Joi.string().min(2).max(255).required(),
  };
  return Joi.valid(user, schema);
};
