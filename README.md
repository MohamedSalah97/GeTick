# GeTick
a Microservices app to sell and buy tickets online

**To better understanding of events flow and how it works with different services please check the diagrams folder**

# Design 

![Screenshot (14)](https://user-images.githubusercontent.com/45404933/215605400-61883106-30bf-411c-b431-57483dfc02f4.png)

![Screenshot (13)](https://user-images.githubusercontent.com/45404933/215606185-57fa2b3d-835f-4825-a563-16330b826467.png)


# Build 

1- For every service build the Docker image
```
docker build -t <yourDockerId>/<imageName> .
```
2- Then push them to DockerHub
```
docker push <yourDockerId>/<imageName>
```
3- Update image name in Kubernetes deployment files and add Kubernetes Secretes 
```
kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf
kubectl create secret generic stripe-secrete --from-literal STRIPE_KEY=<stripeSecreteKey>
```
4- Install Ingress-Nginx
5- Install Skaffold, Update image name in skaffold.yaml file and run
```
skaffold dev
```
