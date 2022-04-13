create table table_name(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(19,2) NOT NULL,
    car_id BIGINT NOT NULL REFERENCES car (id),
    UNIQUE(car_id)
);

create table car(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
)

insert into car(name) values('Desire');



CREATE TYPE "products_status" AS ENUM (
  'out_of_stock',
  'in_stock',
  'running_low'
);

CREATE TABLE "users_group" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "desc" varchar
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar NOT NULL,
  "verified" boolean,
  "email" varchar,
  "tel" varchar NOT NULL,
  "password" text,
  "salt" text,
  "oto" varchar,
  "otp_expiry" timestamp,
  "address_line1" varchar,
  "address_line2" varchar,
  "city" varchar,
  "lat" numeric(2,6),
  "lng" numeric(2,6),
  "created_at" timestamp,
  "modified_at" timestamp,
  "user_group" int
);

CREATE TABLE "product_categories" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "desc" text NOT NULL,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "product_inventories" (
  "id" SERIAL PRIMARY KEY,
  "quantity" int,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "product_shipping" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "desc" text NOT NULL,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "desc" text,
  "category_id" int NOT NULL,
  "inventory_id" int,
  "shipping_id" int,
  "price" numeric(10,2) NOT NULL,
  "status" products_status,
  "tag_id" int,
  "vender_id" int UNIQUE,
  "rating" int,
  "created_at" date DEFAULT (now()),
  "modified_at" date DEFAULT (now())
);

CREATE TABLE "product_tags" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "desc" text NOT NULL,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "venders" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "owner" varchar NOT NULL,
  "email" varchar,
  "tel" varchar NOT NULL,
  "password" text,
  "salt" text,
  "service_available" boolean,
  "rating" int,
  "address_line1" varchar,
  "address_line2" varchar,
  "city" varchar,
  "lat" numeric(2,6),
  "lng" numeric(2,6),
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "order_status" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "desc" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "net_price" numeric(10,2) NOT NULL,
  "add_tax" numeric(10,2) NOT NULL,
  "gross_price" numeric(10,2) NOT NULL,
  "remarks" text,
  "user_id" int UNIQUE NOT NULL,
  "status" int,
  "vender_id" int UNIQUE NOT NULL,
  "payment_via" varcher,
  "delivery_boy" int NOT NULL,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" int,
  "product_id" int,
  "quantity" int DEFAULT 1
);

CREATE TABLE "notifications" (
  "id" SERIAL PRIMARY KEY,
  "message" varcher NOT NULL,
  "isRead" boolean,
  "type" varcher NOT NULL,
  "receiverId" int,
  "status" int,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "chat" (
  "id" SERIAL PRIMARY KEY,
  "from" varcher NOT NULL,
  "to" varcher NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "cart" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int,
  "quantity" int DEFAULT 1,
  "user_id" int UNIQUE NOT NULL
);

ALTER TABLE "users" ADD FOREIGN KEY ("user_group") REFERENCES "users_group" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("tag_id") REFERENCES "product_tags" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("vender_id") REFERENCES "venders" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("inventory_id") REFERENCES "product_inventories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("shipping_id") REFERENCES "product_shipping" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("status") REFERENCES "order_status" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("vender_id") REFERENCES "venders" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("delivery_boy") REFERENCES "users" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("receiverId") REFERENCES "users" ("id");

ALTER TABLE "chat" ADD FOREIGN KEY ("from") REFERENCES "users" ("id");

ALTER TABLE "chat" ADD FOREIGN KEY ("to") REFERENCES "users" ("id");

ALTER TABLE "cart" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "cart" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

CREATE INDEX "vender_id" ON "products" ("name", "vender_id");

CREATE UNIQUE INDEX ON "products" ("id");

CREATE UNIQUE INDEX ON "venders" ("owner");

CREATE UNIQUE INDEX ON "orders" ("user_id");

CREATE INDEX ON "notifications" ("receiverId");

CREATE INDEX ON "chat" ("from", "to");

COMMENT ON COLUMN "products"."shipping_id" IS 'kg l ml...';

COMMENT ON COLUMN "notifications"."status" IS '1 or 2';


