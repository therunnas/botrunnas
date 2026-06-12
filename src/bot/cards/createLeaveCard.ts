import type { GuildMember, PartialGuildMember } from "discord.js";
import { createMemberCard } from "./assets.js";
import type { CardConfig, GeneratedCard } from "./cardConfig.js";

export async function createLeaveCard(
  member: GuildMember | PartialGuildMember,
  config: CardConfig
): Promise<GeneratedCard> {
  return createMemberCard({
    user: member.user,
    member,
    guild: member.guild,
    memberCount: member.guild.memberCount,
    title: config.leaveTitle,
    subtitle: config.leaveSubtitle,
    filePrefix: "leave",
    config
  });
}
