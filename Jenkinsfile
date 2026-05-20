pipeline {
    agent any

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