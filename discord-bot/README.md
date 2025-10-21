# Unified Realms Discord Bot

Official Discord bot for the Unified Realms Alliance with bumping and automatic stats updates.

## Features

- 🚀 **Server Bumping** - Bump your server every 2 hours to boost visibility
- 📊 **Auto Stats Updates** - Member counts update automatically every 10 minutes
- ⚔️ **Alliance Integration** - Seamless integration with the alliance website
- 🎨 **Beautiful Embeds** - Clean, professional Discord embeds

## Quick Setup

### 1. Prerequisites

- Node.js 16.x or higher
- A Discord bot token ([Get one here](https://discord.com/developers/applications))
- Your deployed website URL

### 2. Get Discord Bot Token

1. Go to https://discord.com/developers/applications
2. Click "New Application" and give it a name (e.g., "Unified Realms Bot")
3. Go to the "Bot" tab
4. Click "Reset Token" and copy it (save it somewhere safe!)
5. **Enable these intents:**
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent

### 3. Get Client ID

- Same page, go to "General Information" tab
- Copy the "Application ID" (this is your Client ID)

### 4. Run Setup Wizard

\`\`\`bash
cd discord-bot
npm install
npm run setup
\`\`\`

The wizard will ask you for:
- Discord Bot Token
- Discord Client ID
- Website URL

It will generate a secure API token for you.

### 5. Configure Website

Copy the `BOT_API_TOKEN` from the setup output and add it to your website's environment variables:

\`\`\`env
BOT_API_TOKEN=the_generated_token_here
\`\`\`

Then redeploy your website.

### 6. Invite Bot to Your Server

Use the invite link provided by the setup wizard, or create one manually:

\`\`\`
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=274877991936&scope=bot%20applications.commands
\`\`\`

Replace `YOUR_CLIENT_ID` with your Discord Client ID.

### 7. Start the Bot

\`\`\`bash
npm start
\`\`\`

You should see:
\`\`\`
✅ Bot logged in as YourBot#1234
📊 Monitoring X server(s)
🔄 Auto-update enabled (every 10 minutes)
\`\`\`

## Commands

### `/bump`
Bump your server in the alliance directory to boost visibility.

**Cooldown:** 2 hours

**Example:**
\`\`\`
User: /bump
Bot: 🚀 Server Bumped!
     Your server has been bumped in the alliance directory!
     
     Bumped By: @Username
     Total Bumps: 5
     Next Bump: In 2h 0m
\`\`\`

### `/stats`
View your server's current statistics.

**Example:**
\`\`\`
User: /stats
Bot: 📊 My Server Statistics
     
     Total Members: 1,500
     Online Members: 450
     Server ID: 123456789012345678
\`\`\`

### `/alliance`
Get information about the Unified Realms Alliance.

**Example:**
\`\`\`
User: /alliance
Bot: ⚔️ Unified Realms Alliance
     An alliance of Discord servers united for mutual growth...
     
     🌐 Website: https://unified-realms.vercel.app
     🚀 Bump System: Use /bump every 2 hours...
\`\`\`

## Automatic Features

### Stats Updates
Every 10 minutes, the bot automatically:
- Counts total members in each server
- Counts online members
- Sends updates to the website
- Logs the update in console

**Console Output:**
\`\`\`
🔄 Updating stats for 3 server(s)...
✅ Updated stats for My Server: 1500 members (450 online)
✅ Updated stats for Another Server: 800 members (200 online)
\`\`\`

### Bump Tracking
When someone uses `/bump`:
- Verifies 2-hour cooldown hasn't expired
- Records who bumped and when
- Updates server position on website
- Shows next available bump time

## Configuration

All settings are in `.env`:

\`\`\`env
# Required
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
WEBSITE_URL=https://your-website.com
BOT_API_TOKEN=generated_secure_token

# Optional
AUTO_UPDATE_INTERVAL=600000    # 10 minutes in milliseconds
LOG_LEVEL=info                 # info, debug, error
\`\`\`

### Update Interval

Change how often stats update:
- `300000` = 5 minutes
- `600000` = 10 minutes (default)
- `900000` = 15 minutes
- `1800000` = 30 minutes

## Troubleshooting

### Bot won't start

**Error:** Missing environment variables
- Run `npm run setup` again
- Make sure `.env` file exists

**Error:** Invalid token
- Get a new token from Discord Developer Portal
- Make sure you copied the entire token

### Commands not showing

- Wait a few minutes for Discord to register commands
- Try kicking and re-inviting the bot
- Check that bot has proper permissions

### Stats not updating

**Check console for errors:**
\`\`\`
⚠️ Failed to update My Server: Auto-updates disabled
\`\`\`
- Server owner needs to enable auto-updates in their dashboard

**Error:** 401 Unauthorized
- Make sure `BOT_API_TOKEN` matches on both bot and website
- Redeploy website after adding token

### Bump cooldown issues

**Error:** "You can bump again in 1h 30m"
- This is normal - 2 hour cooldown between bumps
- Wait for cooldown to expire

## Development

### Run in development mode
\`\`\`bash
npm start
\`\`\`

### View detailed logs
Set `LOG_LEVEL=debug` in `.env`

### Test API endpoints
\`\`\`bash
# Test stats update
curl -X POST http://localhost:3000/api/bot/update-stats \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"serverId":"123","memberCount":1500}'
\`\`\`

## Support

- Website: https://unified-realms.vercel.app
- Discord: Join the main alliance server
- Issues: Report on GitHub

## License

MIT License - See LICENSE file for details
\`\`\`

Now let's add the server removal feature to the admin panel:
