# Projet de déploiement d'API


L'objectif de ce projet est le déploiement d'une application de détection d'avion. Lors de la conception, il a été décidé d'utiliser une architecture de type microservice. Le schéma explicatif suivant détaille dans les grandes lignes son organisation.

![Microservices](/graphics/architecture_microservice.png)

Le point d'entrée de toutes les requêtes est une API de redirection. Son rôle est de rediriger les requêtes vers le microservice adéquat. Ici, nous ne retrouvons deux microservices, mais dans une situation réelle cette application pourrait être amenée à en intégrer d'autres (identification, sauvegarde en base de données ...). Cette architecture est modulaire, permet une décomposition de l'application et accélère le développement.

Afin de 


Chaque composant indépendant de cette architecture est encapsulé dans un conteneur docker, comprenant l'ensemble de l'environnement d'exécution et pouvant être déployé facilement.

Pour obtenir ce repository sur votre machine locale, lancez la commande git dans un terminal :

```bash 
git clone https://github.com/yaitichou/aircraft-app.git
```

Le lancement de l'application peut être réaliser en effectuant dans un terminal, dans le répertoire racine du projet, les commandes suivantes :

```bash 
docker-compose build
docker-compose up
```

Pour utiliser l'application, veillez à attendre quelques instants après le lancement de ces deux commandes. Le service de redirection des requêtes nginx ne se déploie que lorsque les autres services sont eux même près à être utilisés. L'accès à l'application peut être réalisé via un navigateur à l'adresse suivante :

```bash 
http://localhost:4200/
```

## Conteneurs

1. Interface front
2. API Gateway
3. Ms-detection
4. Ms-storage
4. Elasticsearch

Pour la plupart des microservices, un Dockerfile détaillant les instructions de déploiement est exécuté. Ils sont disponibles dans leurs répertoires respectifs. 




### Ms-storage

Ce microservice a deux fonctions principales. La première est la sauvegarde des images traitées sur le serveur local dédié. La seconde est la sauvegarde des résultats de la détection via l'outil dédié elasticsearch, situé dans un conteneur séparé. Le résultat est indexé en base de données sous le format suivant.

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

Comme indiqué, seul le chemin au fichier est conservé en base de données pour accélérer l'écriture de données.