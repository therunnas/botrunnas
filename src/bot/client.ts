import { Client, GatewayIntentBits } from "discord.js";
import { logger } from "../utils/logger.js";

export function createDiscordClient() {
  return new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
  });
}

export async function loginDiscordClient(client: Client, token: string) {
  try {
    await client.login(token);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";

    if (/invalid token/i.test(message)) {
      logger.error("Falha ao conectar: token inválido.");
      return false;
    }

    if (/disallowed intents|privileged intent/i.test(message)) {
      logger.error(
        "Falha ao conectar: intents ausentes. Ative SERVER MEMBERS INTENT no Discord Developer Portal."
      );
      return false;
    }

    logger.error("Falha ao conectar no Discord.", message);
    return false;
  }
}
