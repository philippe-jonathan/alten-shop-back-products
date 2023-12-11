# Configuration

## Variables d'environnement pour la connexion à la base de données :

Créez un fichier `.env` dans le dossier `/back/app/src/config` avec le contenu suivant en exemple :

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

Si vous rencontrez une erreur semblable à celle-ci sur le service `api` : 
```
Error connecting to the database : Error: connect ECONNREFUSED 172.19.0.2:3306
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1595:16) {
  errno: -111,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '172.19.0.2',
  port: 3306,
  fatal: true
}
```

Cette erreur se produit car le service `api` tente de se connecter à la base de données (service `database`) alors que celle-ci n'est pas encore prête à recevoir une connexion.

Deux solutions sont possibles ('*' recommandé) : 

> Essayer de relancer uniquement le service `api` sur docker.

> '*' Ajuster les valeur de `interval`, `timeout` et `retries` dans le paramètre `healthcheck` du service `database` dans le fichier `docker-compose.yml`. Cela permettra d'accordé plus de temps avant que le service `api` tente de s'y connecter.

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
    - **`alten-shop.postman_collection.json`** : Collection Postman contenant les requêtes prédéfinies pour tester et interagir avec l'API.

# Utilisation de l'API
L'url de l'api est : [http://localhost:3000](http://localhost:3000)

| Resource           | POST                  | GET                            | PATCH                                    | PUT | DELETE           |
| ------------------ | --------------------- | ------------------------------ | ---------------------------------------- | --- | ---------------- |
| **/products**      | Create a new products | Retrieve all products          | X                                        | X   |     X            |
| **/products/1**    | X                     | Retrieve details for product 1 | Update details of product 1 if it exists | X   | Remove product 1 |

Vous trouverez également une collection postamn `alten-shop.postman_collection.json` dans le dossier `back`.

## Base de données

La table `products` stocke les informations sur chaque produit. Voici un aperçu des colonnes de la table `products` :

| Colonne                                             | Description                                                                     | Requis |
|---------------------------------------------------- |-------------------------------------------------------------------------------- | ------ |
| id                                                  | Identifiant unique du produit                                                   | Auto   |
| code                                                | Code du produit                                                                 | ✅     |
| name                                                | Nom du produit                                                                  | ✅     |
| description                                         | Description du produit                                                          | ✅     |
| price                                               | Prix du produit (DECIMAL(10, 2))                                                | ✅     |
| quantity                                            | Quantité disponible en stock                                                    | ✅     |
| inventoryStatus                                     | Statut de l'inventaire du produit (ENUM('INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'))   | ✅     |
| category                                            | Category du produit (ENUM('Accessories', 'Clothing', 'Electronics', 'Fitness')) | ✅     |
| image                                               | URL de l'image du produit                                                       | ❌     |
| rating                                              | Évaluation du produit                                                           | ❌     |
| created_at                                          | Timestamp de création du produit                                                | Auto   |
| updated_at                                          | Timestamp de la dernière mise à jour du produit                                 | Auto   |

## Problème rencontré avec le **front** tel qu'il est fourni

Lors de l'ajout d'un produit, pour les champs `invetoryStatus` et `category` il faut bien cliquer sur une valeur sinon la valeur n'est pas transmise au back. Par exemple, si je souhaite ajouter un produit avec la catégorie `Accessories` je dois cliquer sur le champ pour sélectionné une autre catégorie, puis re-sélectionné `Accessories` pour que la valeur soit transmise. Il faut faire la même manipulation avec le champ `inventory Status`.

Il faut également ne plus avoir le focus sur un des champs. Par exemple, si je garde le focus sur le dernier champ `quantity`, la valeur n'est pas transmise.