import express from "express";
import pg from "pg";

const app = express();
const pool = new pg.Pool();

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
