CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

ALTER TABLE offers
ADD COLUMN pickup_position geography(POINT),
ADD COLUMN delivery_position geography(POINT);

UPDATE offers
SET pickup_position = ST_SetSRID(ST_MakePoint(2.2923356, 48.8501124), 4326)
WHERE pickup_address = '10 rue Juge, 75015 Paris, France'
RETURNING *;

UPDATE offers
SET delivery_position = ST_SetSRID(ST_MakePoint(2.3478665, 48.880739), 4326)
WHERE delivery_address = '20 rue Petrelle, 75009 Paris, France'
RETURNING *;

UPDATE offers
SET pickup_position = ST_SetSRID(ST_MakePoint(2.2924695, 48.8499602), 4326)
WHERE pickup_address = '12 rue Juge, 75015 Paris, France'
RETURNING *;

UPDATE offers
SET delivery_position = ST_SetSRID(ST_MakePoint(2.347426, 48.8809359), 4326)
WHERE delivery_address = '24 rue Petrelle, 75009 Paris, France'
RETURNING *;

SELECT *
FROM offers;

SELECT *, ST_AsText(offers.pickup_position), ST_AsText(offers.delivery_position)
FROM offers;

SELECT *, ST_Distance(offers.pickup_position, offers.delivery_position) AS distance
FROM offers;

SELECT *
FROM offers
WHERE ST_DWithin(offers.pickup_position, ST_MakePoint(2.2924695, 48.8499602), 10);
