import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from "class-validator";

export class CreateVendorInput {
  @IsNotEmpty()
  @IsString()
  @Length(3, 250)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  owner_id: Number;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;

  @IsNotEmpty()
  @Length(5, 20)
  tel: string;

  @Length(5, 250)
  address_line1: string;

  @Length(5, 250)
  address_line2?: string;

  @Length(5, 50)
  city?: string;

  // @IsInt()
  // @Min(0)
  // @Max(10)
  // rating?: number;

  // @IsString()
  // salt: string;

  // @IsDate()
  // created_at?: Date;

  // @IsDate()
  // modified_at?: Date = new Date();
}

export class CreateVendorLogin {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;
}

export interface VendorType {
  name: string;
  email: string;
  owner_id: number;
  password: string;
  tel: string;
  salt: string;
  service_available?: boolean;
  address_line1: string;
  address_line2?: string;
  city: string;
  lat?: number;
  lng?: number;
  rating?: number;
  created_at: Date;
  modified_at?: Date;
}

// export class UpdateVandor {
//   @Length(5, 50)
//   name?: string;

//   address_line1?: string;
//   address_line2?: string;
//   email: string;
//   password: string;
//   tel: string;
// }

// export interface UpdateVandor {
//   name: string;
//   address_line1: string;
//   address_line2: string;
//   email: string;
//   password: string;
//   tel: string;
// }

export interface ServiceAvailableVandor {
  service_available: boolean;
}

export interface LoginVandor {
  email: string;
  password: string;
}

export interface VendorSigntaure {
  id: number;
  email: string;
  name: string;
}

export interface VendorPayLoad {
  id: number;
  email: string;
  name: string;
  // user_group: number;
}
