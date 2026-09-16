# Exemple 2 — Injection SQL dans une API minimale .NET 8 / EF Core 8

.NET 8 LTS, API minimale, Entity Framework Core 8, provider Npgsql.

## Les trois états du code

| Branche | État de `Program.cs` | Résultat attendu |
|---------|----------------------|------------------|
| `main` | Le catalogue complet, via LINQ. Aucune donnée du client n'atteint la requête. | Aucune alerte |
| `feat/filtre-categorie-dotnet` | Ajout du filtre `?categorie=`, via `FromSqlRaw` et concaténation. | `cs/sql-injection` |
| `fix/from-sql-interpole` | Même fonctionnalité, via `FromSql` et chaîne interpolée. | Aucune alerte |

## Pourquoi cet exemple plutôt qu'un autre

L'ORM donne une fausse impression de protection. Entity Framework Core paramètre
tout seul ce qu'il traduit depuis LINQ, et l'équipe en déduit que la couche
d'accès aux données est sûre par nature. C'est vrai tant qu'on reste en LINQ.

`FromSqlRaw` est la porte de sortie : elle accepte une chaîne quelconque et
l'exécute telle quelle. La méthode porte pourtant le mot `Raw` dans son nom —
l'avertissement est là, il ne suffit pas.

## Ce que CodeQL doit établir

- **Source** : le paramètre `categorie` de l'API minimale, lié depuis la chaîne
  de requête HTTP.
- **Propagation** : la concaténation qui construit le SQL.
- **Puits** : `FromSqlRaw`, que la bibliothèque CodeQL pour C# modélise comme une
  exécution de requête.

Le point méritait vérification : la modélisation des sources est documentée de
longue date pour les contrôleurs MVC, beaucoup moins pour les paramètres de
délégué des API minimales, plus récentes. Le résultat est sans ambiguïté — le
message de l'alerte nomme lui-même l'origine de la donnée, « this ASP.NET Core
routing endpoint ». Un argument de délégué, sans attribut ni contrôleur, est
bien reconnu comme entrée utilisateur.

## La différence avec l'exemple 1 : l'étape de compilation

JavaScript s'analyse tel quel. C# doit être compilé : CodeQL observe la
compilation pour résoudre les types, et sans cela il ne sait pas que
`db.Produits` est un `DbSet<Produit>` ni que `FromSqlRaw` exécute du SQL.

D'où, dans [le workflow](../.github/workflows/codeql.yml), le `build-mode:
autobuild` et l'installation préalable du SDK .NET. C'est la raison la plus
fréquente de passer de la configuration par défaut à la configuration avancée.

## Faire tourner la démonstration

La base est celle de l'exemple 1 — PostgreSQL replie `Produit` en `produit`, donc
le schéma est commun :

```bash
createdb catalogue && psql catalogue -f ../01-injection-sql-node/schema.sql
ConnectionStrings__Catalogue="Host=localhost;Database=catalogue" dotnet run
```

Sur la branche vulnérable :

```bash
curl "http://localhost:5000/produits?categorie=x' OR '1'='1"
```

La réponse contient la ligne `Licence interne`, catégorie `confidentiel`, que le
filtre était censé exclure.
