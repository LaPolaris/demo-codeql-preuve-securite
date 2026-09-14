# Prouver un développement sécurisé avec CodeQL — exemples

Dépôt compagnon de l'article [Prouver un développement sécurisé avec CodeQL](https://lapolaris.fr/blog/prouver-dev-securise-codeql).

Chaque exemple de l'article est ici sous forme de **code qui tourne réellement** et
d'une **alerte CodeQL réellement produite** par GitHub, pas d'une capture d'écran
reconstituée.

## Où regarder : la preuve est dans les pull requests

C'est le point contre-intuitif de ce dépôt, et il mérite une explication.

Les alertes de code scanning listées dans l'onglet **Security** d'un dépôt exigent
la permission **Write**, même sur un dépôt public. Un lecteur qui arrive de
l'article n'y a donc pas accès.

En revanche, **les alertes affichées sur une pull request sont visibles en
permission Read** — donc par tout le monde sur un dépôt public.

D'où l'organisation retenue :

- `main` contient toujours l'état **sain** du code ;
- une pull request **laissée ouverte en permanence** introduit la vulnérabilité :
  l'annotation CodeQL y reste visible indéfiniment, avec la règle, la gravité et
  le chemin de données ;
- une seconde pull request applique le correctif et repasse le contrôle au vert.

| # | Exemple | Vulnérabilité | Règle CodeQL | PR qui déclenche l'alerte | PR qui corrige |
|---|---------|---------------|--------------|---------------------------|----------------|
| 1 | [Express + PostgreSQL](01-injection-sql-node/) | Injection SQL | `js/sql-injection` | _(à compléter)_ | _(à compléter)_ |
| 2 | .NET 8 + EF Core | Injection SQL | `cs/sql-injection` | _(à venir)_ | _(à venir)_ |
| 3 | GitHub Actions | Injection de code | `actions/code-injection/critical` | _(à venir)_ | _(à venir)_ |

## Vérifier par vous-même

La preuve n'a d'intérêt que si elle est reproductible. Deux façons :

**Forker ce dépôt.** Vous devenez administrateur de votre fork, donc vous obtenez
l'onglet Security. Activez le code scanning (`Settings` → `Advanced Security` →
`Code scanning`), le workflow [`.github/workflows/codeql.yml`](.github/workflows/codeql.yml)
est déjà là. Rejouez ensuite les branches de démonstration.

**En local, avec le CLI CodeQL.** Sans passer par GitHub :

```bash
codeql database create codeql-db --language=javascript-typescript --source-root=01-injection-sql-node
codeql database analyze codeql-db \
  --format=sarif-latest --output=resultats.sarif \
  codeql/javascript-queries:codeql-suites/javascript-security-extended.qls
```

Les fichiers SARIF produits par les analyses de ce dépôt sont archivés dans
[`preuves/`](preuves/) : c'est le format brut, lisible sans aucune permission,
qui contient le chemin de données complet (`codeFlows`).

## Ce que ce dépôt n'est pas

Un catalogue de bonnes pratiques. Le code y est volontairement réduit au strict
minimum pour que le chemin source → puits tienne en quinze lignes et reste lisible
dans l'article. Une vraie API aurait une couche d'accès aux données, de la
validation d'entrée et des tests.
