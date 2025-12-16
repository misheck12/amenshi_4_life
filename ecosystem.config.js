module.exports = {
  apps: [
    {
      name: 'amenshi4life-server',
      script: './server.js',
      cwd: './server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Restart strategy
      min_uptime: '10s',
      max_restarts: 10,
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      // Health monitoring
      instance_var: 'INSTANCE_ID',
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-vm-host',
      ref: 'origin/main',
      repo: 'https://github.com/misheck12/amenshi_4_life.git',
      path: '/home/ubuntu/amenshi_4_life',
      'post-deploy': 'cd server && npm ci --production && pm2 reload ecosystem.config.js --env production && pm2 save',
      'pre-setup': 'git config --global user.name "Deploy Bot" && git config --global user.email "deploy@amenshi4life.com"'
    }
  }
};
