import { NexClient } from '#core/client';
import { NexCommand } from '#core/command';
import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ComponentType,
} from 'discord.js';

const primary = new ButtonBuilder()
	.setCustomId('primary')
	.setLabel('Click me!')
	.setStyle(ButtonStyle.Primary);

const secondary = new ButtonBuilder()
	.setCustomId('secondary')
	.setLabel('Click me!')
	.setStyle(ButtonStyle.Success);

export class AenexCommand extends NexCommand {
	declare public interaction: ChatInputCommandInteraction;

	constructor(client?: NexClient) {
		super(client);
	}

	buildApplicationCommand() {
		return new SlashCommandBuilder()
			.setName('user')
			.setDescription('Checks user\'s account information.')
			.addSubcommand(subcommand => subcommand
				.setName('metadata')
				.setDescription('Metadata of a user')
				.addUserOption(option => option
					.setName('target')
					.setDescription('The user')
					.setRequired(true),
				),
			)
			.addSubcommand(subcommand => subcommand
				.setName('misc')
				.setDescription('Miscellaneous info')
				.addStringOption(option => option
					.setName('info_name')
					.setDescription('Name of the information')
					.addChoices(
						{ name: 'Funny', value: 'gif_funny' },
						{ name: 'Meme', value: 'gif_meme' },
						{ name: 'Movie', value: 'gif_movie' },
					),
				),
			);
	}

	async executeApplicationCommand(interaction: ChatInputCommandInteraction) {
		this.interaction = interaction;

		const subCommandName = this.interaction.options.getSubcommand();

		if (subCommandName === 'metadata') {
			return this.handleSubcommandMetadata();
		}
		else if (subCommandName === 'misc') {
			return this.handleSubcommandMiscellaneous();
		}
	}

	async handleSubcommandMetadata() {
		const user = this.interaction.options.getUser('target');

		if (!user) {
			return await this.interaction.reply(`Hello ${this.interaction.user.username}`);
		}

		await this.interaction.reply(`Hello ${user.username}`);
	}

	async handleSubcommandMiscellaneous() {
		const info = this.interaction.options.getString('info_name');

		if (info === null) {
			await this.interaction.reply('No input given');
			return;
		}

		const responses = new Map<string, string>()
			.set('gif_funny', 'FUNNY GIF')
			.set('gif_meme', 'MEME GIF')
			.set('gif_movie', 'MOVIE GIF');

		let row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(primary, secondary);

		await this.interaction.reply({ content: responses.get(info), components: [row] });

		const message = await this.interaction.fetchReply();

		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 60_000,
		});

		if (!collector) return;

		collector.on('collect', async i => {
			if (i.user.id !== this.interaction.user.id) {
				await i.reply({
					content: 'This button is not for you',
					ephemeral: true,
				});

				return;
			}

			if (i.customId === 'primary') {
				row = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(secondary);

				await i.update({ content: 'Primary clicked!', components: [row] });
			}
			if (i.customId === 'secondary') {
				row = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(primary);

				await i.update({ content: 'Secondary clicked!', components: [row] });
			}
		});

		collector.on('end', async collected => {
			console.log(`Collected ${collected.size} items`);
			await this.interaction.editReply({ content: `Collected ${collected.size} click`, components: [] });
		});
	}
}