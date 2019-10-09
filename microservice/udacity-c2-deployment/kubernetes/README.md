# Configuration

## Commands to run the pods

To run a single pod, you need to use the port forward command below:
```
kubectl port-forward pod/frontend-7b4cb8d4c-tqjwl 8100:8100
```

The best way is to use a service to kubernetes automatically redirect the access to some of the pods
of the application. To do this, you need to run the command below:
```
kubectl port-forward service/frontend 8100:8100
```

To scale a deployment, you need to use the command below:
```
kubectl scale deployment/frontend --replicas=10
```


## AWS-Secret

For aws-secret you need to encode your aws credentials to base64, using the javascript command
(just examplifying):

```
btoa('[default]\naws_access_key_id = AKIAF35W33LPNFJ3XSE2\naws_secret_access_key = sJGHPBCl4/s4zUWBKRy3angNRMKEwmL0KRC/xNmO')
```
