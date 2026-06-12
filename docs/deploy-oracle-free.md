# Deploy gratuito na Oracle Cloud Always Free

Este guia descreve como hospedar o BOT DISCORD RUNNAS 24h por dia, sem custo, usando o tier **Always Free** da Oracle Cloud. O bot roda como processo persistente sob o PM2 em uma VM Ubuntu.

> **Importante:** existem duas ofertas distintas na Oracle Cloud.
> - **Always Free** — gratuito sem prazo, suficiente para esse bot.
> - **Free Trial** — créditos de US$ 300 que expiram em 30 dias.
>
> Use apenas recursos marcados como **Always Free** no console. Recursos fora dessa marca passam a ser cobrados se você converter a conta para "Pay As You Go". Nunca habilite upgrade da conta para este deploy.

## Pré-requisitos

- Conta Oracle Cloud com Always Free ativo na sua região.
- Domínio e e-mail para a conta (cartão de crédito é exigido para verificação, mas não é cobrado se você ficar no Always Free).
- Cliente SSH local (PowerShell, WSL ou Putty).
- Repositório `bot-discord-runnas` já no GitHub (já está).
- Token Discord válido e IDs dos canais de welcome/leave em mãos.

## 1. Criar a VM Ubuntu

No console Oracle Cloud:

1. Menu → **Compute** → **Instances** → **Create Instance**.
2. **Name:** `bot-discord-runnas`.
3. **Image:** `Canonical Ubuntu 22.04` (LTS).
4. **Shape:**
   - Preferência 1: `VM.Standard.A1.Flex` (ARM Ampere) — até 4 OCPU e 24 GB RAM no Always Free. Defina 1 OCPU e 6 GB RAM, mais que suficiente.
   - Preferência 2 (fallback): `VM.Standard.E2.1.Micro` (AMD x86) — 1/8 OCPU, 1 GB RAM. Funciona, mas é apertado.
5. **Networking:** rede VCN padrão; gere uma nova subnet pública.
6. **SSH keys:** suba sua chave pública (`~/.ssh/id_rsa.pub`). Se não tiver, gere com `ssh-keygen -t ed25519` antes.
7. **Boot volume:** 50 GB (dentro do Always Free).
8. **Create**.

Após alguns minutos, anote o **IP público** da instância.

### Liberar acesso SSH

Por padrão a Oracle abre SSH (porta 22) na security list, mas confirme:

1. Menu → **Networking** → **Virtual Cloud Networks** → sua VCN → subnet pública → security list.
2. **Ingress Rules** deve ter: `0.0.0.0/0`, TCP, porta `22`.

O bot Discord **não precisa de portas abertas para receber tráfego** — ele só faz conexão de saída (WebSocket) com o gateway do Discord. Não habilite nada além de SSH.

## 2. Conectar via SSH

Do seu PC:

```bash
ssh -i ~/.ssh/id_rsa ubuntu@<IP_PUBLICO>
```

A partir daqui, todos os comandos rodam na VM.

## 3. Instalar Node.js LTS

Use a distribuição oficial via NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git
node -v   # deve mostrar v22.x
npm -v
```

> O pacote `@napi-rs/canvas` possui binários nativos pré-compilados para `x86_64-linux-gnu` e `aarch64-linux-gnu`, então **não precisa instalar libcairo, libpango ou outras bibliotecas de sistema**. `npm install` baixa o binário certo automaticamente.

## 4. Clonar o repositório

```bash
cd ~
git clone https://github.com/therunnas/botrunnas.git bot-discord-runnas
cd bot-discord-runnas
```

## 5. Criar o `.env` manualmente na VPS

**Nunca envie o `.env` por scp ou git. Crie direto na VM:**

```bash
nano .env
```

Cole o conteúdo, ajustando os IDs dos canais e o token:

```env
DISCORD_BOT_ENABLED=true
DISCORD_BOT_TOKEN=<cole aqui o token do Developer Portal>

DISCORD_WELCOME_ENABLED=true
DISCORD_WELCOME_CHANNEL_ID=<id do canal de boas-vindas>
DISCORD_WELCOME_MESSAGE=Bem-vindo, {user.mention}, ao **{server.name}**!

DISCORD_LEAVE_ENABLED=true
DISCORD_LEAVE_CHANNEL_ID=<id do canal de saída>
DISCORD_LEAVE_MESSAGE={user.mention} saiu de **{server.name}**.

DISCORD_WELCOME_CARD_ENABLED=true
DISCORD_LEAVE_CARD_ENABLED=true

LOG_LEVEL=info
```

Salve com `Ctrl+O`, `Enter`, `Ctrl+X`.

Proteja o arquivo:

```bash
chmod 600 .env
```

Confirme que ele está ignorado pelo Git (já está no `.gitignore` do projeto):

```bash
git check-ignore -v .env
# saída esperada: .gitignore:3:.env    .env
```

## 6. Instalar dependências e compilar

```bash
npm install
npm run build
```

A pasta `dist/` é gerada. Teste rápido (Ctrl+C para sair):

```bash
node dist/index.js
```

Você deve ver `BOT DISCORD RUNNAS online como <tag>` se o token e intents estiverem corretos.

## 7. Rodar com PM2

Instale o PM2 globalmente:

```bash
sudo npm install -g pm2
```

Inicie o bot usando o `ecosystem.config.cjs` do projeto:

```bash
pm2 start ecosystem.config.cjs
```

Ou diretamente, sem o ecosystem:

```bash
pm2 start dist/index.js --name bot-discord-runnas
```

Confirme:

```bash
pm2 status
```

## 8. Logs, restart e monitoramento

```bash
pm2 logs bot-discord-runnas           # logs em tempo real
pm2 logs bot-discord-runnas --lines 100  # últimas 100 linhas
pm2 restart bot-discord-runnas        # reiniciar
pm2 stop bot-discord-runnas           # parar (sem remover)
pm2 delete bot-discord-runnas         # remover da lista
pm2 monit                             # dashboard interativo
```

## 9. Garantir reinício automático no reboot

```bash
pm2 save
pm2 startup
```

O `pm2 startup` imprime um comando `sudo env PATH=... pm2 startup systemd -u ubuntu --hp /home/ubuntu` — copie e cole. Isso registra o PM2 no systemd para que ele suba sozinho se a VM reiniciar.

Teste reiniciando a VM pelo console Oracle e confirmando que o bot volta:

```bash
sudo reboot
# espere ~1 min, reconecte via SSH
pm2 status
```

## 10. Atualizar o bot após novo push no GitHub

A cada release na branch `main`:

```bash
cd ~/bot-discord-runnas
git pull origin main
npm install              # só se package.json mudou
npm run build
pm2 restart bot-discord-runnas
pm2 logs bot-discord-runnas --lines 30
```

Você pode automatizar isso em um script `~/update-bot.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd ~/bot-discord-runnas
git pull origin main
npm install --omit=dev
npm run build
pm2 restart bot-discord-runnas
```

Depois `chmod +x ~/update-bot.sh` e use `./update-bot.sh` em cada atualização.

## 11. Garantir que o `.env` nunca vá para o GitHub

O projeto já tem `.env` no `.gitignore`. Para confirmar na VM:

```bash
cat .gitignore | grep -n .env
git status            # .env não deve aparecer como untracked nem modified
git check-ignore -v .env
```

Se algum dia você precisar adicionar variáveis novas, atualize **`.env.example`** (sem segredos) e replique a mudança no `.env` da VM manualmente. Nunca commite `.env`.

## Riscos e limitações conhecidos

- **Out of capacity em Ampere A1.** Algumas regiões Oracle ficam sem capacidade ARM. Se a criação da VM falhar com "Out of capacity", tente outra Availability Domain ou caia para `VM.Standard.E2.1.Micro` (AMD x86).
- **Idle reclaim.** A Oracle reserva o direito de reclamar VMs Always Free ociosas. Bots Discord mantêm conexão WebSocket constante, então não ficam ociosos — risco baixo.
- **Limites de RAM em E2.1.Micro.** 1 GB é apertado. Se você ativar cards e o consumo subir, prefira A1 com 4–6 GB.
- **Cartão de crédito exigido.** Oracle valida com cartão na criação da conta. Não há cobrança no Always Free, mas se a conta for promovida a "Pay As You Go" acidentalmente, recursos extras passam a custar. Mantenha em Always Free.
- **`@napi-rs/canvas` em musl/Alpine** funciona, mas este guia recomenda Ubuntu (glibc), que é o caminho testado.

## Alternativas gratuitas (caso a Oracle não funcione para você)

- **Fly.io** — tier gratuito limitado, exige cartão.
- **Railway** — trial gratuito limitado, depois cobra.
- **Render** — free tier dorme após 15 min de inatividade. Inviável para bot WebSocket persistente.
- **Glitch** — semelhante ao Render, dorme.
- **Hospedagem em PC próprio + DDNS** — zero custo de hospedagem; você arca com energia e ruído.

A recomendação principal continua sendo **Oracle Cloud Always Free**.
