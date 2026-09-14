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

// Catalogue complet : aucune donnée fournie par le client n'entre dans la requête.
// CodeQL ne signale rien ici, et c'est normal — il n'y a pas de source.
app.get("/produits", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT nom, prix FROM produit ORDER BY nom",
  );
  res.json(rows);
});

app.listen(3000, () => {
  console.log("API catalogue sur http://localhost:3000/produits");
});
