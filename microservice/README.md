# Monolith to Microservices at Scale

## Project: Refactor Udagram app into Microservices and Deploy

### Docker Hub Repository
https://hub.docker.com/u/yuriigouveia

### Application Setup
To run the application you need to install Kubernetes and there are several Kubernetes managers (I used [kops](https://github.com/kubernetes/kops/blob/master/docs/aws.md)).

Once you have Kubernetes installed and configured, you can run the script deploy.sh, to deploy the project.

After the application is deployed on Kubernetes you must expose the ports of the application (more detailed [here](https://github.com/yuriigouveia2/cloud-developer/blob/master/microservice/udacity-c2-deployment/kubernetes/README.md))

Observation: EXPOSE REVERSE PROXY TO PORT 8081.

Finally, you can see the application running on:
`http://localhost:8100`
