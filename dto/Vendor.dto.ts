export interface CreateVendorInput {
  name: string;
  owner_id: number;
  email: string;
  password: string;
  tel: string;
  salt: string;
  service_available: boolean;
  rating: number;
  address_line1: string;
  address_line2: string;
  city: string;
  lat: number;
  lng: number;
  created_at: Date;
  modified_at: Date;
}

export interface UpdateVandor {
  name: string;
  address_line1: string;
  address_line2: string;
  email: string;
  password: string;
  tel: string;
}

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
}
