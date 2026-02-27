# Gestion de la Charge Cognitive
> **Obligation :** Comment l'agent doit gérer sa compréhension du code.

1. **Choix du Contexte :** Ne scanne pas tout le repo. Détermine la nature de la demande (Frontend, BDD, API) et ouvre UNIQUEMENT le fichier de contexte approprié (`.agent/context/...`)
2. **Auto-évaluation :** Si une modification implique d'autres systèmes, avertis l'utilisateur des impacts avant de le coder.
