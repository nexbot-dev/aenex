import dotenv from 'dotenv';
import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import config from '#root/config';
import readDirectory from '#libs/readDirectory';
import { URL } from 'node:url';

dotenv.config();

(async function deployGuildCommands() {
	const botToken = process.env.DISCORD_BOT_TOKEN;

	if (!botToken) return;

	const commands = [];
	const { directoryPath, filteredFiles } = await readDirectory('./../commands');

	for (const file of filteredFiles) {
		const filePath = new URL(`./commands/${file}`, directoryPath).href;
		const { AenexCommand } = await import(filePath);
		const command = new AenexCommand();

		commands.push(command.buildApplicationCommand().toJSON());
	}

	const rest = new REST({
		version: '10',
	}).setToken(botToken);

	for (const guild of config.guilds) {
		rest.put(Routes.applicationGuildCommands(config.clientId, guild.guildId), { body: commands })
			.then(() => console.log(`Successfully registered application commands in ${guild.guildName}.`))
			.catch(console.error);
	}
})();