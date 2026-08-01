# Configuration et Exécution du Projet

## Prérequis

- Node.js 20+
- Docker & Docker Compose
- Git

## Exécution Locale (avec Docker)

### 1. Cloner et installer les dépendances

```bash
git clone <repo-url>
cd senegatex-marketplace
npm install
```

### 2. Copier le fichier d'environnement

```bash
cp .env.local.example .env.local
```

### 3. Démarrer les services (PostgreSQL, Redis, Meilisearch)

```bash
npm run docker:up
```

Vérifier que les services sont prêts (5-10 secondes):

```bash
docker-compose logs
```

### 4. Configurer la base de données

```bash
# Lancer les migrations
npm run db:migrate

# Remplir les données de test
npm run db:seed
```

### 5. Démarrer le serveur de développement

```bash
npm run dev
```

Le site sera accessible à: **http://localhost:3000**

### 6. Comptes de test

```
Email: seller@example.com
Mot de passe: Password123

Email: buyer@example.com
Mot de passe: Password123
```

### 7. Services locaux accessibles

| Service | URL | Credentials |
|---------|-----|-------------|
| App | http://localhost:3000 | |
| PostgreSQL | localhost:5432 | user: `test`, pass: `test`, db: `yombal_test` |
| Redis | localhost:6379 | |
| Meilisearch | http://localhost:7700 | Master key: `DebugKey1234567890` |

## Arrêter les services

```bash
npm run docker:down
```

## Voir les logs

```bash
npm run docker:logs
```

## Environnement CI/CD

Les mêmes identifiants PostgreSQL et Redis sont utilisés en CI/CD. Voir `.github/workflows/test.yml` pour les détails.

## Dépannage

### PostgreSQL ne se connecte pas

Vérifiez que le conteneur PostgreSQL est en cours d'exécution:

```bash
docker-compose logs db
```

Les identifiants doivent être:
- User: `test`
- Password: `test`
- Database: `yombal_test`

### Permissions refusées

Si vous obtenez des erreurs de permissions avec Docker:

```bash
# Redémarrer Docker
docker-compose down -v
docker-compose up -d
```

L'option `-v` supprime les volumes (réinitialise la base de données).

## Structure du Projet

- `/src/app` - Next.js App Router
- `/src/components` - Composants React réutilisables
- `/src/lib` - Logique métier et utilitaires
- `/prisma` - Schéma et migrations de base de données
- `docker-compose.yml` - Configuration Docker locale
- `.github/workflows` - Pipelines CI/CD
