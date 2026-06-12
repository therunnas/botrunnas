# BOT DISCORD RUNNAS

BOT DISCORD RUNNAS é um bot Discord próprio e independente para o servidor Just Chillin. A direção do projeto é criar, com o tempo, um bot modular de gerenciamento de servidor no estilo de ferramentas como Koya, mas sem copiar código, marca, identidade visual ou comportamento proprietário.

Esta versão é um MVP local, simples e estável, focado no módulo de boas-vindas e saída com card visual opcional.

Ele não depende do `dc-2k-crm`, não usa dashboard, não usa banco de dados e não foi preparado para rodar na Vercel.

## Funcionalidades

- Envia mensagem quando um membro entra no servidor.
- Envia mensagem quando um membro sai do servidor.
- Suporta menção clicável com `{user.mention}`.
- Pode enviar card PNG opcional junto com a mensagem.
- Usa `.env` para configuração local.
- Usa TypeScript, `discord.js` v14 e `dotenv`.
- Mantém a lógica inicial em um módulo separado para crescer depois.

## Visão Modular

O bot começa pequeno, mas a estrutura foi pensada para novos módulos:

- Boas-vindas e saída: módulo atual.
- Cards personalizados: imagem opcional para welcome/leave.
- Dashboard web: futuro, fora deste MVP.
- Banco de dados: futuro, fora deste MVP.
- Logs, cargos automáticos, moderação, níveis e comandos personalizados: futuros módulos.

## Instalação

```powershell
cd C:\Users\vinicius.macaneiro\Documents\GitHub\bot-discord-runnas
npm install
```

## Configuração

Copie ou edite o arquivo `.env` local. O `.env` não deve ser commitado.

```env
DISCORD_BOT_ENABLED=true
DISCORD_BOT_TOKEN=

DISCORD_WELCOME_ENABLED=true
DISCORD_WELCOME_CHANNEL_ID=
DISCORD_WELCOME_MESSAGE=Bem-vindo {user.mention} ao **{server.name}**!

DISCORD_LEAVE_ENABLED=true
DISCORD_LEAVE_CHANNEL_ID=
DISCORD_LEAVE_MESSAGE={user.mention} saiu de **{server.name}**.

DISCORD_WELCOME_CARD_ENABLED=false
DISCORD_LEAVE_CARD_ENABLED=false

DISCORD_CARD_WIDTH=820
DISCORD_CARD_HEIGHT=360

DISCORD_WELCOME_CARD_TITLE=BEM VINDO(A)
DISCORD_WELCOME_CARD_SUBTITLE=SO RELAXA E APROVEITA!

DISCORD_LEAVE_CARD_TITLE=ADEUS
DISCORD_LEAVE_CARD_SUBTITLE=POXA E FOI EMBORA.

DISCORD_CARD_TEXT_COLOR=#FFFFFF
DISCORD_CARD_ACCENT_COLOR=#EF4444

LOG_LEVEL=info
```

## Cards Opcionais

Os cards são imagens PNG enviadas como anexo junto com a mensagem textual. A mensagem textual continua sendo enviada mesmo quando o card está ativo.

O layout atual é simples e centralizado: fundo transparente, imagem maior no topo, nome em vermelho e textos brancos. No welcome, o card usa `BEM VINDO(A)` e `SO RELAXA E APROVEITA!`. Na saída, usa `ADEUS` e `POXA E FOI EMBORA.`. O texto desenhado na imagem remove emojis e caracteres especiais antes de renderizar para evitar quadradinhos no canvas.

Para ativar card de boas-vindas:

```env
DISCORD_WELCOME_CARD_ENABLED=true
```

Para ativar card de saída:

```env
DISCORD_LEAVE_CARD_ENABLED=true
```

Você pode ajustar tamanho, textos e cores pelo `.env`:

```env
DISCORD_CARD_WIDTH=820
DISCORD_CARD_HEIGHT=360
DISCORD_WELCOME_CARD_TITLE=BEM VINDO(A)
DISCORD_WELCOME_CARD_SUBTITLE=SO RELAXA E APROVEITA!
DISCORD_LEAVE_CARD_TITLE=ADEUS
DISCORD_LEAVE_CARD_SUBTITLE=POXA E FOI EMBORA.
DISCORD_CARD_TEXT_COLOR=#FFFFFF
DISCORD_CARD_ACCENT_COLOR=#EF4444
```

Importante: dentro da imagem o usuário aparece como texto desenhado. A menção clicável só funciona na mensagem textual usando `{user.mention}`.

## Como Pegar ID Dos Canais

1. Abra o Discord.
2. Vá em Configurações de usuário.
3. Abra Avançado.
4. Ative Modo desenvolvedor.
5. Clique com o botão direito no canal desejado.
6. Clique em Copiar ID.
7. Cole o ID em `DISCORD_WELCOME_CHANNEL_ID` e/ou `DISCORD_LEAVE_CHANNEL_ID`.

## SERVER MEMBERS INTENT

Para receber eventos de entrada e saída, ative o intent privilegiado:

1. Acesse o Discord Developer Portal.
2. Abra a aplicação do bot.
3. Vá em Bot.
4. Ative Server Members Intent.
5. Salve as alterações.

Sem esse intent, o bot pode ficar online, mas não receber `guildMemberAdd` e `guildMemberRemove`.

## Rodar Localmente

```powershell
npm run dev
```

Para build:

```powershell
npm run build
npm start
```

Para testes:

```powershell
npm test
```

## Testar Entrada E Saída

1. Confirme que o bot aparece online no Discord.
2. Configure os IDs dos canais no `.env`.
3. Garanta que o bot tem permissão de ver o canal e enviar mensagens.
4. Convide uma conta de teste para o servidor.
5. Remova a conta de teste para validar a mensagem de saída.
6. Verifique se `{user.mention}` aparece como menção clicável.

## Permissões Necessárias

No canal configurado para boas-vindas e saída, o bot precisa de:

- Ver canal.
- Enviar mensagens.
- Mencionar usuários.
- Ler histórico de mensagens.
- Anexar arquivos, quando card estiver ativado.

## Troubleshooting

### Bot fica online, mas não manda mensagem

Verifique se `SERVER MEMBERS INTENT` está ativado no Discord Developer Portal. Sem esse intent, o bot pode conectar, mas não recebe eventos de entrada e saída.

### Canal errado no `.env`

Confirme se `DISCORD_WELCOME_CHANNEL_ID` e `DISCORD_LEAVE_CHANNEL_ID` são IDs de canais do servidor correto.

### ID de canal incorreto

Ative o modo desenvolvedor no Discord, clique com o botão direito no canal e use Copiar ID. Não use o nome do canal.

### Bot sem permissão no canal

Garanta que o cargo do bot tem permissão para ver o canal e enviar mensagens. Se o canal tiver permissões específicas, revise a configuração do canal.

### Processo `npm run dev` fechado

O bot só fica online enquanto o processo local estiver aberto. Se fechar o terminal, o bot sai do ar.

### `.env` não carregado

Rode o comando dentro da pasta raiz do projeto:

```powershell
cd C:\Users\vinicius.macaneiro\Documents\GitHub\bot-discord-runnas
npm run dev
```

### `{user.mention}` não aparece clicável

Use exatamente `{user.mention}` no template. O bot converte esse valor para `<@ID_DO_USUARIO>`, que vira menção clicável no Discord.

### Card não aparece, mas a mensagem aparece

Confirme se `DISCORD_WELCOME_CARD_ENABLED` ou `DISCORD_LEAVE_CARD_ENABLED` está como `true`. Se estiver ativo, confira se o bot tem permissão de anexar arquivos no canal.

### Card falhou ao gerar

O bot registra o erro no terminal e envia apenas a mensagem textual. Isso é esperado como fallback para não derrubar o bot.

## Deploy na Discloud Free

A [Discloud](https://discloud.com) é a opção mais simples para hospedar este bot enquanto ele ainda é pequeno (boas-vindas, saída, cards). O plano **Free** dá **100 MB de RAM**, o que cobre o MVP com folga, mas é apertado se você gerar muitos cards PNG em paralelo.

O projeto já vem com `discloud.config` e `.discloudignore` prontos na raiz.

### Conteúdo do `discloud.config`

```ini
NAME=bot-discord-runnas
TYPE=bot
MAIN=dist/index.js
RAM=100
VERSION=latest
BUILD=npm run build
START=npm run start
```

### Passo a passo do upload

1. Gere um **zip do projeto** sem `node_modules`, `.git`, `.env`, `dist`, `coverage` e `*.log`. O `.discloudignore` ajuda a Discloud a filtrar isso no upload, mas garanta no seu zip local também:
   ```powershell
   # PowerShell — cria um zip ignorando o que importa
   Compress-Archive -Path * -DestinationPath bot-discord-runnas.zip `
     -Exclude node_modules, .git, .env, dist, coverage, *.log
   ```
2. No painel da Discloud (`https://discloud.com/dashboard`), use **Upload** e envie o zip.
3. Configure o **token e demais variáveis de ambiente** pelo painel da Discloud (campo de secrets/env), nunca dentro do zip. Se a Discloud não oferecer painel de env, suba o `.env` apenas dentro do ambiente seguro deles, **nunca no GitHub**.
4. Acompanhe o build e o start no log do painel. Se o bot subir com a tag `online`, está pronto.

### Limites e como contornar

- **100 MB de RAM** é apertado quando os cards estão ligados. Se o processo cair com `OOM` ou for reiniciado por consumo, desative os cards temporariamente no `.env` da Discloud:
  ```env
  DISCORD_WELCOME_CARD_ENABLED=false
  DISCORD_LEAVE_CARD_ENABLED=false
  ```
  As mensagens de texto continuam normais — o card é opcional por design.
- Se a Discloud **não executar `BUILD=npm run build`** (ou se a versão Free não permitir), rode `npm run build` localmente antes de zipar, **remova `dist` do `.discloudignore`** e inclua a pasta `dist/` no zip.
- Para bot 24h com mais folga (CPU, RAM, cards, futura persistência), use a opção da Oracle Cloud descrita abaixo.

## Hospedagem 24h gratuita (Oracle Cloud Always Free)

O caminho recomendado para deixar o bot online 24h sem custo é uma VM Ubuntu na **Oracle Cloud Always Free** (gratuito sem prazo de expiração) rodando o bot sob o **PM2**. O projeto já vem com `ecosystem.config.cjs` pronto para o PM2.

Passo a passo completo no documento [docs/deploy-oracle-free.md](docs/deploy-oracle-free.md). Resumo:

1. Criar VM Ubuntu 22.04 no shape `VM.Standard.A1.Flex` (ARM) ou `VM.Standard.E2.1.Micro` (AMD).
2. Liberar SSH (porta 22) — o bot **não precisa** de portas abertas para entrada (só conexão de saída para o gateway do Discord).
3. Instalar Node.js LTS, clonar o repo, criar `.env` **manualmente** na VM (nunca por scp/git).
4. `npm install && npm run build`.
5. `sudo npm install -g pm2 && pm2 start ecosystem.config.cjs`.
6. `pm2 save && pm2 startup` para sobreviver a reboot.

Comandos PM2 essenciais:

```bash
pm2 start ecosystem.config.cjs    # iniciar
pm2 logs bot-discord-runnas       # acompanhar logs
pm2 restart bot-discord-runnas    # reiniciar
pm2 status                        # ver estado
pm2 save && pm2 startup           # autostart no boot
```

Atualizar o bot após novo push em `main`:

```bash
cd ~/bot-discord-runnas
git pull origin main
npm install
npm run build
pm2 restart bot-discord-runnas
```

> O `@napi-rs/canvas` (usado nos cards) tem binários pré-compilados para Linux x86_64 e ARM64, então **não precisa instalar libcairo/libpango** na VM — `npm install` resolve sozinho.

### Outras alternativas

| Plataforma | Adequado para bot Discord 24h? |
|---|---|
| Discloud Free | ✅ Mais simples para começar; 100 MB RAM, cards podem apertar |
| Oracle Cloud Always Free | ✅ Recomendado para crescer, gratuito sem prazo |
| Fly.io / Railway | ⚠️ Tier gratuito limitado, cartão exigido |
| Render / Glitch (free tier) | ❌ Dormem por inatividade — bot cai |
| Vercel | ❌ Serverless, não mantém WebSocket persistente |
| PC pessoal com DDNS | ✅ Funciona, custo de energia/disponibilidade fica com você |

## Por Que Não Rodar Na Vercel

Bots Discord precisam manter uma conexão WebSocket contínua com o gateway do Discord. Plataformas serverless, como Vercel, são ótimas para APIs e páginas, mas não mantêm um processo persistente conectado ao gateway. Use uma VM (Oracle Always Free, conforme acima) ou serviço com processo persistente em vez disso.

## Templates Disponíveis

- `{user.mention}`: menção clicável do usuário.
- `{user}`: nome visível do usuário.
- `{user.username}`: username.
- `{user.id}`: ID do usuário.
- `{server.name}`: nome do servidor.
- `{server.id}`: ID do servidor.
- `{member.count}`: total de membros.

## Próximos Passos Futuros

- Persistência e configuração por servidor.
- Dashboard web.
- Banco de dados.
- Sistema de logs.
- Cargos automáticos.
- Moderação.
