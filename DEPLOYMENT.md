# Deployment Guide

## Website Deployment (Vercel)

The website is a Next.js application that deploys to Vercel automatically.

### Required Environment Variables

Set these in your Vercel project settings:

\`\`\`
SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DISCORD_WEBHOOK_URL=your_webhook_url
BOT_API_SECRET=your_secret_key
\`\`\`

### Deployment Steps

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

The `.vercelignore` file ensures the bot folder is not deployed with the website.

## Discord Bot Deployment (Separate)

The bot is located in the `/bot` folder and must be deployed separately.

### Bot Deployment Options

**Option 1: Railway.app**
1. Create new project on Railway
2. Connect GitHub repository
3. Set root directory to `/bot`
4. Add environment variables
5. Deploy

**Option 2: Heroku**
1. Create new Heroku app
2. Set buildpack to Node.js
3. Add environment variables
4. Deploy from `/bot` folder

**Option 3: VPS/Dedicated Server**
1. SSH into server
2. Clone repository
3. Navigate to `/bot` folder
4. Run `npm install`
5. Set up environment variables
6. Use PM2 to keep bot running: `pm2 start dist/index.js --name unified-realms-bot`

### Required Bot Environment Variables

\`\`\`
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
WEBSITE_API_URL=https://your-website.vercel.app
BOT_API_SECRET=same_as_website_secret
\`\`\`

## Database Setup

Run these SQL scripts in your Supabase SQL editor:

1. `scripts/create-auth-tokens-table.sql`
2. `scripts/add-auto-update-fields.sql`
3. `scripts/add-bump-tables.sql`

## Post-Deployment Checklist

- [ ] Website is accessible
- [ ] Admin panel login works
- [ ] Application form submits successfully
- [ ] User management dashboard works
- [ ] Bot is online in Discord
- [ ] Bot commands respond
- [ ] Bump system works with cooldowns
- [ ] Stats update automatically
- [ ] Leaderboard displays correctly
