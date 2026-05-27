pipeline {
    agent any

    environment {
        FRONTEND_PORT = '3002'
        PROMETHEUS_PORT = '9091'
        BACKEND_PORT = '5000'
        GRAFANA_PORT = '3001'
    }

    stages {

        stage('Install dependencies') {
            parallel {

                stage('Frontend dependencies') {
                    steps {
                        dir('frontend') {
                            bat 'npm install'
                        }
                    }
                }

                stage('Backend dependencies') {
                    steps {
                        dir('backend') {
                            bat 'npm install'
                        }
                    }
                }
            }
        }

        stage('Build frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Run backend tests') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker build -t cloudshield-frontend:latest ./frontend'
                bat 'docker build -t cloudshield-backend:latest ./backend'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl rollout restart deployment cloudshield-backend -n cloudshield'
                bat 'kubectl rollout restart deployment cloudshield-frontend -n cloudshield'
            }
        }

        stage('Show running containers') {
            steps {
                bat 'docker ps'
            }
        }
    }

    post {

        success {
            echo 'CloudShield CI/CD + Kubernetes pipeline completed successfully.'
        }

        failure {
            echo 'CloudShield pipeline failed. Check Jenkins logs.'
        }

        always {
            echo 'Pipeline finished.'
        }
    }
}