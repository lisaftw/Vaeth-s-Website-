require("dotenv").config()
const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, SlashCommandBuilder } = require("discord.js")
const fetch = require("node-fetch")

// Configuration
const config = {
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  websiteUrl: process.env.WEBSITE_URL,
  apiToken: process.env.BOT_API_TOKEN,
  updateInterval: Number.parseInt(process.env.AUTO_UPDATE_INTERVAL) || 600000, // 10 minutes default
}

// Validate configuration
if (!config.token || !config.clientId || !config.websiteUrl || !config.apiToken) {
  console.error("❌ Missing required environment variables!")
  console.error("Please run: npm run setup")
  process.exit(1)
}

// Create Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences],
})

// Slash commands
const commands = [
  new SlashCommandBuilder().setName("bump").setDescription("Bump your server in the Unified Realms Alliance directory"),

  new SlashCommandBuilder().setName("stats").setDescription("View your server statistics"),

  new SlashCommandBuilder().setName("alliance").setDescription("Get information about the Unified Realms Alliance"),
].map((command) => command.toJSON())

// Register slash commands
const rest = new REST({ version: "10" }).setToken(config.token)

async function registerCommands() {
  try {
    console.log("🔄 Registering slash commands...")
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands })
    console.log("✅ Slash commands registered successfully!")
  } catch (error) {
    console.error("❌ Error registering commands:", error)
  }
}

// Helper function to make API calls
async function callWebsiteAPI(endpoint, data) {
  try {
    const response = await fetch(`${config.websiteUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiToken}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return { success: response.ok, data: result, status: response.status }
  } catch (error) {
    console.error(`❌ API call failed: ${endpoint}`, error.message)
    return { success: false, error: error.message }
  }
}

// Format time remaining
function formatTimeRemaining(milliseconds) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// Handle bump command
async function handleBump(interaction) {
  await interaction.deferReply()

  const serverId = interaction.guild.id
  const userId = interaction.user.id

  // Call website API to bump server
  const result = await callWebsiteAPI("/api/bot/bump", {
    serverId,
    userId,
  })

  if (result.success && result.data.success) {
    const embed = new EmbedBuilder()
      .setColor("#ef4444")
      .setTitle("🚀 Server Bumped!")
      .setDescription(`**${interaction.guild.name}** has been bumped in the alliance directory!`)
      .addFields(
        { name: "Bumped By", value: `<@${userId}>`, inline: true },
        { name: "Total Bumps", value: `${result.data.totalBumps || 1}`, inline: true },
        { name: "Next Bump", value: result.data.nextBumpTime || "In 2 hours", inline: true },
      )
      .setTimestamp()
      .setFooter({ text: "Unified Realms Alliance" })

    await interaction.editReply({ embeds: [embed] })
    console.log(`🚀 Server bumped: ${interaction.guild.name} by ${interaction.user.tag}`)
  } else {
    const errorMessage = result.data?.message || "Failed to bump server"
    const timeRemaining = result.data?.timeRemaining

    let description = errorMessage
    if (timeRemaining) {
      description += `\n\n⏰ You can bump again in **${formatTimeRemaining(timeRemaining)}**`
    }

    const embed = new EmbedBuilder()
      .setColor("#f59e0b")
      .setTitle("⏳ Bump Cooldown")
      .setDescription(description)
      .setTimestamp()
      .setFooter({ text: "Unified Realms Alliance" })

    await interaction.editReply({ embeds: [embed] })
  }
}

// Handle stats command
async function handleStats(interaction) {
  await interaction.deferReply()

  const guild = interaction.guild
  const totalMembers = guild.memberCount
  const onlineMembers = guild.members.cache.filter((m) => m.presence?.status !== "offline").size

  const embed = new EmbedBuilder()
    .setColor("#3b82f6")
    .setTitle(`📊 ${guild.name} Statistics`)
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "Total Members", value: `${totalMembers}`, inline: true },
      { name: "Online Members", value: `${onlineMembers}`, inline: true },
      { name: "Server ID", value: `${guild.id}`, inline: true },
    )
    .setTimestamp()
    .setFooter({ text: "Unified Realms Alliance" })

  await interaction.editReply({ embeds: [embed] })
}

// Handle alliance info command
async function handleAlliance(interaction) {
  const embed = new EmbedBuilder()
    .setColor("#ef4444")
    .setTitle("⚔️ Unified Realms Alliance")
    .setDescription("An alliance of Discord servers united for mutual growth and collaboration.")
    .addFields(
      { name: "🌐 Website", value: config.websiteUrl, inline: false },
      { name: "🚀 Bump System", value: "Use `/bump` every 2 hours to boost your server visibility", inline: false },
      { name: "📊 Auto Stats", value: "Your server statistics update automatically every 10 minutes", inline: false },
    )
    .setTimestamp()
    .setFooter({ text: "Unified Realms Alliance" })

  await interaction.reply({ embeds: [embed] })
}

// Auto-update server stats
async function updateServerStats() {
  const guilds = client.guilds.cache

  console.log(`🔄 Updating stats for ${guilds.size} server(s)...`)

  for (const [guildId, guild] of guilds) {
    try {
      // Count members
      const totalMembers = guild.memberCount

      // Count online members (requires presence intent)
      let onlineMembers = 0
      try {
        onlineMembers = guild.members.cache.filter((m) => m.presence?.status && m.presence.status !== "offline").size
      } catch (e) {
        console.log(`⚠️ Could not count online members for ${guild.name}`)
      }

      // Send update to website
      const result = await callWebsiteAPI("/api/bot/update-stats", {
        serverId: guildId,
        memberCount: totalMembers,
        onlineMembers: onlineMembers,
      })

      if (result.success) {
        console.log(`✅ Updated stats for ${guild.name}: ${totalMembers} members (${onlineMembers} online)`)
      } else if (result.status === 403) {
        console.log(`⏭️ Auto-update disabled for ${guild.name}`)
      } else {
        console.log(`⚠️ Failed to update ${guild.name}: ${result.data?.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error(`❌ Error updating ${guild.name}:`, error.message)
    }
  }
}

// Bot ready event
client.once("ready", async () => {
  console.log("═══════════════════════════════════════")
  console.log(`✅ Bot logged in as ${client.user.tag}`)
  console.log(`📊 Monitoring ${client.guilds.cache.size} server(s)`)
  console.log(`🌐 Website: ${config.websiteUrl}`)
  console.log("═══════════════════════════════════════")

  // Register commands
  await registerCommands()

  // Start auto-update loop
  console.log(`🔄 Auto-update enabled (every ${config.updateInterval / 1000 / 60} minutes)`)

  // Initial update
  await updateServerStats()

  // Set interval for updates
  setInterval(updateServerStats, config.updateInterval)
})

// Handle slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  try {
    switch (interaction.commandName) {
      case "bump":
        await handleBump(interaction)
        break
      case "stats":
        await handleStats(interaction)
        break
      case "alliance":
        await handleAlliance(interaction)
        break
    }
  } catch (error) {
    console.error("❌ Error handling command:", error)

    const errorEmbed = new EmbedBuilder()
      .setColor("#ef4444")
      .setTitle("❌ Error")
      .setDescription("An error occurred while processing your command. Please try again later.")
      .setTimestamp()

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ embeds: [errorEmbed] })
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
    }
  }
})

// Handle guild join
client.on("guildCreate", (guild) => {
  console.log(`➕ Joined new server: ${guild.name} (${guild.id})`)
  console.log(`   Members: ${guild.memberCount}`)
})

// Handle guild leave
client.on("guildDelete", (guild) => {
  console.log(`➖ Left server: ${guild.name} (${guild.id})`)
})

// Error handling
client.on("error", (error) => {
  console.error("❌ Discord client error:", error)
})

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled promise rejection:", error)
})

// Login to Discord
client.login(config.token).catch((error) => {
  console.error("❌ Failed to login to Discord:", error.message)
  process.exit(1)
})
