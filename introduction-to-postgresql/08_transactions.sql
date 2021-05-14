SELECT txid_current();

SELECT txid_current(), id, state
FROM offers;

SELECT txid_current();

SELECT txid_current(), id, state
FROM offers;

BEGIN;
SELECT txid_current();
SELECT txid_current(), id, state
FROM offers;
UPDATE offers
SET state = 'fulfilled';
SELECT txid_current();
SELECT txid_current(), id, state
FROM offers;
COMMIT;

SELECT txid_current(), id, state
FROM offers;

BEGIN;
SELECT txid_current();
SELECT txid_current(), id, state
FROM offers;
DELETE
FROM offers
RETURNING *;
UPDATE organizations
SET roles = '{admin}'
RETURNING *;
SELECT txid_current();
SELECT txid_current(), id, state
FROM offers;
COMMIT;

SELECT txid_current(), id, state
FROM offers;
