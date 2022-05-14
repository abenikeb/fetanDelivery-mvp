import pool from "../service/DataBase";
import { VendorType } from "../dto";

export class Vendor {
  name: string;
  email: string;
  owner_id: number;
  password: string;
  tel: string;
  salt?: string;
  service_available?: boolean;
  address_line1: string;
  address_line2?: string;
  city: string;
  lat?: number;
  lng?: number;
  rating?: number;
  created_at: Date;
  modified_at?: Date;
  constructor(VendorInfo: VendorType) {
    this.name = VendorInfo.name;
    this.email = VendorInfo.email;
    this.owner_id = VendorInfo.owner_id;
    this.password = VendorInfo.password;
    this.tel = VendorInfo.tel;
    this.salt = VendorInfo.salt;
    this.service_available = VendorInfo.service_available;
    this.address_line1 = VendorInfo.address_line1;
    this.address_line2 = VendorInfo.address_line2;
    this.city = VendorInfo.city;
    this.lat = VendorInfo.lat;
    this.lng = VendorInfo.lng;
    this.rating = VendorInfo.rating;
    this.created_at = new Date();
    this.modified_at = VendorInfo.modified_at;
  }

  create() {
    const _sql = `INSERT INTO venders (tel, password, email, name, owner_id, service_available, salt,
                  address_line1, address_line2, city, lat, lng, rating, created_at, modified_at)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;

    const result = pool.query(_sql, [
      this.tel,
      this.password,
      this.email,
      this.name,
      this.owner_id,
      this.service_available,
      this.salt,
      this.address_line1,
      this.address_line2,
      this.city,
      this.lat,
      this.lng,
      this.rating,
      this.created_at,
      this.modified_at,
    ]);
    return result;
  }

  static findOne(payload: { email: string }) {
    const sql = `SELECT * FROM venders WHERE email = $1`;
    return pool.query(sql, [payload.email]);
  }

  static findById(payload: { id: number }) {
    const sql = `SELECT venders.id, venders.name, venders.email, venders.email, venders.tel, venders.rating, venders.address_line1, 
                 venders.address_line2, venders.service_available, users.first_name, users.last_name, users.verified FROM venders INNER JOIN users ON venders.owner_id = users.id WHERE venders.id = $1`;
    return pool.query(sql, [payload.id]);
    // const sql = `SELECT * FROM venders WHERE id = $1`;
  }

  static save(profile: VendorType, id: number) {
    const sql = `UPDATE venders SET name = $1, address_line1 = $2, address_line2 = $3, email = $4, tel = $5,
    password = $6 WHERE id = $7 RETURNING *`;
    const { name, address_line1, address_line2, email, tel, password } =
      profile;
    return pool.query(sql, [
      name,
      address_line1,
      address_line2,
      email,
      tel,
      password,
      id,
    ]);
  }

  static saveSevice(profile: VendorType, id: number) {
    const sql = `UPDATE venders SET service_available = $1, lat = $2, lng = $3 WHERE id = $4 RETURNING *`;
    const { service_available, lat, lng } = profile;
    return pool.query(sql, [service_available, lat, lng, id]);
  }
}
