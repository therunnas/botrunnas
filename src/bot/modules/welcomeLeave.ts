import type { Client, GuildMember, PartialGuildMember } from "discord.js";
import type { BotEnv } from "../../config/env.js";
import { renderTemplate } from "../../templates/renderTemplate.js";
import { logger } from "../../utils/logger.js";
import { sendMessageToChannel } from "../sendMessage.js";

export function registerWelcomeLeaveModule(client: Client, env: BotEnv) {
  client.on("guildMemberAdd", async (member) => {
    if (!env.welcomeEnabled) {
      logger.debug("[welcome] Módulo de boas-vindas desativado.");
      return;
    }

    const message = renderTemplate(env.welcomeMessage, {
      user: member.user,
      member,
      guild: member.guild,
      memberCount: member.guild.memberCount
    });

    await sendMessageToChannel(client, {
      channelId: env.welcomeChannelId,
      message,
      eventName: "guildMemberAdd"
    });
  });

  client.on("guildMemberRemove", async (member) => {
    if (!env.leaveEnabled) {
      logger.debug("[leave] Módulo de saída desativado.");
      return;
    }

    const normalizedMember = member as GuildMember | PartialGuildMember;
    const message = renderTemplate(env.leaveMessage, {
      user: normalizedMember.user,
      member: normalizedMember,
      guild: normalizedMember.guild,
      memberCount: normalizedMember.guild.memberCount
    });

    await sendMessageToChannel(client, {
      channelId: env.leaveChannelId,
      message,
      eventName: "guildMemberRemove"
    });
  });
}
