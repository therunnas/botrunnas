# Roadmap - BOT DISCORD RUNNAS

Este roadmap organiza o crescimento do BOT DISCORD RUNNAS por fases. A ideia é construir um bot próprio, modular e configurável para servidor Discord, começando pequeno e evoluindo com segurança.

## Fase 1 - MVP Welcome/Leave

Status: concluida.

Objetivo:
- Bot online com `discord.js` v14.
- Configuracao por `.env`.
- Mensagem de boas-vindas quando membro entra.
- Mensagem de saida quando membro sai.
- Suporte a `{user.mention}` clicavel.
- Templates simples para usuario, servidor e contagem de membros.
- Estrutura modular inicial em `src/bot/modules`.

Validacao:
- `npm run typecheck`
- `npm run build`
- Teste manual no Discord com entrada e saida de membro.

## Fase 2 - Estabilizacao Do Modulo Welcome/Leave

Status: concluida.

Objetivo:
- Revisar textos padrao.
- Separar configuracao do modulo em arquivo proprio.
- Melhorar logs por evento.
- Documentar erros comuns de permissao e intents.
- Preparar testes unitarios para `renderTemplate`.

Entregue:
- Configuracao do modulo separada em `welcomeLeaveConfig.ts`.
- Logs de ativacao, eventos recebidos e falhas esperadas.
- Tratamento de canal ausente, canal invalido e permissao insuficiente.
- Testes leves para `renderTemplate` com `node:test`.
- Troubleshooting documentado no README.

Fora do escopo:
- Card de imagem.
- Dashboard.
- Banco de dados.

## Fase 3 - Card Personalizado

Status: concluida.

Objetivo:
- Gerar card visual de boas-vindas.
- Gerar card visual de saida.
- Permitir ativar/desativar card por `.env`.
- Manter mensagem textual como fallback.
- Escolher biblioteca de imagem com suporte local estavel no Windows.

Entregue:
- Cards PNG opcionais para welcome e leave.
- Avatar do usuario quando disponivel.
- Nome do usuario, titulo e subtitulo em layout centralizado.
- Envio como anexo no `discord.js`.
- Fallback textual caso a imagem falhe.
- Configuracao via `.env.example`.
- Testes de configuracao e fallback de envio textual.
- Ajuste visual para layout simples centralizado, sem emojis dentro da imagem.

Fora do escopo:
- Dashboard.
- Banco de dados.
- Configuracao por servidor fora do `.env`.
- Card com imagem de fundo customizada.

## Fase 4 - Persistencia E Configuracao Por Servidor

Objetivo:
- Adicionar banco de dados.
- Configurar welcome/leave por servidor.
- Configurar canais, templates e flags sem depender apenas de `.env`.

Decisoes futuras:
- SQLite para local simples ou Postgres para producao.
- Modelo de dados de guilds, modulos e canais.

## Fase 5 - Dashboard Web

Objetivo:
- Painel para configurar servidor.
- Login com Discord OAuth.
- Controle de modulos.
- Edicao de templates.
- Preview de card.

Fora do escopo ate esta fase:
- Deploy publico.
- Permissoes avancadas por cargo.

## Fase 6 - Modulos Extras

Possiveis modulos:
- Cargos automaticos.
- Logs de servidor.
- Moderacao.
- Ranking e niveis.
- Comandos personalizados.
- Mensagens agendadas.

## Regras Do Projeto

- Nao commitar `.env`.
- Nao expor token em terminal, README, issues ou commits.
- Manter cada modulo isolado.
- Validar `npm run typecheck` antes de publicar alteracoes.
- Evoluir uma fase por vez.
