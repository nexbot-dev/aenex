import dotenv from 'dotenv';
import { GatewayIntentBits } from 'discord.js';
import { AenexClient } from '#core/AenexClient';
import { SetDB } from '#databases/SetDB';

dotenv.config();

(async function main() {
	const botToken = process.env.DISCORD_BOT_TOKEN;

	if (!botToken) return;

	const client = new AenexClient({
		intents: [GatewayIntentBits.Guilds],
	});

	const registry = client.registry;

	registry.registerEvents('./events');
	registry.registerCommands('./commands');

	client.db = await SetDB.connect();

	client.login(botToken);
})();