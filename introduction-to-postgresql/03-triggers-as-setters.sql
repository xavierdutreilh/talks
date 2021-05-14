CREATE FUNCTION set_updated_at()
RETURNS TRIGGER
AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON offers
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

UPDATE offers
SET carrier_id = (SELECT id FROM users WHERE email = 'xavier@everoad.com')
WHERE state = 'accepted'
RETURNING *;
