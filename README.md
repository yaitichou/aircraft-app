# Projet de déploiement d'API


L'objectif de ce projet est le déploiement d'une application de détection d'avion. Lors de la conception, il a été décidé d'utiliser une architecture de type microservice. Le schéma explicatif suivant détaille dans les grandes lignes son organisation.

![Microservices](/graphics/architecture_microservice.png)

Le point d'entrée de toutes les requêtes est une API de redirection. Son rôle est de rediriger les requêtes vers le microservice adéquat. Ici, nous ne retrouvons que deux microservices, mais dans une situation réelle cette application pourrait être amenée à en intégrer d'autres (authentification via keycloak, sauvegarde en base de données ...). Cette architecture est modulaire, permet une décomposition de l'application et accélère le développement.

Chaque composant indépendant de cette architecture est encapsulé dans un conteneur docker, comprenant l'ensemble de l'environnement d'exécution et pouvant être déployé facilement.

Pour obtenir ce repo sur votre machine locale, lancez la commande git dans un terminal :

```bash 
git clone https://github.com/yaitichou/aircraft-app.git
```

Le lancement de l'application peut être réalisé en effectuant dans un terminal les commandes suivantes, sous le répertoire racine du projet où se situe le fichier `compose.yaml` :

```bash 
docker-compose build
docker-compose up
```

Pour utiliser l'application, veillez à attendre quelques instants après le lancement de ces deux commandes.
Le service de redirection des requêtes nginx ne se déploie que lorsque les autres services sont eux même près à être utilisés. Le message suivant sur le terminal annonce le moment où vous pourrez accéder à l'application :

```
aircraft-app-nginx-1  | /docker-entrypoint.sh: Configuration complete; ready for start up
```
 
 
L'accès à l'application peut être réalisé via un navigateur à l'adresse suivante :

```bash 
http://localhost:4200/
```


## Conteneurs

Les 6 conteneurs suivants sont utilisés lors du lancement de l'application :
1. Nginx
2. Frontend
3. API Gateway
4. Ms-detection
5. Ms-storage
6. Elasticsearch

Pour la plupart des microservices, un Dockerfile détaillant les instructions de déploiement est exécuté. Ils sont disponibles à la racine de leurs répertoires respectifs.

### Nginx

Il s'agit du conteneur de redirection des requêtes entrantes. Son rôle principal est donc de servir de proxy. Le fichier de configuration associé est disponible sous le répertoire du même nom.


### Frontend

![Front](/graphics/front.png)

L'interface web comprends une zone de téléchargement où déposer une image, et une zone de résultat et de visualisation de l'image. Cette application a été développé dans un environnement Angular - Node.js.


### API Gateway

L'api Gateway sert de passerelle aux requêtes entrantes dans le backend. Elle se charge également de redimensionner les images transmises pour détection : le modèle de deep learning utilisé par le service Ms-detection ne prend en entrée que des images de carrée (ratio hauteur:largeur de 1:1). Cette api est implémentée en Python via l'abstraction de la librairie FastAPI.

### Ms-storage

Ce microservice a deux fonctions principales. La première est la sauvegarde des images traitées sur le serveur local dédié. La seconde est la sauvegarde des résultats de la détection via l'outil dédié elasticsearch, situé dans un conteneur séparé. Le résultat est indexé en base de données sous le format suivant :

```json
{
   "result":[
      {
         "xmin":"float",
         "ymin":"float",
         "xmax":"float",
         "ymax":"float",
         "confidence":"float",
         "name":"str",
         "_class":"int"
      },
    ...
   ],
   "path":"str"
}
```

Comme indiqué, seul le chemin au fichier est conservé en base de données pour accélérer l'écriture de données. Cette api est implémentée en Python via l'abstraction de la librairie FastAPI.

### Volumes de données

Les conteneurs Elasticsearch et Ms-storage accèdent tous deux à des volumes de données pour persister les éléments à sauvegarder en mémoire. Ces volumes sont conservés lors de l'arrêt de l'application. 
