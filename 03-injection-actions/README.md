# Exemple 3 — Injection de code dans un workflow GitHub Actions

## Où est le code de cet exemple

Dans [`.github/workflows/tri-des-tickets.yml`](../.github/workflows/), et nulle
part ailleurs : GitHub n'exécute que les workflows placés dans ce dossier. Ce
dossier-ci ne contient donc que l'explication.

C'est déjà une remarque en soi. Les deux premiers exemples vivent dans un
répertoire de projet, celui-ci vit dans la plomberie du dépôt — l'endroit qu'on
ouvre rarement, et qui tourne pourtant avec les secrets du dépôt à portée.

## Les états du code

| Branche | État du workflow | Résultat |
|---------|------------------|----------|
| `main` | Pas de workflow de tri. | Aucune alerte |
| `feat/tri-des-tickets` | Le titre du ticket est écrit directement dans le `run`. | `actions/code-injection/critical`, gravité 9 |
| `fix/variable-environnement` | Le titre passe par une variable d'environnement, lue avec la syntaxe du shell. | Aucune alerte |

La branche vulnérable porte un second fichier, `injection-cinq-ecritures.yml`,
qui relève cinq façons d'écrire la même injection. Les cinq sont exploitables,
deux seulement sont signalées : il faut un bloc `run` multiligne **et** des
apostrophes simples. Chaque étape annonce son résultat en commentaire.

Relevé du 16 septembre 2026. Cinq cas ne font pas une règle, et une version
ultérieure du moteur peut très bien les signaler tous.

## Ce que CodeQL établit

- **Source** : `github.event.issue.title`, le titre d'un ticket — donc une chaîne
  écrite par n'importe quel visiteur du dépôt.
- **Puits** : le script shell de l'étape `run`.

Le mécanisme est celui de la substitution : GitHub remplace l'expression
`${{ ... }}` par sa valeur **avant** que le shell ne lise la ligne. Le titre
n'arrive donc pas au script comme une donnée, il arrive comme du texte de
programme. Un titre bien choisi devient une commande.

## Le faux correctif

Déclarer une variable d'environnement puis écrire `${{ env.TITRE }}` dans le
`run` ne change rien : la substitution a lieu au même moment, au même endroit.
La documentation de la requête CodeQL cite ce cas comme second exemple fautif.

Le correctif réel consiste à lire la variable avec la syntaxe du **shell**,
`$TITRE`, de sorte que la valeur n'existe jamais dans le texte du script.
