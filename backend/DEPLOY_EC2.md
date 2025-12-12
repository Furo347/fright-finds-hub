# Déploiement backend sur AWS EC2 (Free Tier)

Ce guide détaille une mise en production simple et gratuite du dossier `backend/` sur une instance EC2 *t2.micro* (Free Tier) avec SQLite local, PM2 pour assurer la disponibilité, et Nginx + Let's Encrypt pour exposer l'API en HTTPS.

## 1. Pré-requis
- Compte AWS (Free Tier actif) et domaine (Route 53 ou autre registrar).
- Clé SSH locale (`.pem`) pour se connecter à EC2.
- Dépôt GitHub hébergeant ce projet.

## 2. Créer l'instance EC2
1. **AMI** : Amazon Linux 2023 (64-bit x86).
2. **Type** : `t2.micro` (1 vCPU, 1 GiB RAM).
3. **Stockage** : 20 Go gp3.
4. **Network/Security Group** :
   - Autoriser `22/tcp` (SSH) uniquement depuis votre IP.
   - Autoriser `80/tcp` et `443/tcp` depuis partout (HTTP/HTTPS).
5. **Elastic IP** : attribuer une IP élastique afin que l'adresse publique reste fixe.

## 3. Préparer l'environnement serveur
```bash
# Mise à jour + outils de base
sudo dnf update -y
sudo dnf install -y git

# Installer Node.js 20 LTS et PM2
type -p node || curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
sudo npm install -g pm2

# Cloner le projet
cd /home/ec2-user
git clone https://github.com/<votre-compte>/fright-finds-hub.git
cd fright-finds-hub/backend
npm ci
```

## 4. Configurer l'application
1. Copier la base SQLite initiale :
   ```bash
   cp test_db.sqlite prod_db.sqlite
   ```
2. Créer `backend/.env` (les fichiers `.env` sont ignorés par Git) :
   ```bash
   cat <<'EOF' > .env
PORT=3000
JWT_SECRET=change-me
ADMIN_USERNAME=admin
ADMIN_PASSWORD=super-secret
FRONTEND_ORIGIN=https://front.example.com
DB_DIALECT=sqlite
DB_STORAGE=/home/ec2-user/fright-finds-hub/backend/prod_db.sqlite
EOF
   ```
3. Vérifier : `npm run build && npm run dev` (Ctrl+C pour arrêter).

## 5. Lancer en service (PM2)
```bash
# Démarrer en mode prod sur le port 3000
pm2 start dist/server.js --name fright-back
pm2 save
# Activer le démarrage automatique
pm2 startup systemd -u ec2-user --hp /home/ec2-user
```

## 6. Installer Nginx + HTTPS (Let's Encrypt)
```bash
sudo dnf install -y nginx
sudo systemctl enable --now nginx

sudo dnf install -y certbot python3-certbot-nginx
sudo tee /etc/nginx/conf.d/fright.conf > /dev/null <<'CONF'
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
CONF
sudo nginx -t && sudo systemctl reload nginx

# Certificat et redirection HTTPS
authenticator=nginx
sudo certbot --nginx -d api.example.com --non-interactive --agree-tos -m admin@example.com --redirect
```
> Remplacer `api.example.com` par votre sous-domaine et pointer son enregistrement DNS vers l'Elastic IP de l'instance.

## 7. Pipeline de déploiement léger (GitHub Actions)
1. Générer une clé SSH dédiée sur votre machine (`ssh-keygen -t ed25519 -f deploy_key`).
2. Copier la clé publique dans `~/.ssh/authorized_keys` sur l'instance.
3. Ajouter la clé privée à `GitHub → Settings → Secrets → Actions → EC2_SSH_KEY`.
4. Ajouter un workflow (racine du repo, `.github/workflows/deploy-backend.yml`) :
```yaml
name: Deploy backend to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Sync backend
        uses: burnett01/rsync-deployments@v8.0.0
        with:
          switches: -avz --delete
          path: backend/
          remote_path: /home/ec2-user/fright-finds-hub/backend/
          remote_host: api.example.com
          remote_user: ec2-user
          remote_key: ${{ secrets.EC2_SSH_KEY }}
      - name: Install deps & restart PM2
        run: |
          ssh -o StrictHostKeyChecking=no ec2-user@api.example.com <<'SSH'
          cd fright-finds-hub/backend
          npm ci --omit=dev
          npm run build
          pm2 restart fright-back || pm2 start dist/server.js --name fright-back
          SSH
```
5. (Optionnel) Ajouter un job de tests avant déploiement (`npm test`).

## 8. Vérifications finales
- `curl https://api.example.com/api/movies` → liste JSON.
- Dans le frontend, remplacer les appels `/api/...` par `https://api.example.com/api/...` ou définir une variable d'environnement Vite (`VITE_API_BASE`).
- Surveiller `pm2 logs fright-back` et `/var/log/nginx/error.log`.

## 9. Maintenance
- Sauvegarder `prod_db.sqlite` régulièrement (`scp` ou `aws s3 cp`).
- Renouvellement certbot auto (`/etc/cron.d/certbot`).
- Mettre à jour l'OS chaque mois (`sudo dnf update`).

Avec cette configuration, l'API tourne 24/7 dans les limites Free Tier. Ajustez les secrets et le domaine selon vos besoins.

