module.exports = {
  apps: [
    {
      name: 'architecture-happiness',
      script: 'npm',
      args: 'start',
      cwd: '/home/me/code/happiness',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
    },
  ],
}
