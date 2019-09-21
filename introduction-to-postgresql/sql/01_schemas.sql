CREATE TYPE organization_role
AS ENUM (
  'shipper',
  'carrier',
  'collaborator'
);

CREATE TABLE organizations (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL,
  active boolean NOT NULL DEFAULT TRUE,
  roles organization_role[] NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX
ON organizations (name);

CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar(100) NOT NULL,
  email varchar(4096) NOT NULL UNIQUE,
  password varchar(4096) NOT NULL,
  active boolean NOT NULL DEFAULT TRUE,
  organization_id integer NOT NULL REFERENCES organizations (id),
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX
ON users (name);

CREATE INDEX
ON users (organization_id);

CREATE TYPE offer_pallet_dimension
AS ENUM (
  '80x120',
  '100x120',
  '60x80',
  '120x120',
  '60x100'
);

CREATE TYPE offer_state
AS ENUM (
  'created',
  'published',
  'accepted',
  'picked_up',
  'delivered',
  'fulfilled'
);

CREATE TABLE offers (
  id bigserial PRIMARY KEY,
  pickup_address varchar(1000) NOT NULL,
  pickup_date date NOT NULL,
  delivery_address varchar(1000) NOT NULL,
  delivery_date date NOT NULL,
  pallet_dimension offer_pallet_dimension NOT NULL,
  pallet_quantity smallint NOT NULL,
  pallet_height smallint NOT NULL,
  pallet_weight smallint NOT NULL,
  state offer_state NOT NULL DEFAULT 'created',
  pricing jsonb NOT NULL,
  shipper_id integer NOT NULL REFERENCES users (id),
  carrier_id integer REFERENCES users (id),
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX
ON offers (pickup_address);

CREATE INDEX
ON offers (delivery_address);

CREATE INDEX
ON offers (shipper_id);

CREATE INDEX
ON offers (carrier_id);
