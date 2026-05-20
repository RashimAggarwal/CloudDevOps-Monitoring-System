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

        stage('Build Docker images') {
            steps {
                bat 'docker build -t cloudshield-frontend ./frontend'
                bat 'docker build -t cloudshield-backend ./backend'
            }
        }

        stage('Clean old containers') {
            steps {

                bat 'docker rm -f cloudshield-backend || exit 0'
                bat 'docker rm -f cloudshield-frontend || exit 0'
                bat 'docker rm -f cloudshield-grafana || exit 0'
                bat 'docker rm -f cloudshield-prometheus || exit 0'

            }
        }

        stage('Deploy using Docker Compose') {
            steps {

                bat 'docker compose down --remove-orphans'

                bat 'docker compose up -d --build'

                echo "CloudShield frontend is available at http://localhost:${FRONTEND_PORT}"
                echo "CloudShield backend is available at http://localhost:${BACKEND_PORT}"
                echo "Prometheus is available at http://localhost:${PROMETHEUS_PORT}"
                echo "Grafana is available at http://localhost:${GRAFANA_PORT}"

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
            echo 'CloudShield CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CloudShield CI/CD pipeline failed. Check Jenkins logs.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
