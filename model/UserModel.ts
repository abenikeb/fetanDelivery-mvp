import pool from "../service/DataBase";
import { UserType } from "../dto";

export class User {
  tel: string;
  password: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  verified?: boolean;
  salt?: string;
  otp?: number | string;
  otp_expiry?: Date;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  lat?: number;
  lng?: number;
  created_at?: Date;
  modified_at?: Date;
  user_group: number;
  constructor(UserInfo: UserType) {
    this.tel = UserInfo.tel;
    this.password = UserInfo.password;
    this.first_name = UserInfo.first_name;
    this.last_name = UserInfo.last_name;
    this.email = UserInfo.email;
    this.verified = false;
    this.salt = UserInfo.salt;
    this.otp = UserInfo.otp;
    this.otp_expiry = UserInfo.otp_expiry;
    this.address_line1 = UserInfo.address_line1;
    this.address_line2 = UserInfo.address_line2;
    this.city = UserInfo.city;
    this.lat = UserInfo.lat;
    this.lng = UserInfo.lng;
    this.created_at = new Date();
    this.modified_at = UserInfo.modified_at;
    this.user_group = UserInfo.user_group;
  }
  findOne() {}
  create() {
    const result = pool.query(
      `INSERT INTO users (tel, password, first_name, last_name, email, verified, salt,
                otp, otp_expiry, address_line1, address_line2, city, lat, lng, created_at,
                modified_at, user_group) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [
        this.tel,
        this.password,
        this.first_name,
        this.last_name,
        this.email,
        this.verified,
        this.salt,
        this.otp,
        this.otp_expiry,
        this.address_line1,
        this.address_line2,
        this.city,
        this.lat,
        this.lng,
        this.created_at,
        this.modified_at,
        this.user_group,
      ]
    );
    //   (error, results) => {
    //     if (error) {
    //       throw error;
    //     }
    //     return results.rows;
    //   }
    // );
    return result;
  }
  findById() {}
  save() {
    return true;
  }
}
