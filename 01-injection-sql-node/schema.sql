-- Jeu de données minimal pour faire tourner la démonstration.
--   createdb catalogue && psql catalogue -f schema.sql
CREATE TABLE IF NOT EXISTS produit (
    id        SERIAL PRIMARY KEY,
    nom       TEXT           NOT NULL,
    prix      NUMERIC(10, 2) NOT NULL,
    categorie TEXT           NOT NULL
);

INSERT INTO produit (nom, prix, categorie) VALUES
    ('Clavier mécanique', 89.90, 'peripherique'),
    ('Écran 27 pouces', 249.00, 'peripherique'),
    ('Disque SSD 1 To', 74.50, 'stockage'),
    ('Licence interne', 0.00, 'confidentiel');
