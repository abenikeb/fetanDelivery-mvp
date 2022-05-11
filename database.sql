CREATE TABLE "users_group" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar,
  "desc" varchar
);

INSERT INTO users_group (name) VALUES ('Customer') RETURNING id;

CREATE TABLE "users" (
  "id" BIGSERIAL PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "verified" boolean,
  "email" varchar,
  "tel" varchar NOT NULL,
  "password" text,
  "salt" text,
  "otp" varchar,
  "otp_expiry" timestamp,
  "address_line1" varchar,
  "address_line2" varchar,
  "city" varchar,
  "lat" numeric(8,6),
  "lng" numeric(8,6),
  "created_at" timestamp,
  "modified_at" timestamp,
  "user_group" int
);

CREATE TABLE "products_status" (
  "id" BIGSERIAL PRIMARY KEY,
  "out_of_stock" int,
  "in_stock" int,
  "running_low" varchar
);

CREATE TABLE "product_categories" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "desc" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "product_inventories" (
  "id" BIGSERIAL PRIMARY KEY,
  "quantity" int,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "product_shipping" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "desc" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "products" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar,
  "desc" text,
  "category_id" int NOT NULL,
  "inventory_id" int,
  "shipping_id" int,
  "price" numeric(10,2) NOT NULL,
  "status" int,
  "tag_id" int,
  "tag_id2" int,
  "tag_id3" int,
  "vender_id" int,
  "rating" int,
  "created_at" date DEFAULT (now()),
  "modified_at" date DEFAULT (now())
);

CREATE TABLE "product_tags" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "desc" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "venders" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "owner_id" int NOT NULL,
  "email" varchar,
  "tel" varchar NOT NULL,
  "password" text NOT NULL,
  "salt" text,
  "service_available" boolean,
  "rating" int,
  "address_line1" varchar,
  "address_line2" varchar,
  "city" varchar,
  "lat" numeric(8,6),
  "lng" numeric(8,6),
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "order_status" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "desc" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "orders" (
  "id" BIGSERIAL PRIMARY KEY,
  "net_price" numeric(10,2) NOT NULL,
  "add_tax" numeric(10,2),
  "gross_price" numeric(10,2),
  "remarks" text,
  "user_id" int NOT NULL,
  "status" int,
  "vender_id" int NOT NULL,
  "payment_via" varchar,
  "delivery_boy" int,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "order_items" (
  "id" BIGSERIAL PRIMARY KEY,
  "order_id" int,
  "product_id" int,
  "quantity" int DEFAULT 1
);

CREATE TABLE "notifications" (
  "id" BIGSERIAL PRIMARY KEY,
  "message" varchar NOT NULL,
  "isRead" boolean,
  "type" varchar NOT NULL,
  "receiver_id" int,
  "status" int,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "chat" (
  "id" BIGSERIAL PRIMARY KEY,
  "from" int NOT NULL,
  "to" int NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "cart" (
  "id" BIGSERIAL PRIMARY KEY,
  "product_id" int,
  "quantity" int DEFAULT 1,
  "user_id" int UNIQUE NOT NULL
);

CREATE INDEX "vender_id" ON "products" ("name", "vender_id");

CREATE UNIQUE INDEX ON "products" ("id");

CREATE INDEX ON "venders" ("owner_id");

CREATE INDEX ON "orders" ("id", "user_id");

CREATE INDEX ON "notifications" ("receiver_id");

CREATE INDEX ON "chat" ("from", "to");

COMMENT ON COLUMN "products_status"."running_low" IS 'less than 10';

COMMENT ON COLUMN "products"."shipping_id" IS 'kg l ml...';

COMMENT ON COLUMN "notifications"."status" IS '1 or 2';

ALTER TABLE "users" ADD FOREIGN KEY ("user_group") REFERENCES "users_group" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("tag_id") REFERENCES "product_tags" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("tag_id2") REFERENCES "product_tags" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("tag_id3") REFERENCES "product_tags" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("vender_id") REFERENCES "venders" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("inventory_id") REFERENCES "product_inventories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("shipping_id") REFERENCES "product_shipping" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("status") REFERENCES "product_shipping" ("id");

ALTER TABLE "venders" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("status") REFERENCES "order_status" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("vender_id") REFERENCES "venders" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("delivery_boy") REFERENCES "users" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("receiver_id") REFERENCES "users" ("id");

ALTER TABLE "chat" ADD FOREIGN KEY ("from") REFERENCES "users" ("id");

ALTER TABLE "chat" ADD FOREIGN KEY ("to") REFERENCES "users" ("id");

ALTER TABLE "cart" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "cart" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
