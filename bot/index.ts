import { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { config } from "dotenv"
import { BumpService } from "./services/bump-service"

config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})

const commands = [
  new SlashCommandBuilder()
    .setName("bump")
    .setDescription("Bump your server to increase visibility in the Unified Realms alliance"),

  new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View your server's statistics in the Unified Realms alliance"),

  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the top servers in the Unified Realms alliance"),

  new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register your server with the Unified Realms alliance")
    .addStringOption((option) =>
      option.setName("invite").setDescription("Your server's permanent invite link").setRequired(true),
    ),

  new SlashCommandBuilder().setName("info").setDescription("Get information about the Unified Realms alliance"),
].map((command) => command.toJSON())

// Register slash commands
async function registerCommands() {
  try {
    console.log("[Bot] Started refreshing application (/) commands.")

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!)

    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: commands,
    })

    console.log("[Bot] Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error("[Bot] Error registering commands:", error)
  }
}

client.once(Events.ClientReady, async (c) => {
  console.log(`[Bot] Ready! Logged in as ${c.user.tag}`)
  await registerCommands()
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const { commandName } = interaction

  try {
    switch (commandName) {
      case "bump":
        await handleBump(interaction)
        break
      case "stats":
        await handleStats(interaction)
        break
      case "leaderboard":
        await handleLeaderboard(interaction)
        break
      case "register":
        await handleRegister(interaction)
        break
      case "info":
        await handleInfo(interaction)
        break
      default:
        await interaction.reply({ content: "Unknown command", ephemeral: true })
    }
  } catch (error) {
    console.error(`[Bot] Error handling command ${commandName}:`, error)

    const errorMessage = "An error occurred while processing your command."

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true })
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true })
    }
  }
})

async function handleBump(interaction: any) {
  await interaction.deferReply()

  const guildId = interaction.guildId
  const userId = interaction.user.id

  if (!guildId) {
    await interaction.editReply({
      content: "This command can only be used in a server!",
    })
    return
  }

  const result = await BumpService.bump(guildId, userId)

  if (result.success) {
    const embed = new EmbedBuilder()
      .setTitle("Server Bumped!")
      .setDescription(result.message)
      .setColor(0xdc2626)
      .addFields(
        { name: "Total Bumps", value: result.bumpCount?.toString() || "0", inline: true },
        {
          name: "Next Bump",
          value: result.nextBumpTime ? `<t:${Math.floor(result.nextBumpTime.getTime() / 1000)}:R>` : "Unknown",
          inline: true,
        },
      )
      .setFooter({ text: "Unified Realms Alliance" })
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })
  } else {
    await interaction.editReply({
      content: result.message,
    })
  }
}

async function handleStats(interaction: any) {
  await interaction.deferReply()

  const guildId = interaction.guildId

  if (!guildId) {
    await interaction.editReply({
      content: "This command can only be used in a server!",
    })
    return
  }

  const stats = await BumpService.getBumpStats(guildId)

  if (!stats) {
    await interaction.editReply({
      content: "This server is not registered with the Unified Realms alliance. Use `/register` to join!",
    })
    return
  }

  const embed = new EmbedBuilder()
    .setTitle(`${stats.serverName} Statistics`)
    .setColor(0xdc2626)
    .addFields(
      { name: "Members", value: stats.members?.toString() || "0", inline: true },
      { name: "Total Bumps", value: stats.bumpCount?.toString() || "0", inline: true },
      { name: "Alliance Ranking", value: `#${stats.ranking}`, inline: true },
      {
        name: "Last Bump",
        value: stats.lastBump ? `<t:${Math.floor(new Date(stats.lastBump).getTime() / 1000)}:R>` : "Never",
        inline: false,
      },
    )
    .setFooter({ text: "Unified Realms Alliance" })
    .setTimestamp()

  await interaction.editReply({ embeds: [embed] })
}

async function handleLeaderboard(interaction: any) {
  await interaction.deferReply()

  const leaderboard = await BumpService.getLeaderboard(10)

  if (leaderboard.length === 0) {
    await interaction.editReply({
      content: "No servers found in the leaderboard.",
    })
    return
  }

  const description = leaderboard
    .map((server, index) => {
      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`
      return `${medal} **${server.name}** - ${server.bump_count || 0} bumps (${server.members || 0} members)`
    })
    .join("\n")

  const embed = new EmbedBuilder()
    .setTitle("Unified Realms Leaderboard")
    .setDescription(description)
    .setColor(0xdc2626)
    .setFooter({ text: "Unified Realms Alliance" })
    .setTimestamp()

  await interaction.editReply({ embeds: [embed] })
}

async function handleRegister(interaction: any) {
  await interaction.reply({
    content:
      "To register your server, please visit our website and submit an application: https://unifiedrealms.com/apply",
    ephemeral: true,
  })
}

async function handleInfo(interaction: any) {
  await interaction.reply({
    embeds: [
      {
        title: "Unified Realms Alliance",
        description:
          "The Unified Realms is an elite alliance of Discord servers working together to grow and support each other.",
        color: 0xdc2626,
        fields: [
          {
            name: "Website",
            value: "https://unifiedrealms.com",
            inline: true,
          },
          {
            name: "Commands",
            value:
              "`/bump` - Bump your server\n`/stats` - View statistics\n`/leaderboard` - View top servers\n`/register` - Register your server",
            inline: false,
          },
        ],
        footer: {
          text: "Unified Realms Alliance",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  })
}

// Error handling
client.on(Events.Error, (error) => {
  console.error("[Bot] Client error:", error)
})

process.on("unhandledRejection", (error) => {
  console.error("[Bot] Unhandled promise rejection:", error)
})

// Start the bot
client.login(process.env.DISCORD_BOT_TOKEN)

export { client }
