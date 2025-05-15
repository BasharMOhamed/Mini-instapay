# Set variables
$dockerHubUsername = "sohilametwaly"
$dockerHubPassword = ",8J#uX72JzqugQa"
$projectPath = "D:\Projects\Mini-instapay"

# Docker Hub login
Write-Host "Logging in to Docker Hub..."
docker login -u $dockerHubUsername -p $dockerHubPassword
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker login failed. Please check your credentials." -ForegroundColor Red
    exit 1
}

# Build and push Docker images
Write-Host "Building and pushing Docker images..."

docker build -t $dockerHubUsername/user-service "$projectPath\services\user-service"
docker push $dockerHubUsername/user-service

docker build -t $dockerHubUsername/transaction-service "$projectPath\services\transaction-service"
docker push $dockerHubUsername/transaction-service

docker build -t $dockerHubUsername/notification-service "$projectPath\services\notification-service"
docker push $dockerHubUsername/notification-service

docker build -t $dockerHubUsername/client "$projectPath\client"
docker push $dockerHubUsername/client

Write-Host "Docker images built and pushed successfully."

# Apply Kubernetes manifests
Write-Host "Applying Kubernetes manifests..."

kubectl apply -f "$projectPath\services\user-service\user-secrets.yaml"
kubectl apply -f "$projectPath\services\user-service\user-deployment.yaml"
kubectl apply -f "$projectPath\services\user-service\user-service.yaml"

kubectl apply -f "$projectPath\services\transaction-service\transaction-secrets.yaml"
kubectl apply -f "$projectPath\services\transaction-service\transaction-deployment.yaml"
kubectl apply -f "$projectPath\services\transaction-service\transaction-service.yaml"

kubectl apply -f "$projectPath\services\notification-service\notification-secrets.yaml"
kubectl apply -f "$projectPath\services\notification-service\notification-deployment.yaml"
kubectl apply -f "$projectPath\services\notification-service\notification-service.yaml"

kubectl apply -f "$projectPath\client\client-deployment.yaml"
kubectl apply -f "$projectPath\client\client-service.yaml"

Write-Host "Kubernetes manifests applied successfully."

# Verify deployment
Write-Host "Verifying deployment..."
kubectl get pods
kubectl get services

Write-Host "Deployment complete. Check the services for external IPs to access your application."