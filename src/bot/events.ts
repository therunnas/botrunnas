import { Events, type Client } from "discord.js";
import type { CardConfig } from "./cards/cardConfig.js";
import { logger } from "../utils/logger.js";
import { registerWelcomeLeaveModule } from "./modules/welcomeLeave.js";
import type { WelcomeLeaveConfig } from "./modules/welcomeLeaveConfig.js";

export function registerBotEvents(
  client: Client,
  welcomeLeaveConfig: WelcomeLeaveConfig,
  cardConfig: CardConfig
) {
  client.once(Events.ClientReady, () => {
    logger.info(`BOT DISCORD RUNNAS online como ${client.user?.tag ?? "usuario desconhecido"}.`);

    if (welcomeLeaveConfig.welcomeEnabled && !welcomeLeaveConfig.welcomeChannelId) {
      logger.warn("Boas-vindas ativadas, mas DISCORD_WELCOME_CHANNEL_ID está vazio.");
    }

    if (welcomeLeaveConfig.leaveEnabled && !welcomeLeaveConfig.leaveChannelId) {
      logger.warn("Saídas ativadas, mas DISCORD_LEAVE_CHANNEL_ID está vazio.");
    }
  });

  registerWelcomeLeaveModule(client, welcomeLeaveConfig, cardConfig);

  client.on("error", (error) => {
    logger.error("Erro emitido pelo cliente Discord.", error.message);
  });

  client.on("warn", (message) => {
    logger.warn("Aviso emitido pelo cliente Discord.", message);
  });
}
