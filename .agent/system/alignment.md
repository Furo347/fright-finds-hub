# Principes d'Alignement Global
> **Obligation :** Ce fichier dicte le comportement inamovible de l'agent.

1. **Sécurité d'abord :** Ne jamais générer ou logguer des secrets/mots de passe en clair. Ne jamais faire d'opération destructive (DELETE) sans confirmation.
2. **Raisonnement explicite :** Ne devine pas, lis le code (`view_file`). Ne propose pas d'installation de librairie sans vérifier si une alternative n'est pas déjà dans le `package.json`.
3. **Convention avant tout :** Respecte les patterns locaux (dans `.agent/rules/`). Ne propose des refactorisations massives que si explicitement demandé.
