import assert from "node:assert/strict";
import test from "node:test";
import { renderTemplate, type TemplateContext } from "../src/templates/renderTemplate.js";

const context = {
  user: {
    id: "123456789",
    username: "runnas-user"
  },
  member: {
    displayName: "Runnas User"
  },
  guild: {
    id: "987654321",
    name: "Just Chillin"
  },
  memberCount: 42
} as TemplateContext;

test("renderiza menção clicável do usuário", () => {
  assert.equal(renderTemplate("{user.mention}", context), "<@123456789>");
});

test("renderiza nome visível do usuário", () => {
  assert.equal(renderTemplate("{user}", context), "Runnas User");
});

test("renderiza ID do usuário", () => {
  assert.equal(renderTemplate("{user.id}", context), "123456789");
});

test("renderiza nome do servidor", () => {
  assert.equal(renderTemplate("{server.name}", context), "Just Chillin");
});

test("renderiza contagem de membros", () => {
  assert.equal(renderTemplate("{member.count}", context), "42");
});

test("renderiza múltiplas variáveis na mesma frase", () => {
  assert.equal(
    renderTemplate("Bem-vindo, {user.mention}, ao {server.name}. Agora somos {member.count}.", context),
    "Bem-vindo, <@123456789>, ao Just Chillin. Agora somos 42."
  );
});
