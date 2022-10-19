import { NexClient } from '#core/NexClient';
import { NexCommand } from '#core/NexCommand';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import { stripIndents } from 'common-tags';

export class AenexCommand extends NexCommand {
	declare public interaction: ChatInputCommandInteraction;

	constructor(client?: NexClient) {
		super(client);
	}

	buildApplicationCommand() {
		return new SlashCommandBuilder()
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
	}

	async executeApplicationCommand(interaction: ChatInputCommandInteraction) {
		this.interaction = interaction;
		const subCommandName = this.interaction.options.getSubcommand();

		if (subCommandName === 'user') {
			await this.handleSubcommandUser();
		}
		if (subCommandName === 'server') {
			await this.handleSubcommandServer();
		}
		if (subCommandName === 'bot') {
			await this.handleSubcommandBot();
		}
	}

	async handleSubcommandUser() {
		const user = this.interaction.options.getUser('target');

		const embed = new EmbedBuilder()
			.setTitle('User Information')
			.setDescription(stripIndents`
			Username: ${user?.username}
			Discriminator: #${user?.discriminator}
		`);

		await this.interaction.reply({
			content: '',
			embeds: [embed],
		});
	}

	async handleSubcommandServer() {
		const guild = this.interaction.guild;

		const embed = new EmbedBuilder()
			.setTitle('Server Information')
			.setDescription(stripIndents`
			Server Name: ${guild?.name}
			Owner Name: ${(await guild?.fetchOwner())?.user.username}
		`);

		await this.interaction.reply({
			content: '',
			embeds: [embed],
		});
	}

	async handleSubcommandBot() {
		const bot = this.client?.user;

		const embed = new EmbedBuilder()
			.setTitle('Bot Informations')
			.setDescription(stripIndents`
			Bot Name: ${bot?.username}
			Discriminator: ${bot?.discriminator}
		`);

		await this.interaction.reply({
			content: '',
			embeds: [embed],
		});
	}
}