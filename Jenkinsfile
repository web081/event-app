pipeline {
    agent any

    environment {
        NODE_VERSION = '20' // Set used node version for the app
        AWS_REGION = 'us-east-1' // AWS region
        AWS_ACCOUNT_ID = '<your-aws-account-id>' //  AWS Account ID
        ECR_REPOSITORY = '<your-ecr-repo>' // AWS ECR repository
        IMAGE_TAG = "${GIT_COMMIT}" // Git commit hash as image tag
        EKS_CLUSTER_NAME = 'invite-secure-eks-cluster' // EKS cluster name
        KUBE_CONFIG_PATH = "${HOME}/.kube/config" // Path to kubeconfig
        DOCKER_COMPOSE_PATH = 'docker-compose.yml' // Path to Docker Compose file
        SCANNER_HOME = tool 'sonar-scanner' // SonarQube Scanner tools path
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Git Checkout') {
            steps {
                script {
                    echo 'Checking out code from Git repository...'
                    git branch 'main', url: 'https://github.com/web081/event-app.git'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing backend and frontend dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building React frontend...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests for backend and frontend...'
                dir('backend') {
                    sh 'npm test'
                }
                dir('frontend') {
                    sh 'npm test'
                }
            }
        }

        stage('Sonar Analysis') {
            steps {
                echo 'Running SonarQube analysis...'
                withSonarQubeEnv('sonar-server') {
                    sh '''
                    $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=Event-App \
                        -Dsonar.projectKey=Event-App \
                        -Dsonar.sources=./backend,./frontend \
                        -Dsonar.javascript.lcov.reportPaths=frontend/coverage/lcov.info \
                        -Dsonar.exclusions=node_modules/**,dist/**,build/**
                    '''
                }
            }
        }

        stage('Trivy Fs Scan') {
            steps {
                echo 'Scanning the project directory for vulnerabilities...'
                sh '''
                trivy fs --format table -o fs.html .
                '''
                echo 'Trivy scan completed. Report generated as fs.html.'
            }
        }

        stage('Docker Compose Build') {
            steps {
                echo 'Building and starting services with Docker Compose...'
                sh '''
                docker-compose down || true  # Clean up any previous containers before building
                docker-compose up --build -d
                '''
            }
        }

        stage('Trivy Scan Docker Images') {
            steps {
                echo 'Scanning Docker images for vulnerabilities...'
                script {
                    def images = [
                        "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:frontend-${IMAGE_TAG}",
                        "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:backend-${IMAGE_TAG}"
                    ]
                    images.each { image ->
                        echo "Scanning image: ${image}"
                        sh """
                        trivy image --format table --output trivy-${image.replaceAll(':', '-')}.html ${image}
                        """
                    }
                }
            }
        }

        stage('Login to AWS ECR') {
            steps {
                script {
                    echo 'Logging in to AWS ECR...'
                    withCredentials([usernamePassword(credentialsId: 'aws-credentials-id', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                        sh '''
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        '''
                    }
                }
            }
        }

        stage('Tag and Push Docker Images to ECR') {
            steps {
                script {
                    echo 'Tagging Docker images for ECR...'
                    sh '''
                        docker tag frontend:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:frontend-${IMAGE_TAG}
                        docker tag backend:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:backend-${IMAGE_TAG}
                    '''

                    echo 'Pushing Docker images to AWS ECR...'
                    sh '''
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:frontend-${IMAGE_TAG}
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:backend-${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Update Kubernetes Deployment') {
            steps {
                script {
                    echo 'Setting up kubectl to use the EKS cluster...'
                    withCredentials([awsCredentials(credentialsId: 'aws-credentials-id')]) {
                        sh '''
                            aws eks --region ${AWS_REGION} update-kubeconfig --name ${EKS_CLUSTER_NAME}
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo 'Deploying app to EKS cluster...'
                    withCredentials([awsCredentials(credentialsId: 'aws-credentials-id')]) {
                        dir('kubernetes-manifest') {
                            sh 'kubectl apply -f backend-deploy.yaml'
                            sh 'kubectl apply -f frontend-deploy.yaml'
                            sh 'kubectl apply -f nginx-deploy.yaml'
                            sh 'kubectl apply -f backend-service.yaml'
                            sh 'kubectl apply -f frontend-service.yaml'
                            sh 'kubectl apply -f nginx-service.yaml'
                            sh 'kubectl apply -f nginx-configMap.yaml'
                            sh 'kubectl apply -f hpa-backend.yaml'
                            sh 'kubectl apply -f hpa-frontend.yaml'
                            sh 'kubectl apply -f network-policy-backend.yaml'
                            sh 'kubectl apply -f network-policy-frontend.yaml'
                            sh 'kubectl apply -f pom-deploy.yaml'
                            sh 'kubectl apply -f grafana-deployment.yaml'
                            sh 'kubectl apply -f fluent-deploy.yaml'
                        }
                    }
                }
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                script {
                    echo 'Verifying pods and services in Kubernetes...'
                    withCredentials([awsCredentials(credentialsId: 'aws-credentials-id')]) {
                        sh 'kubectl get po'
                        sh 'kubectl get svc'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
