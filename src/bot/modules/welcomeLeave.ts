import type { Client, GuildMember, PartialGuildMember } from "discord.js";
import { renderTemplate } from "../../templates/renderTemplate.js";
import { logger } from "../../utils/logger.js";
import { sendMessageToChannel } from "../sendMessage.js";
import type { WelcomeLeaveConfig } from "./welcomeLeaveConfig.js";

export function registerWelcomeLeaveModule(client: Client, config: WelcomeLeaveConfig) {
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

  client.on("guildMemberAdd", async (member) => {
    logger.info("[welcome] Evento de entrada recebido.", {
      guildId: member.guild.id,
      userId: member.user.id
    });

    if (!config.welcomeEnabled) {
      logger.debug("[welcome] Módulo de boas-vindas desativado.");
      return;
    }

    const message = renderTemplate(config.welcomeMessage, {
      user: member.user,
      member,
      guild: member.guild,
      memberCount: member.guild.memberCount
    });

    await sendMessageToChannel(client, {
      channelId: config.welcomeChannelId,
      message,
      eventName: "guildMemberAdd"
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
    const message = renderTemplate(config.leaveMessage, {
      user: normalizedMember.user,
      member: normalizedMember,
      guild: normalizedMember.guild,
      memberCount: normalizedMember.guild.memberCount
    });

    await sendMessageToChannel(client, {
      channelId: config.leaveChannelId,
      message,
      eventName: "guildMemberRemove"
    });
  });
}
