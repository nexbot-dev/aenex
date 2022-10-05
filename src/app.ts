import dotenv from 'dotenv';
import { GatewayIntentBits } from 'discord.js';
import { NexClient } from '#core/client';
import { registerCommands, registerEvents } from '#core/registry';

dotenv.config();

(function main() {
	const botToken = process.env.DISCORD_BOT_TOKEN;

	if (!botToken) return;

	const client = new NexClient({
		intents: [GatewayIntentBits.Guilds],
	});

	registerEvents(client);
	registerCommands(client);

	client.login(botToken);
})();