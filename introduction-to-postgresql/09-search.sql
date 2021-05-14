SELECT *
FROM organizations
WHERE to_tsvector(name) @@ plainto_tsquery('transport midis');

SELECT *
FROM users
WHERE to_tsvector(name) @@ to_tsquery('xavier');

SELECT *
FROM offers
WHERE to_tsvector(pickup_address) @@ plainto_tsquery('12 rue juge paris');

SELECT *
FROM offers
WHERE to_tsvector(delivery_address) @@ plainto_tsquery('24 rue petrelle paris');

SELECT *
FROM organizations
WHERE to_tsvector(name) @@ plainto_tsquery('tränspôrt mïdïs');

CREATE EXTENSION unaccent;

SELECT *
FROM organizations
WHERE name = unaccent('Les tränspôrts du mïdï');

CREATE TEXT SEARCH CONFIGURATION english_unaccented (
  COPY = english
);

ALTER TEXT SEARCH CONFIGURATION english_unaccented
ALTER MAPPING FOR asciihword, asciiword, hword, hword_asciipart, hword_part, word
WITH unaccent, english_stem;

SELECT *
FROM organizations
WHERE to_tsvector(name) @@ plainto_tsquery('english_unaccented', 'tränspôrt mïdïs');

CREATE INDEX
ON organizations
USING gin (to_tsvector('english_unaccented', name));

CREATE INDEX
ON users
USING gin (to_tsvector('english_unaccented', name));

CREATE INDEX
ON offers
USING gin (to_tsvector('english_unaccented', pickup_address));

CREATE INDEX
ON offers
USING gin (to_tsvector('english_unaccented', delivery_address));
