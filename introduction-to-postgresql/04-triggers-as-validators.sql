CREATE FUNCTION validate_organizations()
RETURNS TRIGGER
AS $$
  BEGIN
    IF (SELECT 1 FROM organizations JOIN users ON organizations.id = users.organization_id WHERE organizations.roles @> '{shipper}' AND users.id = NEW.shipper_id) IS NULL
    THEN
      RAISE EXCEPTION 'Invalid shipper';
    END IF;
    IF NEW.carrier_id IS NOT NULL AND (SELECT 1 FROM organizations JOIN users ON organizations.id = users.organization_id WHERE organizations.roles @> '{carrier}' AND users.id = NEW.carrier_id) IS NULL
    THEN
      RAISE EXCEPTION 'Invalid carrier';
    END IF;
    RETURN NEW;
  END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER validate_organizations
BEFORE INSERT OR UPDATE ON offers
FOR EACH ROW
EXECUTE PROCEDURE validate_organizations();

UPDATE offers
SET shipper_id = (SELECT id FROM users WHERE email = 'napo@convargo.com')
WHERE state = 'accepted'
RETURNING *;

UPDATE offers
SET shipper_id = (SELECT id FROM users WHERE email = 'mohamed@everoad.com')
WHERE state = 'accepted'
RETURNING *;

UPDATE offers
SET carrier_id = (SELECT id FROM users WHERE email = 'napo@convargo.com')
WHERE state = 'accepted'
RETURNING *;

UPDATE offers
SET carrier_id = (SELECT id FROM users WHERE email = 'mohamed@everoad.com')
WHERE state = 'accepted'
RETURNING *;
