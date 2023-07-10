import { AenexClient } from '#core/AenexClient';
import { Command } from '@nexbot/nex-framework';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import { stripIndents } from 'common-tags';

export class AppCommand extends Command {
	declare client: AenexClient;

	constructor(client: AenexClient) {
		super(client);
	}

	buildAppCommand() {
		const slashCommand = new SlashCommandBuilder()
			.setName('info')
			.setDescription('Checks information of a user, a server, or the bot.')
			.addSubcommand(subcommand => subcommand
				.setName('user')
				.setDescription('Checks a user\'s information.')
				.addUserOption(option => option
					.setName('target')
					.setDescription('The user account to check.')
					.setRequired(true),
				),
			)
			.addSubcommand(subcommand => subcommand
				.setName('server')
				.setDescription('Checks current server\'s information.'),
			)
			.addSubcommand(subcommand => subcommand
				.setName('bot')
				.setDescription('Checks this bot\'s information.'),
			);

		return slashCommand as SlashCommandBuilder;
	}

	async executeAppCommand(interaction: ChatInputCommandInteraction) {
		const subCommandName = interaction.options.getSubcommand();

		if (subCommandName === 'user') {
			await this.handleSubcommandUser(interaction);
		}
		if (subCommandName === 'server') {
			await this.handleSubcommandServer(interaction);
		}
		if (subCommandName === 'bot') {
			await this.handleSubcommandBot(interaction);
		}
	}

	async handleSubcommandUser(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('target');

		const embed = new EmbedBuilder()
			.setTitle('User Information')
			.setDescription(stripIndents`
				Username: ${user?.username}
				Discriminator: #${user?.discriminator}
			`);

		await interaction.reply({
			content: '',
			embeds: [embed],
		});
	}

	async handleSubcommandServer(interaction: ChatInputCommandInteraction) {
		const guild = interaction.guild;

		const embed = new EmbedBuilder()
			.setTitle('Server Information')
			.setDescription(stripIndents`
				Server Name: ${guild?.name}
				Owner Name: ${(await guild?.fetchOwner())?.user.username}
			`);

		await interaction.reply({
			content: '',
			embeds: [embed],
		});
	}

	async handleSubcommandBot(interaction: ChatInputCommandInteraction) {
		const bot = this.client?.user;

		const embed = new EmbedBuilder()
			.setTitle('Bot Informations')
			.setDescription(stripIndents`
				Bot Name: ${bot?.username}
				Discriminator: ${bot?.discriminator}
			`);

		await interaction.reply({
			content: '',
			embeds: [embed],
		});
	}
}