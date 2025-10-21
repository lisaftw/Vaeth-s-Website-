# Unified Realms Discord Bot

Discord bot for the Unified Realms alliance with bumping functionality and server management.

## Features

- `/bump` - Bump your server to increase visibility
- `/stats` - View your server's statistics
- `/register` - Register your server with the alliance
- `/info` - Get information about the alliance

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create a `.env` file based on `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Fill in your Discord bot token and other configuration

4. Run the bot:
\`\`\`bash
npm run dev  # Development with hot reload
npm start    # Production
\`\`\`

## Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token to your `.env` file
5. Enable the following intents:
   - Server Members Intent
   - Message Content Intent
6. Go to "OAuth2" > "URL Generator"
7. Select scopes: `bot`, `applications.commands`
8. Select permissions: `Send Messages`, `Embed Links`, `Read Message History`
9. Copy the generated URL and invite the bot to your server

## Deployment

### Vercel (Recommended)
The bot can be deployed alongside the website on Vercel.

### Railway
\`\`\`bash
railway up
\`\`\`

### Docker
\`\`\`bash
docker build -t unified-realms-bot .
docker run -d --env-file .env unified-realms-bot
\`\`\`

## Commands

### /bump
Bumps your server to the top of the alliance listing. Has a cooldown period.

### /stats
Shows your server's current statistics including member count, bump count, and ranking.

### /register
Registers your server with the alliance. Requires approval from administrators.

### /info
Displays information about the Unified Realms alliance.
