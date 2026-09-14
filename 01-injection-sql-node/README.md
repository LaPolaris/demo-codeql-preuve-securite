# Exemple 1 — Injection SQL dans une API Express / PostgreSQL

Node.js 22, modules ES, Express 5, `pg`.

## Les trois états du code

| Branche | État de `src/serveur.js` | Résultat CodeQL |
|---------|--------------------------|-----------------|
| `main` | Le catalogue complet, sans filtre. Aucune donnée du client n'atteint la requête. | Aucune alerte |
| `feat/filtre-par-categorie` | Ajout du filtre `?categorie=`, construit par interpolation de chaîne. | `js/sql-injection` — gravité 8.8 |
| `fix/requete-parametree` | Même fonctionnalité, requête paramétrée. | Aucune alerte |

La branche `feat/filtre-par-categorie` n'est pas un contre-exemple artificiel :
c'est la forme que prend une régression réelle. Un développeur ajoute un filtre
demandé par le métier, le code fait ce qu'on lui demande, la revue humaine passe
à côté parce que les quatre lignes sont anodines prises isolément.

## Ce que CodeQL voit

- **Source** : `req.query.categorie` — une valeur contrôlée par le client HTTP.
- **Propagation** : l'interpolation dans le littéral de gabarit `sql`.
- **Puits** : `pool.query(sql)` — `pg` est modélisé par CodeQL comme une
  exécution de requête SQL.

Le moteur n'a pas « reconnu un motif dangereux » : il a établi qu'il existe un
chemin praticable entre une entrée non fiable et une exécution. C'est cette
distinction qui fait la valeur de la preuve.

## Pourquoi le correctif éteint l'alerte

Détail qui surprend souvent : après correction, `req.query.categorie` atteint
toujours `pool.query`. Le chemin entre la source et le puits existe encore.

Ce qui change, c'est le **rôle** de la valeur à l'arrivée. En paramètre lié, elle
n'est plus concaténée à la requête : elle est transmise séparément et PostgreSQL
la traite comme une donnée. CodeQL modélise cet argument comme un emplacement
sûr, pas comme du SQL exécutable — le flux n'aboutit donc plus sur un puits.

La conséquence pratique compte pour un audit : une alerte qui disparaît ne
signifie pas que l'entrée utilisateur a été supprimée, mais qu'elle ne peut plus
changer la structure de la requête. C'est aussi pourquoi désinfecter « à la main »
avec un échappement maison ne suffit généralement pas à éteindre l'alerte : le
moteur ne reconnaît pas la fonction comme un assainisseur.

## La limitation de débit, trouvée en chemin

Ce dossier contient un `rateLimit` qui n'était pas prévu. Il vient d'une alerte
`js/missing-rate-limiting` remontée par CodeQL dès la première analyse, sur du
code écrit ligne par ligne pour ne contenir qu'une seule faille — l'injection
SQL.

L'alerte est fondée : une route qui interroge la base sans plafond de requêtes
se prête à une saturation du service. Elle vient de la suite `security-extended`,
que la configuration par défaut n'active pas.

C'est la meilleure illustration possible de ce que fait un moteur d'analyse :
il ne cherche pas ce que vous avez décidé de lui montrer.

## Faire tourner la démonstration

```bash
npm install
createdb catalogue && psql catalogue -f schema.sql
PGDATABASE=catalogue npm start
```

Sur la branche vulnérable, l'injection est directe :

```bash
curl "http://localhost:3000/produits?categorie=x' OR '1'='1"
```

La réponse contient la ligne `Licence interne`, catégorie `confidentiel`, que le
filtre était censé exclure. Sur `main` et sur la branche corrigée, la même requête
renvoie un tableau vide : la valeur est traitée comme une donnée, jamais comme du
code SQL.
