import express from "express";
import pg from "pg";

const app = express();
const pool = new pg.Pool();

// Filtre par catégorie demandé par le métier.
app.get("/produits", async (req, res) => {
  const sql = `SELECT nom, prix FROM produit
               WHERE categorie = '${req.query.categorie}'`;
  const { rows } = await pool.query(sql);
  res.json(rows);
});

app.listen(3000, () => {
  console.log("API catalogue sur http://localhost:3000/produits");
});
