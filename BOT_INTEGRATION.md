# Unified Realms Bot Integration Guide

This document explains how to integrate your Discord bot with the Unified Realms alliance website.

## Features

The bot integration allows you to:
- Automatically update server member counts
- Implement a bump system (similar to Disboard)
- Retrieve server information
- Track bump statistics

## Setup

### 1. Environment Variables

Add the following to your `.env` file:

\`\`\`env
BOT_API_TOKEN=your_secure_random_token_here
\`\`\`

Generate a secure token using:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### 2. Bot Authentication

All bot API requests require a Bearer token in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_BOT_API_TOKEN
\`\`\`

## API Endpoints

### 1. Update Server Stats

Automatically update a server's member count.

**Endpoint:** `POST /api/bot/update-stats`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_BOT_API_TOKEN
Content-Type: application/json
\`\`\`

**Body:**
\`\`\`json
{
  "serverId": "123456789012345678",
  "memberCount": 1500,
  "onlineMembers": 450
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Stats updated for Server Name",
  "memberCount": 1500,
  "onlineMembers": 450
}
\`\`\`

### 2. Bump Server

Move a server to the top of the alliance list.

**Endpoint:** `POST /api/bot/bump`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_BOT_API_TOKEN
Content-Type: application/json
\`\`\`

**Body:**
\`\`\`json
{
  "serverId": "123456789012345678",
  "userId": "987654321098765432"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Server bumped successfully! Your server has been moved to the top of the list."
}
\`\`\`

**Cooldown:** 2 hours between bumps

### 3. Get Servers

Retrieve all servers with auto-update enabled.

**Endpoint:** `GET /api/bot/servers`

**Headers:**
\`\`\`
Authorization: Bearer YOUR_BOT_API_TOKEN
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "servers": [
    {
      "id": "uuid",
      "discord_id": "123456789012345678",
      "name": "Example Server",
      "members": 1500,
      "auto_update_enabled": true
    }
  ],
  "count": 1
}
\`\`\`

## Example Bot Commands

### Discord.js Example - Bump Command

\`\`\`javascript
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bump')
    .setDescription('Bump your server in the Unified Realms alliance'),
  async execute(interaction) {
    try {
      const response = await axios.post(
        'https://your-website.com/api/bot/bump',
        {
          serverId: interaction.guild.id,
          userId: interaction.user.id
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.BOT_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        await interaction.reply({
          content: `✅ ${response.data.message}`,
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: `❌ ${response.data.message}`,
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('Bump error:', error);
      await interaction.reply({
        content: '❌ Failed to bump server. Please try again later.',
        ephemeral: true
      });
    }
  }
};
\`\`\`

### Discord.js Example - Auto Stats Update

\`\`\`javascript
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Update stats every 10 minutes
setInterval(async () => {
  for (const guild of client.guilds.cache.values()) {
    try {
      const memberCount = guild.memberCount;
      const onlineMembers = guild.members.cache.filter(
        member => member.presence?.status !== 'offline'
      ).size;

      await axios.post(
        'https://your-website.com/api/bot/update-stats',
        {
          serverId: guild.id,
          memberCount: memberCount,
          onlineMembers: onlineMembers
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.BOT_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`Updated stats for ${guild.name}: ${memberCount} members`);
    } catch (error) {
      console.error(`Failed to update stats for ${guild.name}:`, error);
    }
  }
}, 10 * 60 * 1000); // 10 minutes

client.login(process.env.DISCORD_TOKEN);
\`\`\`

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing fields)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (auto-update disabled)
- `404` - Not Found (server not found)
- `500` - Internal Server Error

## Rate Limiting

- **Stats Updates:** No rate limit (recommended: every 10 minutes)
- **Bumps:** 2 hour cooldown per server
- **Server List:** No rate limit

## Support

For questions or issues with bot integration:
- Open an issue on GitHub
- Contact the alliance administrators
- Check the documentation at your-website.com/docs
