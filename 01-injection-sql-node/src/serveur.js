import express from "express";
import pg from "pg";

const app = express();
const pool = new pg.Pool();

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
