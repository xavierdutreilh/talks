CREATE VIEW updatable_shipper_view AS
SELECT *
FROM organizations
WHERE roles @> '{shipper}';

SELECT *
FROM updatable_shipper_view;

UPDATE updatable_shipper_view
SET active = FALSE
WHERE active = TRUE
RETURNING *;

CREATE VIEW updatable_offer_view AS
SELECT offers.id, offers.pickup_address, offers.pickup_date, offers.delivery_address, offers.delivery_date, offers.state, shipper_organizations.name AS shipper, offers.pricing->'shipperAmount' AS shipper_amount, offers.pricing->'shipperCurrency' AS shipper_currency, carrier_organizations.name AS carrier, offers.pricing->'carrierAmount' AS carrier_amount, offers.pricing->'carrierCurrency' AS carrier_currency
FROM offers
INNER JOIN users AS shipper_users ON offers.shipper_id = shipper_users.id
INNER JOIN organizations AS shipper_organizations ON shipper_users.organization_id = shipper_organizations.id
LEFT JOIN users AS carrier_users ON offers.carrier_id = carrier_users.id
LEFT JOIN organizations AS carrier_organizations ON carrier_users.organization_id = carrier_organizations.id;

CREATE FUNCTION update_offer_view()
RETURNS TRIGGER
AS $$
  BEGIN
    UPDATE offers
    SET pickup_address = NEW.pickup_address, pickup_date = NEW.pickup_date, delivery_address = NEW.delivery_address, delivery_date = NEW.delivery_date, state = NEW.state
    WHERE id = OLD.id;
    RETURN NEW;
  END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_offer_view
INSTEAD OF UPDATE ON updatable_offer_view
FOR EACH ROW EXECUTE PROCEDURE update_offer_view();

SELECT *
FROM updatable_offer_view;

UPDATE updatable_offer_view
SET state = 'delivered'
RETURNING *;
