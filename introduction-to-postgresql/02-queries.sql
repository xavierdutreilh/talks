INSERT INTO organizations (name, roles)
VALUES ('Everoad','{shipper,carrier,collaborator}'),
       ('Convargo', '{collaborator}'),
       ('ABC in Dev', '{shipper}'),
       ('Les transports du midi', '{carrier}')
RETURNING *;

SELECT *
FROM organizations;

SELECT *
FROM organizations
WHERE roles @> '{shipper}';

INSERT INTO users (name, email, password, organization_id)
VALUES ('Xavier Dutreilh', 'xavier@everoad.com', 'xavier', (SELECT id FROM organizations WHERE name = 'Everoad')),
       ('Mohamed Benaida', 'mohamed@everoad.com', 'mohamed', (SELECT id FROM organizations WHERE name = 'Everoad')),
       ('Napo', 'napo@convargo.com', 'napo', (SELECT id FROM organizations WHERE name = 'Convargo')),
       ('Yoann Gotthilf', 'yoann@abcindev.com', 'yoann', (SELECT id FROM organizations WHERE name = 'ABC in Dev')),
       ('Aude', 'aude@lestransportsdumidi.com', 'aude', (SELECT id FROM organizations WHERE name = 'Les transports du midi'))
RETURNING *;

UPDATE users
SET name = 'Aude Rouaux'
WHERE email = 'aude@lestransportsdumidi.com'
RETURNING *;

DELETE
FROM users
WHERE email = 'aude@lestransportsdumidi.com'
RETURNING *;

INSERT INTO users (name, email, password, organization_id)
VALUES ('Aude', 'aude@lestransportsdumidi.com', 'aude', (SELECT id FROM organizations WHERE name = 'Les transports du midi'))
ON CONFLICT (email)
DO UPDATE
SET name = 'Aude Rouaux'
RETURNING *;

INSERT INTO offers (pickup_address, pickup_date, delivery_address, delivery_date, pallet_dimension, pallet_quantity, pallet_height, pallet_weight, state, pricing, shipper_id)
VALUES ('10 rue Juge, 75015 Paris, France', '2018-08-27', '20 rue Petrelle, 75009 Paris, France', '2018-08-29', '80x120', 1, 20, 5, 'published', '{"shipperAmount": 100, "shipperCurrency": "USD", "carrierAmount": 70, "carrierCurrency": "EUR"}', (SELECT id FROM users WHERE email = 'xavier@everoad.com'))
RETURNING *;

INSERT INTO offers (pickup_address, pickup_date, delivery_address, delivery_date, pallet_dimension, pallet_quantity, pallet_height, pallet_weight, pricing, shipper_id)
VALUES ('12 rue Juge, 75015 Paris, France', '2018-09-03', '24 rue Petrelle, 75009 Paris, France', '2018-09-05', '80x120', 33, 50, 10, '{"shipperAmount": 340, "shipperCurrency": "EUR", "carrierAmount": 300, "carrierCurrency": "EUR"}', (SELECT id FROM users WHERE email = 'xavier@everoad.com')),
       ('12 rue Juge, 75015 Paris, France', '2018-09-10', '24 rue Petrelle, 75009 Paris, France', '2018-09-12', '80x120', 33, 50, 10, '{"shipperAmount": 340, "shipperCurrency": "EUR", "carrierAmount": 300, "carrierCurrency": "EUR"}', (SELECT id FROM users WHERE email = 'xavier@everoad.com')),
       ('12 rue Juge, 75015 Paris, France', '2018-09-17', '24 rue Petrelle, 75009 Paris, France', '2018-09-19', '80x120', 33, 50, 10, '{"shipperAmount": 340, "shipperCurrency": "EUR", "carrierAmount": 300, "carrierCurrency": "EUR"}', (SELECT id FROM users WHERE email = 'xavier@everoad.com'))
RETURNING *;

SELECT *
FROM offers;

SELECT *
FROM offers
WHERE state = 'published';

SELECT state, COUNT(*)
FROM offers
GROUP BY state;

SELECT *
FROM offers
WHERE pricing @> '{"shipperCurrency": "EUR"}';

SELECT SUM(CAST(pricing->>'shipperAmount' AS NUMERIC)) AS amount, pricing->'shipperCurrency' AS currency
FROM offers
GROUP BY pricing->'shipperCurrency';

SELECT organizations.id, organizations.name, COUNT(*) AS publications
FROM organizations
INNER JOIN users
ON organizations.id = users.organization_id
INNER JOIN offers
ON users.id = offers.shipper_id AND state != 'created'
GROUP BY organizations.id;

UPDATE offers
SET carrier_id = (SELECT id FROM users WHERE email = 'xavier@everoad.com'), state = 'accepted'
WHERE state = 'published'
RETURNING *;

UPDATE offers
SET carrier_id = (SELECT id FROM users WHERE email = 'napo@convargo.com')
WHERE state = 'accepted'
RETURNING *;

UPDATE offers
SET carrier_id = (SELECT id FROM users WHERE email = 'mohamed@everoad.com')
WHERE state = 'accepted'
RETURNING *;
