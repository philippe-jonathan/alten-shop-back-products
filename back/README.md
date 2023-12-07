# Configuration

## Variables d'environnement pour la connexion à la base de données :

Créez un fichier `.env` dans le dossier `/back/app` avec le contenu suivant en exemple :

```env
DATABASE_HOST=database
DATABASE_USER=your_databse_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name
```

> `DATABSE_HOST` fait référence au nom du service de la base de donnée. Si vous modifiez le nom du service de la base de données dans le fichier ` docker-compose.yml` veillez à  mettre à jour cette variable.

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

# Utilisation de l'API
L'url de l'api est : [http://localhost:3000](http://localhost:3000)

| Resource           | POST                  | GET                            | PATCH                                    | PUT | DELETE           |
| ------------------ | --------------------- | ------------------------------ | ---------------------------------------- | --- | ---------------- |
| **/products**      | Create a new products | Retrieve all products          | X                                        | X   |     X            |
| **/products/1**    | X                     | Retrieve details for product 1 | Update details of product 1 if it exists | X   | Remove product 1 |
