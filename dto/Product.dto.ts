import { IsEmail, Length, IsEmpty } from "class-validator";
export interface ProductStatus {
  out_of_stock?: number;
  in_stock: number;
  running_low: boolean;
}

export class ProductCategory {
  name?: string;
  desc?: string;
  created_at: Date = new Date();
  modified_at?: Date;
}

export class CreateProductInput {
  @Length(7, 15)
  name?: string;

  @Length(6, 250)
  desc?: string;

  category_id?: number;
  inventory_id?: number;
  shipping_id?: number;
  price?: number;
  status?: number;
  tag_id?: number;
  vender_id?: number;
  rating?: number;
  created_at: Date = new Date();
  modified_at?: Date;
}
