import type { Guild, GuildMember, PartialGuildMember, User } from "discord.js";

export type TemplateContext = {
  user: User;
  member: GuildMember | PartialGuildMember;
  guild: Guild;
  memberCount: number;
};

export function renderTemplate(template: string, context: TemplateContext) {
  const displayName =
    "displayName" in context.member && context.member.displayName
      ? context.member.displayName
      : context.user.username;

  const values: Record<string, string> = {
    "{user.mention}": `<@${context.user.id}>`,
    "{user}": displayName,
    "{user.username}": context.user.username,
    "{user.id}": context.user.id,
    "{server.name}": context.guild.name,
    "{server.id}": context.guild.id,
    "{member.count}": String(context.memberCount)
  };

  return Object.entries(values).reduce(
    (message, [placeholder, value]) => message.split(placeholder).join(value),
    template
  );
}
