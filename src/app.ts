import dotenv from 'dotenv'
import { GatewayIntentBits } from 'discord.js'
import { NexClient } from '#core/client'
import { registerCommands, registerEvents } from '#core/registry'

dotenv.config()

const client = new NexClient({
    intents: [GatewayIntentBits.Guilds]
})

registerEvents(client)
registerCommands(client)

client.login(process.env.TOKEN)