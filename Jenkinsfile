pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        // 安装依赖
        sh 'npm ci'
        // 构建产物（Vite -> dist）
        sh 'npm run build'
      }
    }

    stage('Test') {
      steps {
        // 如果有测试脚本就跑，没有就跳过
        sh 'npm test --if-present'
      }
    }

    stage('Deploy') {
      steps {
        // 这里只是示范，把构建目录列出来
        // 未来可以替换成 aws s3 sync 等命令
        sh 'ls -alh dist'
      }
    }
  }
}
