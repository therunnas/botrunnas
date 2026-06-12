import type { Client, GuildMember, PartialGuildMember } from "discord.js";
import type { CardConfig, GeneratedCard } from "../cards/cardConfig.js";
import { createLeaveCard } from "../cards/createLeaveCard.js";
import { createWelcomeCard } from "../cards/createWelcomeCard.js";
import { renderTemplate } from "../../templates/renderTemplate.js";
import { logger } from "../../utils/logger.js";
import { sendMessageToChannel } from "../sendMessage.js";
import type { WelcomeLeaveConfig } from "./welcomeLeaveConfig.js";

export function registerWelcomeLeaveModule(
  client: Client,
  config: WelcomeLeaveConfig,
  cardConfig: CardConfig
) {
  logger.info(
    config.welcomeEnabled
      ? "Módulo welcome ativado."
      : "Módulo welcome desativado por DISCORD_WELCOME_ENABLED=false."
  );
  logger.info(
    config.leaveEnabled
      ? "Módulo leave ativado."
      : "Módulo leave desativado por DISCORD_LEAVE_ENABLED=false."
  );
  logger.info(
    cardConfig.welcomeCardEnabled
      ? "Card de boas-vindas ativado."
      : "Card de boas-vindas desativado por DISCORD_WELCOME_CARD_ENABLED=false."
  );
  logger.info(
    cardConfig.leaveCardEnabled
      ? "Card de saída ativado."
      : "Card de saída desativado por DISCORD_LEAVE_CARD_ENABLED=false."
  );

  client.on("guildMemberAdd", async (member) => {
    logger.info("[welcome] Evento de entrada recebido.", {
      guildId: member.guild.id,
      userId: member.user.id
    });

    if (!config.welcomeEnabled) {
      logger.debug("[welcome] Módulo de boas-vindas desativado.");
      return;
    }

    const message = removeLeadingMessageEmoji(renderTemplate(config.welcomeMessage, {
      user: member.user,
      member,
      guild: member.guild,
      memberCount: member.guild.memberCount
    }));

    const card = cardConfig.welcomeCardEnabled
      ? await tryCreateCard("welcome", () => createWelcomeCard(member, cardConfig))
      : null;

    await sendMessageToChannel(client, {
      channelId: config.welcomeChannelId,
      message,
      eventName: "guildMemberAdd",
      card
    });
  });

  client.on("guildMemberRemove", async (member) => {
    logger.info("[leave] Evento de saída recebido.", {
      guildId: member.guild.id,
      userId: member.user.id
    });

    if (!config.leaveEnabled) {
      logger.debug("[leave] Módulo de saída desativado.");
      return;
    }

    const normalizedMember = member as GuildMember | PartialGuildMember;
    const message = removeLeadingMessageEmoji(renderTemplate(config.leaveMessage, {
      user: normalizedMember.user,
      member: normalizedMember,
      guild: normalizedMember.guild,
      memberCount: normalizedMember.guild.memberCount
    }));

    const card = cardConfig.leaveCardEnabled
      ? await tryCreateCard("leave", () => createLeaveCard(normalizedMember, cardConfig))
      : null;

    await sendMessageToChannel(client, {
      channelId: config.leaveChannelId,
      message,
      eventName: "guildMemberRemove",
      card
    });
  });
}

async function tryCreateCard(
  eventName: "welcome" | "leave",
  createCard: () => Promise<GeneratedCard>
) {
  try {
    const card = await createCard();
    logger.info(`[${eventName}] Card PNG gerado.`, {
      fileName: card.fileName,
      bytes: card.buffer.byteLength
    });
    return card;
  } catch (error) {
    logger.error(`[${eventName}] Falha ao gerar card. Enviando apenas mensagem textual.`, {
      error: error instanceof Error ? error.message : "Erro desconhecido"
    });
    return null;
  }
}

function removeLeadingMessageEmoji(message: string) {
  return message.replace(/^\s*(?:👋|📤)\s*/u, "");
}
