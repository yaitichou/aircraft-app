# Projet de déploiement d'API


L'objectif de ce projet est le déploiement d'une application de détection d'avion. Lors de la conception, il a été décidé d'utiliser une architecture de type microservice. Le schéma explicatif suivant détaille dans les grandes lignes son organisation.

![Microservices](/graphics/architecture_microservice.png)

Le point d'entrée de toutes les requêtes est une API. Son rôle est de rediriger les requêtes vers le microservice adéquat. Ici, nous ne retrouvons qu'un seul microservice, mais dans une situation réelle cette application pourrait être amenée à en intégrer d'autres (identification, sauvegarde en base de données ...). Cette architecture est modulaire et permet une décomposition de l'application et accélère le développement. Pour s'assurer de respecter les contraintes de sécurité, 

Chaque composant indépendant de cette architecture est encapsulé dans un conteneur docker, comprenant l'ensemble de l'environnement d'exécution et pouvant être déployé facilement.

Pour obtenir ce repository sur votre machine locale, lancez la commande git dans un terminal :

```
git clone https://github.com/yaitichou/aircraft-app.git
```

## Conteneurs

1. [Interface front](#interface-front)
2. [API Gateway](#api-gateway)
3. [MsDetection](#msdetection)
4. [MsDataBase](#msdatabase)

Lors de l'utilisation des conteneurs, veillez à lancer tous les conteneurs pour que l'application fonctionne.

### Interface front

L'interface de l'outil de détection est simple. Pour exporter une image, il suffit de déposer un fichier dans la zone prévu à cet effet.

![Microservices](/graphics/front.png)

Pour lancer ce microservice, ouvrez le répertoire `./aircraft-detector` dans un terminal, puis lancer la commande suivante pour générer une image de l'interface :

```
docker build -t front:v1.0.0 .
```

Puis, pour générer un conteneur, lancez la commande :

```
docker run -p 4200:80 -d front:v1.0.0
```

Vous pouvez maintenant accéder à l'interface rentrant dans un navigateur l'url :
```
http://localhost:4200/
```


### API gateway

Pour lancer l'API, il est possible de lancer un conteneur docker. Cependant, du a un manque de temps pour la configuration du conteneur, l'api ainsi déployer ne peut accéder au microservice de détection. Si vous souhaitez tout de même lancer le conteneur, ouvrez un terminal dans le dossier `./rest-api`. Lancez ensuite la commande suivante :

```
docker build -t apigateway:v1.0.0 .
```
Puis pour générer et lancer le conteneur, lancez :
```
docker run -p 8080:8080 -d apigateway:v1.0.0
```
Le conteneur est ainsi lancé et est accessible aux requêtes au port 8080.

**NB :** En l'état actuel, l'api n'est pas fonctionnelle. Le format de la requête de l'API vers le microservice de détection d'avion n'est pas au bon format. Nous avons donc remplacer le résultat par fourni par l'API suite à une requête POST par une réponse générique.



### MsDetection

L'image docker du microservice de détection est disponible [ici](https://data-technical-interview.s3.fr-par.scw.cloud/aircraftdetector.tar). Cependant, cette image n'est pas opérationnelle. N'ayant pas accès au code, nous verrons comment rectifier le tir. Pour générer un conteneur comprenant le microservice, assurer vous d'avoir bien [installé docker](https://docs.docker.com/get-docker/). Depuis un terminal, lancez la commande suivante dans le répertoire où se situe l'image compressée :

```
docker load --input aircraftdetector.tar
```

Une fois cette opération effectuée, listez l'ensemble des images docker et récupérer l'id de celle que vous venez de générer :

```
docker image list
```

Vous pouvez maintenant générer le conteneur docker associé. Rectifions le contenu érroné de l'image générée. Lancez dans un terminal :
```
docker run -it --name aircraft_detector_repair --entrypoint sleep  <id-image> infinity
```
Cette commande permet de générer un conteneur en interrompant son exécution. Le terminal devrait être figé. Dans une autre fenêtre, exécutez les commandes suivantes :
```
docker container list
docker exec -it <id-conteneur> bash
```
Vous arrivez sur le terminal du conteneur.
```
pip install --upgrade pip
pip uninstall -r requirements.txt
apt-get install nano
nano requirements.txt
```
Sur le terminal, modifiez le fichier avoir les versions de dépendances suivantes :
```
numpy==1.23.4
pandas==1.3.5
```
Installez les dépendances modifiées :
```
pip install -r requirements.txt
```
Quittez le terminal du conteneur :
```
exit
```

Générez une nouvelle image à partir des modifications effectuées : 
```
docker commit aircraft_detector_repair aircraft_detector_new_image
```
**NB :** Actuellement, l'image générée comprend toujours l'instruction `sleep infinite`. Pour contourner le problème nous allons récupérer l'image générée précédemment et créer une nouvelle image avec quelques commandes supplémentaires. Dans un fichier `start_up.sh` vierge, entrez les lignes suivantes :
```
#!/bin/sh
uvicorn worker:app --host 0.0.0.0 --port 80
```
Puis, créez un nouveau Dockerfile :
```
FROM aircraft_detector_new_image
COPY start.sh /start.sh
RUN chmod +x /start.sh
ENTRYPOINT ["/start.sh"]
```


Dans le répertoire où se trouve ces deux fichiers, lancez les commandes :
```
chmod +x start.sh
docker build -t aircraft_detector_repaired .
docker run -p 8000:80 aircraft_detector_repaired
```

Pour avoir envoyer les requêtes, veillez à les diriger à l'adresse :
```
http://localhost:8000/
```

### MsDataBase

Ce microservice n'a pas encore été réalisé par manque de temps, mais dans l'idéal, l'intuition doit être la suivante. Ce microservice se chargera de la persistance des données. Chaque sauvegarde de résultat de détection en base de données comprendra 3 informations :
- `id_image`, l'id de l'image permettant d'indexer le résultat en base de données.
- `path_to_image`, le chemin vers l'image (les images complètes sont trop gourmandes en indexation pour les bases de données). Un champ supplémentaire pourra être utilisé pour stocker l'adresse de la machine sur laquelle est stockée l'image si nécessaire. 
- `plane_model`, le résultat de la détection.
