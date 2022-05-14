import pool from "../service/DataBase";
import { ProductType } from "../dto";

export class Product {
  name: string;
  desc?: string;
  product_image?: string;
  product_images?: [string];
  category_id: number;
  inventory_id?: number;
  SKU_id: number;
  price: number;
  status?: number;
  tag_id?: number;
  tag_id2?: number;
  tag_id3?: number;
  vender_id: number;
  rating?: number;
  created_at: Date;
  modified_at?: Date;
  constructor(ProductInfo: ProductType) {
    this.name = ProductInfo.name;
    this.desc = ProductInfo.desc;
    this.product_image = ProductInfo.product_image;
    this.product_images = ProductInfo.product_images;
    this.category_id = ProductInfo.category_id;
    this.inventory_id = ProductInfo.inventory_id;
    this.SKU_id = ProductInfo.SKU_id;
    this.price = ProductInfo.price;
    this.status = ProductInfo.status;
    this.tag_id = ProductInfo.tag_id;
    this.tag_id2 = ProductInfo.tag_id2;
    this.tag_id3 = ProductInfo.tag_id3;
    this.vender_id = ProductInfo.vender_id;
    this.rating = ProductInfo.rating;
    this.created_at = new Date();
    this.modified_at = ProductInfo.modified_at;
  }

  create() {
    const _sql = `INSERT INTO products (name, _desc, product_image, category_id, inventory_id, SKU_id, price,
                  status, tag_id, tag_id2, tag_id3, vender_id, rating, created_at, modified_at, product_images)
                  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`;

    const result = pool.query(_sql, [
      this.name,
      this.desc,
      this.product_image,
      this.category_id,
      this.inventory_id,
      this.SKU_id,
      this.price,
      this.status,
      this.tag_id,
      this.tag_id2,
      this.tag_id3,
      this.vender_id,
      this.rating,
      this.created_at,
      this.modified_at,
      this.product_images,
    ]);
    return result;
  }

  static findOne(payload: { email: string }) {
    const sql = `SELECT * FROM products WHERE email = $1`;
    return pool.query(sql, [payload.email]);
  }

  static findById(payload: { id: number }) {
    const sql = `SELECT * FROM products INNER JOIN product_categories ON 
                products.category_id = product_categories.id WHERE products.id = $1`;
    return pool.query(sql, [payload.id]);
  }

  //   static save(profile: ProductType, id: number) {
  //     const sql = `UPDATE products SET name = $1, address_line1 = $2, tag_id = $3, email = $4, tel = $5,
  //     password = $6 WHERE id = $7 RETURNING *`;
  //     const { name, address_line1, address_line2, email, tel, password } =
  //       profile;
  //     return pool.query(sql, [
  //       name,
  //       address_line1,
  //       address_line2,
  //       email,
  //       tel,
  //       password,
  //       id,
  //     ]);
  //   }

  //   static saveSevice(profile: ProductType, id: number) {
  //     const sql = `UPDATE venders SET service_available = $1, lat = $2, lng = $3 WHERE id = $4 RETURNING *`;
  //     const { service_available, lat, lng } = profile;
  //     return pool.query(sql, [service_available, lat, lng, id]);
  //   }
}
