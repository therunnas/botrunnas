import { Events, type Client } from "discord.js";
import type { BotEnv } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { registerWelcomeLeaveModule } from "./modules/welcomeLeave.js";

export function registerBotEvents(client: Client, env: BotEnv) {
  client.once(Events.ClientReady, () => {
    logger.info(`BOT DISCORD RUNNAS online como ${client.user?.tag ?? "usuario desconhecido"}.`);

    if (env.welcomeEnabled && !env.welcomeChannelId) {
      logger.warn("Boas-vindas ativadas, mas DISCORD_WELCOME_CHANNEL_ID está vazio.");
    }

    if (env.leaveEnabled && !env.leaveChannelId) {
      logger.warn("Saídas ativadas, mas DISCORD_LEAVE_CHANNEL_ID está vazio.");
    }
  });

  registerWelcomeLeaveModule(client, env);

  client.on("error", (error) => {
    logger.error("Erro emitido pelo cliente Discord.", error.message);
  });

  client.on("warn", (message) => {
    logger.warn("Aviso emitido pelo cliente Discord.", message);
  });
}
