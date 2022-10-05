import readDirectory from '#libs/readDirectory';
import type { NexClient } from './client';
import type { CommandInteraction, Interaction, SlashCommandBuilder } from 'discord.js';
import { URL } from 'node:url';

export interface EventType {
	metadata: {
		name: string,
		once?: boolean
	};
	execute: (client: NexClient, interaction: Interaction, ...args: unknown[]) => void;
}

export interface CommandType {
	metadata: () => SlashCommandBuilder;
	execute: (interaction: CommandInteraction, client: NexClient) => void;
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
		const command: CommandType = await import(filePath);

		client.commands.set(command.metadata().name, command);
	}
}