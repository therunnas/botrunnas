import assert from "node:assert/strict";
import test from "node:test";
import { loadCardConfig } from "../src/bot/cards/cardConfig.js";

const keys = [
  "DISCORD_WELCOME_CARD_ENABLED",
  "DISCORD_LEAVE_CARD_ENABLED",
  "DISCORD_CARD_WIDTH",
  "DISCORD_CARD_HEIGHT",
  "DISCORD_WELCOME_CARD_TITLE",
  "DISCORD_WELCOME_CARD_SUBTITLE",
  "DISCORD_LEAVE_CARD_TITLE",
  "DISCORD_LEAVE_CARD_SUBTITLE",
  "DISCORD_CARD_TEXT_COLOR",
  "DISCORD_CARD_ACCENT_COLOR"
];

function withEnv(values: Record<string, string | undefined>, run: () => void) {
  const previous = new Map(keys.map((key) => [key, process.env[key]]));

  for (const key of keys) {
    delete process.env[key];
  }

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    run();
  } finally {
    for (const [key, value] of previous.entries()) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

test("carrega card desativado por padrão", () => {
  withEnv({}, () => {
    const config = loadCardConfig();

    assert.equal(config.welcomeCardEnabled, false);
    assert.equal(config.leaveCardEnabled, false);
    assert.equal(config.width, 820);
    assert.equal(config.height, 360);
    assert.equal(config.welcomeTitle, "BEM VINDO(A)");
    assert.equal(config.welcomeSubtitle, "SO RELAXA E APROVEITA!");
    assert.equal(config.leaveTitle, "ADEUS");
    assert.equal(config.leaveSubtitle, "POXA E FOI EMBORA.");
    assert.equal(config.accentColor, "#EF4444");
  });
});

test("carrega configuração customizada de card", () => {
  withEnv(
    {
      DISCORD_WELCOME_CARD_ENABLED: "true",
      DISCORD_LEAVE_CARD_ENABLED: "true",
      DISCORD_CARD_WIDTH: "1000",
      DISCORD_CARD_HEIGHT: "360",
      DISCORD_WELCOME_CARD_TITLE: "Chegou",
      DISCORD_WELCOME_CARD_SUBTITLE: "Bem-vindo ao servidor.",
      DISCORD_LEAVE_CARD_TITLE: "Saiu",
      DISCORD_LEAVE_CARD_SUBTITLE: "Até a próxima.",
      DISCORD_CARD_TEXT_COLOR: "#FFFFFF",
      DISCORD_CARD_ACCENT_COLOR: "#FF00AA"
    },
    () => {
      const config = loadCardConfig();

      assert.equal(config.welcomeCardEnabled, true);
      assert.equal(config.leaveCardEnabled, true);
      assert.equal(config.width, 1000);
      assert.equal(config.height, 360);
      assert.equal(config.welcomeTitle, "Chegou");
      assert.equal(config.leaveTitle, "Saiu");
      assert.equal(config.accentColor, "#FF00AA");
    }
  );
});

test("rejeita cor inválida", () => {
  withEnv({ DISCORD_CARD_ACCENT_COLOR: "purple" }, () => {
    assert.throws(() => loadCardConfig(), /DISCORD_CARD_ACCENT_COLOR/);
  });
});
