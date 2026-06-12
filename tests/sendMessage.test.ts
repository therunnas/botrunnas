import assert from "node:assert/strict";
import test from "node:test";
import { PermissionFlagsBits } from "discord.js";
import { sendMessageToChannel } from "../src/bot/sendMessage.js";

test("envia apenas texto quando nenhum card é informado", async () => {
  let payload: unknown = null;

  const channel = {
    guild: { id: "guild-1" },
    isTextBased: () => true,
    permissionsFor: () => ({
      has: (permission: bigint) =>
        permission === PermissionFlagsBits.ViewChannel ||
        permission === PermissionFlagsBits.SendMessages ||
        permission === PermissionFlagsBits.AttachFiles
    }),
    send: async (messagePayload: unknown) => {
      payload = messagePayload;
    }
  };

  const client = {
    user: { id: "bot-1" },
    channels: {
      fetch: async () => channel
    }
  };

  const result = await sendMessageToChannel(client as never, {
    channelId: "channel-1",
    message: "Bem-vindo, <@123>!",
    eventName: "guildMemberAdd",
    card: null
  });

  assert.equal(result, true);
  assert.deepEqual(payload, {
    content: "Bem-vindo, <@123>!",
    files: undefined
  });
});
