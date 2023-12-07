# Configuration

## Variables d'environnement pour la connexion à la base de données :

Créez un fichier `.env` dans le dossier `/back/app` avec le contenu suivant en exemple :

```env
DATABASE_HOST=database
DATABASE_USER=your_databse_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name
```

> `DATABSE_HOST` fait référence au nom du service de la base de donnée. Si vous modifiez le nom du service de la base de données dans le fichier ` docker-compose.yml` pensez à  mettre à jour cette variable.

## Variables d'environnement pour la création du service de la base de données :

Créez un fichier `.env` dans le dossier `/back` avec le contenu suivant en exemple :

```env
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_database_user
MYSQL_PASSWORD=your_database_password
MYSQL_ROOT_PASSWORD=your_database_root_password
```

# Installation

Dans le dossier `back/app` executez la commande suivante pour installer les paquet necessaires :

```
npm install
```

# Démarrage

Pour pouvoir démarrer le projet, executez cette commande depuis le dossier `back` :

```
docker compose up -d
```

# Structure de l'API

L'API est structurée de la manière suivante :

- **`back/`**
    - **`.env`** : Le fichier de configuration pour le Docker Compose, contenant les variables nécessaires au déploiement du service de la base de données avec Docker.
    - **`docker_compose.yml`** : Le fichier de configuration Docker Compose pour orchestrer les conteneurs de l'application et de la base de données.
    - **`app/`**
        - **`Dockerfile`** : Le fichier de configuration pour créer l'image Docker de l'application Node.js.
        - **`package.json`** : Le fichier de configuration npm contenant les dépendances et les scripts.
        - **`src/`** : Ce dossier contient le code source de l'API, organisé en plusieurs sous-dossiers :
            - **`config/`** : Ce dossier contient le fichier de configuration pour la connexion à la base de données. Vous y trouverez également le fichier `.env` pour les variables d'environnement.
            - **`controllers/`** : Contient le contrôleur qui gère la logique métier.
            - **`routes/`** : Contient la définition des routes de l'API et associe les endpoints au contrôleur lié.
            - **`index.js`** : Le point d'entrée de l'application, où le serveur Express est configuré et les routes sont montées.
    - **`database/`** : Ce dossier contient le fichier `init.sql` qui initialise la base de données.

# Utilisation de l'API
L'url de l'api est : [http://localhost:3000](http://localhost:3000)

| Resource           | POST                  | GET                            | PATCH                                    | PUT | DELETE           |
| ------------------ | --------------------- | ------------------------------ | ---------------------------------------- | --- | ---------------- |
| **/products**      | Create a new products | Retrieve all products          | X                                        | X   |     X            |
| **/products/1**    | X                     | Retrieve details for product 1 | Update details of product 1 if it exists | X   | Remove product 1 |

## Base de données

### Table `categories`

La table `categories` contient les catégories disponibles pour les produits. Voici les données initiales :

| id | name        |
|----|-------------|
| 1  | Accessories |
| 2  | Fitness     |
| 3  | Clothing    |
| 4  | Electronics |

### Table `products`

La table `products` stocke les informations sur chaque produit. Elle est liée à la table `categories` via la colonne `category_id`. Voici un aperçu des colonnes de la table `products` :

| Colonne                                             | Description                                                           | Requis |
|---------------------------------------------------- |---------------------------------------------------------------------- | ------ |
| id                                                  | Identifiant unique du produit                                         | Auto   |
| code                                                | Code du produit                                                       | ✅     |
| name                                                | Nom du produit                                                        | ✅     |
| description                                         | Description du produit                                                | ✅     |
| price                                               | Prix du produit (DECIMAL(10, 2))                                      | ✅     |
| quantity                                            | Quantité disponible en stock                                          | ✅     |
| inventory_status                                    | Statut de l'inventaire du produit (ENUM('INSTOCK', 'OUTOFSTOCK'))     | ✅     |
| category_id                                         | ID de la catégorie associée au produit                                | ✅     |
| image                                               | URL de l'image du produit                                             | ❌     |
| rating                                              | Évaluation du produit                                                 | ❌     |
| created_at                                          | Timestamp de création du produit                                      | Auto   |
| updated_at                                          | Timestamp de la dernière mise à jour du produit                       | Auto   |
| FOREIGN KEY (category_id) REFERENCES categories(id) | Clé étrangère liant la colonne `category_id` à la table `categories`. | Auto   |