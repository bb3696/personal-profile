pipeline {
  agent any

  environment {
    // 可选：启用本地 npm 缓存，加速构建
    NPM_CONFIG_CACHE = "${WORKSPACE}/.npm-cache"
    APP_NAME = "personal-profile"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git log -1 --pretty=oneline'
      }
    }

    stage('Build') {
      steps {
        sh 'npm ci --prefer-offline'
        sh 'npm run build'
      }
      post {
        success {
          // 直接归档 dist/（方便快速查看文件）
          archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
        }
      }
    }

    stage('Test') {
      steps {
        sh 'npm test --if-present -- --ci'
      }
    }

    stage('Package') {
      steps {
        script {
          // 生成版本信息：时间戳 + 短提交号
          def ts = sh(script: "date +%Y%m%d-%H%M%S", returnStdout: true).trim()
          def sha = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()

          sh '''
            set -e
            rm -rf artifacts && mkdir -p artifacts
          '''

          // 打包 dist 为 zip
          sh """
            zip -r artifacts/${APP_NAME}-${ts}-${sha}.zip dist > /dev/null
            ls -alh artifacts
          """

          // 生成 SHA256 校验值（可选）
          sh """
            cd artifacts
            shasum -a 256 ${APP_NAME}-${ts}-${sha}.zip > ${APP_NAME}-${ts}-${sha}.zip.sha256
            cd -
          """
        }
      }
      post {
        success {
          // 归档 zip + 校验文件（下载/回滚更方便）
          archiveArtifacts artifacts: 'artifacts/*', fingerprint: true
        }
      }
    }

    stage('Deploy') {
      steps {
        // 目前只是占位：列出打包产物。准备好后可替换成 S3/CloudFront 部署
        sh 'ls -alh artifacts'
      }
    }
  }
}
