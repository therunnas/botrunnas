# BOT DISCORD RUNNAS

BOT DISCORD RUNNAS é um bot Discord próprio e independente para o servidor Just Chillin. A direção do projeto é criar, com o tempo, um bot modular de gerenciamento de servidor no estilo de ferramentas como Koya, mas sem copiar código, marca, identidade visual ou comportamento proprietário.

Esta primeira versão é um MVP local, simples e estável, focado apenas no módulo de boas-vindas e saída.

Ele não depende do `dc-2k-crm`, não usa dashboard, não usa banco de dados, não gera imagem/card e não foi preparado para rodar na Vercel.

## Funcionalidades

- Envia mensagem quando um membro entra no servidor.
- Envia mensagem quando um membro sai do servidor.
- Suporta menção clicável com `{user.mention}`.
- Usa `.env` para configuração local.
- Usa TypeScript, `discord.js` v14 e `dotenv`.
- Mantém a lógica inicial em um módulo separado para crescer depois.

## Visão Modular

O bot começa pequeno, mas a estrutura foi pensada para novos módulos:

- Boas-vindas e saída: módulo atual.
- Cards personalizados: próximo passo futuro.
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
DISCORD_WELCOME_MESSAGE=👋 Bem-vindo, {user.mention}, ao **{server.name}**!

DISCORD_LEAVE_ENABLED=true
DISCORD_LEAVE_CHANNEL_ID=
DISCORD_LEAVE_MESSAGE=📤 {user.mention} saiu de **{server.name}**.

LOG_LEVEL=info
```

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

Permissão futura para card:

- Anexar arquivos.

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

## Por Que Não Rodar Na Vercel Agora

Bots Discord precisam manter uma conexão WebSocket contínua com o gateway do Discord. Plataformas serverless, como Vercel, são ótimas para APIs e páginas, mas não são a melhor base para manter um bot principal conectado 24/7. Para produção, prefira um serviço que mantenha processo persistente.

## Templates Disponíveis

- `{user.mention}`: menção clicável do usuário.
- `{user}`: nome visível do usuário.
- `{user.username}`: username.
- `{user.id}`: ID do usuário.
- `{server.name}`: nome do servidor.
- `{server.id}`: ID do servidor.
- `{member.count}`: total de membros.

## Próximos Passos Futuros

- Card de boas-vindas.
- Dashboard web.
- Banco de dados.
- Sistema de logs.
- Cargos automáticos.
- Moderação.
