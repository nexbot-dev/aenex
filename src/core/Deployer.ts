import { REST, Routes, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { readDirectory, Command } from '@nexbot/nex-framework';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import config from '#root/config';

export class Deployer {
	private readonly token: string;
	private readonly commands: Array<RESTPostAPIApplicationCommandsJSONBody>;
	private readonly rest: REST;

	public constructor(token: string) {
		this.token = token;
		this.commands = [];
		this.rest = new REST({
			version: '10',
		}).setToken(this.token);

		return this;
	}

	public async loadCommands() {
		const { directoryPath, filteredFiles } = await readDirectory({
			directory: './commands',
			extFilter: 'js',
		});

		for (const file of filteredFiles) {
			const filePath = pathToFileURL(join(directoryPath, file)).href;
			const { AppCommand } = await import(filePath);
			const command: Command = new AppCommand();

			if (command.buildAppCommand?.() === undefined) continue;

			this.commands.push(command.buildAppCommand().toJSON());
		}

		return this;
	}

	public deployToGlobal() {
		this.rest
			.put(Routes.applicationCommands(config.clientId), {
				body: this.commands,
			})
			.then(() => (
				console.log('Successfully registered global application commands.')
			))
			.catch(console.error);
	}

	public deployToServer() {
		for (const guild of config.guilds) {
			this.rest
				.put(Routes.applicationGuildCommands(config.clientId, guild.guildId), {
					body: this.commands,
				})
				.then(() => (
					console.log(`Successfully registered application commands in ${guild.guildName}.`)
				))
				.catch(console.error);
		}
	}
}