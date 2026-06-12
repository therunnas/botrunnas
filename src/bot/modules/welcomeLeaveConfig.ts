import { readEnvBoolean, readEnvString } from "../../config/env.js";

export type WelcomeLeaveConfig = {
  welcomeEnabled: boolean;
  welcomeChannelId: string;
  welcomeMessage: string;
  leaveEnabled: boolean;
  leaveChannelId: string;
  leaveMessage: string;
};

export function loadWelcomeLeaveConfig(): WelcomeLeaveConfig {
  return {
    welcomeEnabled: readEnvBoolean("DISCORD_WELCOME_ENABLED", true),
    welcomeChannelId: readEnvString("DISCORD_WELCOME_CHANNEL_ID"),
    welcomeMessage: readEnvString(
      "DISCORD_WELCOME_MESSAGE",
      "👋 Bem-vindo, {user.mention}, ao **{server.name}**!"
    ),
    leaveEnabled: readEnvBoolean("DISCORD_LEAVE_ENABLED", true),
    leaveChannelId: readEnvString("DISCORD_LEAVE_CHANNEL_ID"),
    leaveMessage: readEnvString(
      "DISCORD_LEAVE_MESSAGE",
      "📤 {user.mention} saiu de **{server.name}**."
    )
  };
}
