# Interface front

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
