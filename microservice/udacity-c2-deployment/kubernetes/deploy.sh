  
#!/bin/bash
kubectl apply -f aws-secret.yml
kubectl apply -f env-configmap.yml 
kubectl apply -f env-secret.yml
# kubectl create -f aws-secret.yml 
# kubectl create -f env-configmap.yml 
# kubectl create -f env-secret.yml

kubectl apply -f backend-feed-service.yml 
kubectl apply -f backend-user-service.yml 
kubectl apply -f frontend-service.yml 
kubectl apply -f reverseproxy-service.yml

kubectl apply -f backend-feed-deployment.yml 
kubectl apply -f backend-user-deployment.yml 
kubectl apply -f frontend-deployment.yml 
kubectl apply -f reverseproxy-deployment.yml