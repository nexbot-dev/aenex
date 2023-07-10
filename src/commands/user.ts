import { AenexClient } from '#core/AenexClient';
import { Command } from '@nexbot/nex-framework';
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

export class AppCommand extends Command {
	declare client: AenexClient;

	constructor(client: AenexClient) {
		super(client);
	}

	buildAppCommand() {
		const slashCommand = new SlashCommandBuilder()
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

		return slashCommand as SlashCommandBuilder;
	}

	async executeAppCommand(interaction: ChatInputCommandInteraction) {
		const subCommandName = interaction.options.getSubcommand();

		if (subCommandName === 'metadata') {
			return this.handleSubcommandMetadata(interaction);
		}
		else if (subCommandName === 'misc') {
			return this.handleSubcommandMiscellaneous(interaction);
		}
	}

	async handleSubcommandMetadata(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('target');

		if (!user) {
			return await interaction.reply(`Hello ${interaction.user.username}`);
		}

		await interaction.reply(`Hello ${user.username}`);
	}

	async handleSubcommandMiscellaneous(interaction: ChatInputCommandInteraction) {
		const info = interaction.options.getString('info_name');

		if (info === null) {
			await interaction.reply('No input given');
			return;
		}

		const responses = new Map<string, string>()
			.set('gif_funny', 'FUNNY GIF')
			.set('gif_meme', 'MEME GIF')
			.set('gif_movie', 'MOVIE GIF');

		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(primary, secondary);

		await interaction.reply({ content: responses.get(info), components: [row] });

		const message = await interaction.fetchReply();

		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 60_000,
		});

		if (!collector) return;

		collector.on('collect', async i => {
			if (i.user.id !== interaction.user.id) {
				await i.reply({
					content: 'This button is not for you',
					ephemeral: true,
				});

				return;
			}

			if (i.customId === 'primary') {
				row.setComponents(secondary);

				await i.update({ content: 'Primary clicked!', components: [row] });
			}
			if (i.customId === 'secondary') {
				row.setComponents(primary);

				await i.update({ content: 'Secondary clicked!', components: [row] });
			}
		});

		collector.on('end', async collected => {
			console.log(`Collected ${collected.size} items`);
			await interaction.editReply({ content: `Collected ${collected.size} click`, components: [] });
		});
	}
}