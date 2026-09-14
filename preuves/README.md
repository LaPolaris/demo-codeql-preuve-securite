# Preuves brutes

Ce dossier archive les fichiers SARIF produits par les analyses CodeQL de ce
dépôt, tels que téléchargés depuis les artefacts des exécutions GitHub Actions.

Le SARIF est le format d'échange normalisé (OASIS) des résultats d'analyse
statique. Il se lit sans aucune permission sur le dépôt, contrairement à l'onglet
Security, et contient pour chaque alerte :

- la règle déclenchée (`ruleId`, par exemple `js/sql-injection`) et ses métadonnées
  (gravité CVSS, précision, références CWE) ;
- l'emplacement exact du problème (`locations`) ;
- **le chemin de données complet** (`codeFlows`) : chaque étape entre la source et
  le puits, c'est-à-dire le raisonnement du moteur, pas seulement sa conclusion.

C'est ce dernier point qui fait du SARIF une pièce vérifiable plutôt qu'une
affirmation : un auditeur peut refaire le chemin à la main.

Les fichiers sont ajoutés ici après la première exécution de chaque exemple.
