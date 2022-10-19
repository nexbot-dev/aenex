import dotenv from 'dotenv';
import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import config from '#root/config';
import getCommands from '#libs/getCommands';

dotenv.config();

(async function deployGlobalCommands() {
	const botToken = process.env.DISCORD_BOT_TOKEN;

	if (!botToken) return;

	const commands = await getCommands();

	const rest = new REST({
		version: '10',
	}).setToken(botToken);

	rest.put(Routes.applicationCommands(config.clientId), { body: commands })
		.then(() => console.log('Successfully registered global application commands.'))
		.catch(console.error);
})();