import type { GuildMember } from "discord.js";
import { createMemberCard } from "./assets.js";
import type { CardConfig, GeneratedCard } from "./cardConfig.js";

export async function createWelcomeCard(
  member: GuildMember,
  config: CardConfig
): Promise<GeneratedCard> {
  return createMemberCard({
    user: member.user,
    member,
    guild: member.guild,
    memberCount: member.guild.memberCount,
    title: config.welcomeTitle,
    subtitle: config.welcomeSubtitle,
    filePrefix: "welcome",
    config
  });
}
