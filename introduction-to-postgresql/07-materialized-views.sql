CREATE MATERIALIZED VIEW materialized_offer_view AS
SELECT offers.id, offers.pickup_address, offers.pickup_date, offers.delivery_address, offers.delivery_date, offers.state, shipper_organizations.name AS shipper, offers.pricing->'shipperAmount' AS shipper_amount, offers.pricing->'shipperCurrency' AS shipper_currency, carrier_organizations.name AS carrier, offers.pricing->'carrierAmount' AS carrier_amount, offers.pricing->'carrierCurrency' AS carrier_currency
FROM offers
INNER JOIN users AS shipper_users ON offers.shipper_id = shipper_users.id
INNER JOIN organizations AS shipper_organizations ON shipper_users.organization_id = shipper_organizations.id
LEFT JOIN users AS carrier_users ON offers.carrier_id = carrier_users.id
LEFT JOIN organizations AS carrier_organizations ON carrier_users.organization_id = carrier_organizations.id;

SELECT *
FROM materialized_offer_view;

INSERT INTO offers (pickup_address, pickup_date, delivery_address, delivery_date, pallet_dimension, pallet_quantity, pallet_height, pallet_weight, state, pricing, shipper_id)
VALUES ('12 rue Juge, 75015 Paris, France', '2018-09-24', '24 rue Petrelle, 75009 Paris, France', '2018-09-26', '80x120', 10, 20, 10, 'published', '{"shipperAmount": 260, "shipperCurrency": "EUR", "carrierAmount": 210, "carrierCurrency": "EUR"}', (SELECT id FROM users WHERE email = 'xavier@everoad.com'))
RETURNING *;

SELECT *
FROM materialized_offer_view;

REFRESH MATERIALIZED VIEW materialized_offer_view;

SELECT *
FROM materialized_offer_view;
