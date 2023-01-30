# GeTick
a Microservices app to sell and buy tickets online

To better understanding of events flow and how it works with different services please check the diagrams folder 

#Design 
![Screenshot (14)](https://user-images.githubusercontent.com/45404933/215602413-158704b5-56a3-4f0c-925b-b740a5ca5fe8.png)

#Build 
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
