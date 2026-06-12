import {
  Client,
  PermissionFlagsBits,
  type ClientUser,
  type GuildBasedChannel
} from "discord.js";
import { logger } from "../utils/logger.js";

type SendMessageOptions = {
  channelId: string;
  message: string;
  eventName: "guildMemberAdd" | "guildMemberRemove";
};

function canCheckPermissions(channel: GuildBasedChannel): channel is GuildBasedChannel & {
  permissionsFor(user: ClientUser): { has(permission: bigint): boolean } | null;
} {
  return "permissionsFor" in channel;
}

export async function sendMessageToChannel(client: Client, options: SendMessageOptions) {
  if (!options.channelId) {
    logger.warn(`[${options.eventName}] Canal não configurado.`);
    return false;
  }

  let channel: GuildBasedChannel | null = null;

  try {
    const fetched = await client.channels.fetch(options.channelId);
    channel = fetched && "guild" in fetched ? fetched : null;
  } catch (error) {
    logger.error(`[${options.eventName}] Erro ao buscar canal.`, {
      channelId: options.channelId,
      error: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return false;
  }

  if (!channel) {
    logger.warn(`[${options.eventName}] Canal não encontrado.`, {
      channelId: options.channelId
    });
    return false;
  }

  if (!channel.isTextBased() || !("send" in channel)) {
    logger.warn(`[${options.eventName}] Canal não suporta envio de mensagens.`, {
      channelId: options.channelId
    });
    return false;
  }

  if (client.user && canCheckPermissions(channel)) {
    const permissions = channel.permissionsFor(client.user);

    if (!permissions?.has(PermissionFlagsBits.SendMessages)) {
      logger.warn(`[${options.eventName}] Bot sem permissão de enviar mensagem.`, {
        channelId: options.channelId
      });
      return false;
    }
  }

  try {
    await channel.send({ content: options.message });
    logger.info(`[${options.eventName}] Mensagem enviada.`, {
      channelId: options.channelId
    });
    return true;
  } catch (error) {
    logger.error(`[${options.eventName}] Erro ao enviar mensagem.`, {
      channelId: options.channelId,
      error: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return false;
  }
}
