import { createDiscordClient, loginDiscordClient } from "./bot/client.js";
import { registerBotEvents } from "./bot/events.js";
import { loadCardConfig } from "./bot/cards/cardConfig.js";
import { loadWelcomeLeaveConfig } from "./bot/modules/welcomeLeaveConfig.js";
import { loadEnv } from "./config/env.js";
import { logger } from "./utils/logger.js";

async function main() {
  let env;
  let welcomeLeaveConfig;
  let cardConfig;

  try {
    env = loadEnv();
    logger.setLevel(env.logLevel);
    welcomeLeaveConfig = loadWelcomeLeaveConfig();
    cardConfig = loadCardConfig();
  } catch (error) {
    logger.error("Configuração inválida no .env.", error instanceof Error ? error.message : error);
    process.exitCode = 1;
    return;
  }

  if (!env.botEnabled) {
    logger.info("DISCORD_BOT_ENABLED=false. Bot desativado sem erro.");
    return;
  }

  if (!env.token) {
    logger.warn("DISCORD_BOT_TOKEN ausente. Bot não será iniciado.");
    return;
  }

  const client = createDiscordClient();
  registerBotEvents(client, welcomeLeaveConfig, cardConfig);

  const loggedIn = await loginDiscordClient(client, env.token);

  if (!loggedIn) {
    process.exitCode = 1;
    return;
  }

  process.on("SIGINT", () => {
    logger.info("Encerrando BOT DISCORD RUNNAS.");
    client.destroy();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    logger.info("Encerrando BOT DISCORD RUNNAS.");
    client.destroy();
    process.exit(0);
  });
}

process.on("unhandledRejection", (error) => {
  logger.error("Erro assíncrono não tratado.", error instanceof Error ? error.message : error);
});

process.on("uncaughtException", (error) => {
  logger.error("Erro fatal não tratado.", error.message);
  process.exit(1);
});

void main();
