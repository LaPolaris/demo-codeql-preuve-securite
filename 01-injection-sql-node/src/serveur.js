import express from "express";
import pg from "pg";
import { rateLimit } from "express-rate-limit";

const app = express();
const pool = new pg.Pool();

// Une route qui interroge la base sans plafond de requêtes est exploitable
// pour saturer le service. Le limiteur s'applique à l'application entière,
// donc à toute route ajoutée par la suite.
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Filtre par catégorie demandé par le métier.
// La catégorie est passée en paramètre lié : PostgreSQL la traite comme une
// valeur, jamais comme du SQL.
app.get("/produits", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT nom, prix FROM produit WHERE categorie = $1",
    [req.query.categorie],
  );
  res.json(rows);
});

app.listen(3000, () => {
  console.log("API catalogue sur http://localhost:3000/produits");
});
