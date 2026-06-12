/**
 * Configuração do PM2 para o BOT DISCORD RUNNAS.
 *
 * O token e demais segredos ficam apenas no arquivo .env da VPS,
 * que é lido em tempo de execução por dotenv. Não há segredos aqui.
 *
 * Uso:
 *   pm2 start ecosystem.config.cjs
 *   pm2 restart bot-discord-runnas
 *   pm2 logs bot-discord-runnas
 */
module.exports = {
  apps: [
    {
      name: "bot-discord-runnas",
      script: "dist/index.js",
      cwd: __dirname,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
