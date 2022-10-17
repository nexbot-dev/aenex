import readDirectory from '#libs/readDirectory';
import type { NexClient } from './client';
import type { Interaction, SlashCommandBuilder } from 'discord.js';
import { URL } from 'node:url';
import { NexCommand } from './command';

export interface EventType {
	metadata: {
		name: string,
		once?: boolean
	};
	execute: (client: NexClient, interaction: Interaction, ...args: unknown[]) => void;
}

export interface CommandType {
	buildApplicationCommand: () => SlashCommandBuilder;
	executeApplicationCommand: NexCommand;
}

export async function registerEvents(client: NexClient) {
	const { directoryPath, filteredFiles } = await readDirectory('./../events');

	for (const file of filteredFiles) {
		const filePath = new URL(`./events/${file}`, directoryPath).href;
		const event: EventType = await import(filePath);

		if (event.metadata.once) {
			client.once(event.metadata.name, (...args) => event.execute(client, args[0], ...args));
		}
		else {
			client.on(event.metadata.name, (...args) => event.execute(client, args[0], ...args));
		}
	}
}

export async function registerCommands(client: NexClient) {
	const { directoryPath, filteredFiles } = await readDirectory('./../commands');

	for (const file of filteredFiles) {
		const filePath = new URL(`./commands/${file}`, directoryPath).href;
		const { AenexCommand } = await import(filePath);
		const command: NexCommand = new AenexCommand(client);

		if (command.buildApplicationCommand?.() === undefined) {
			return;
		}

		client.commands.set(command.buildApplicationCommand().name, command);
	}
}