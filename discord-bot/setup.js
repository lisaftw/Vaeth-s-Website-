const fs = require("fs")
const readline = require("readline")
const crypto = require("crypto")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim())
    })
  })
}

function generateSecureToken() {
  return crypto.randomBytes(32).toString("hex")
}

async function setup() {
  console.log("═══════════════════════════════════════════════════════")
  console.log("     🤖 Unified Realms Bot Setup Wizard")
  console.log("═══════════════════════════════════════════════════════\n")

  console.log("This wizard will help you configure your Discord bot.\n")
  console.log("You will need:")
  console.log("  1. Discord Bot Token (from Discord Developer Portal)")
  console.log("  2. Discord Client ID (Application ID)")
  console.log("  3. Your website URL\n")

  const discordToken = await question("Enter your Discord Bot Token: ")
  if (!discordToken) {
    console.error("❌ Bot token is required!")
    process.exit(1)
  }

  const clientId = await question("Enter your Discord Client ID: ")
  if (!clientId) {
    console.error("❌ Client ID is required!")
    process.exit(1)
  }

  const websiteUrl = await question("Enter your website URL (e.g., https://unified-realms.vercel.app): ")
  if (!websiteUrl) {
    console.error("❌ Website URL is required!")
    process.exit(1)
  }

  console.log("\n🔐 Generating secure API token...")
  const apiToken = generateSecureToken()

  const envContent = `# Discord Bot Configuration
DISCORD_BOT_TOKEN=${discordToken}
DISCORD_CLIENT_ID=${clientId}

# Website Configuration
WEBSITE_URL=${websiteUrl}
BOT_API_TOKEN=${apiToken}

# Optional Configuration
AUTO_UPDATE_INTERVAL=600000
LOG_LEVEL=info
`

  fs.writeFileSync(".env", envContent)

  console.log("\n✅ Configuration saved to .env file!")
  console.log("\n═══════════════════════════════════════════════════════")
  console.log("⚠️  IMPORTANT: Add this to your website environment variables:")
  console.log("═══════════════════════════════════════════════════════")
  console.log(`BOT_API_TOKEN=${apiToken}`)
  console.log("═══════════════════════════════════════════════════════\n")

  console.log("Next steps:")
  console.log("  1. Add BOT_API_TOKEN to your website .env")
  console.log("  2. Redeploy your website")
  console.log("  3. Run: npm install")
  console.log("  4. Run: npm start")
  console.log("\n📝 Invite your bot using this URL:")
  console.log(
    `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=274877991936&scope=bot%20applications.commands\n`,
  )

  rl.close()
}

setup().catch((error) => {
  console.error("❌ Setup failed:", error.message)
  process.exit(1)
})
