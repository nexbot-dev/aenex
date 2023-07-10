import { NexClient, Event } from '@nexbot/nex-framework';
import type { Interaction } from 'discord.js';

export class AppEvent extends Event {
	constructor(client: NexClient) {
		super(client, {
			name: 'interactionCreate',
		});
	}

	async execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = this.client.commands.get(interaction.commandName);

		if (command === undefined) return;

		try {
			command.executeAppCommand?.(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
}