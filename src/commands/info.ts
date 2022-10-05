import { NexClient } from '#core/client';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import { stripIndents } from 'common-tags';

function buildInfoCommand() {
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

async function executeInfoCommand(interaction: ChatInputCommandInteraction, client: NexClient) {
	const subCommandName = interaction.options.getSubcommand();

	if (subCommandName === 'user') {
		await handleUserSubcommand(interaction);
	}
	if (subCommandName === 'server') {
		await handleServerSubcommand(interaction);
	}
	if (subCommandName === 'bot') {
		await handleBotSubcommand(interaction, client);
	}
}

async function handleUserSubcommand(interaction: ChatInputCommandInteraction) {
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

async function handleServerSubcommand(interaction: ChatInputCommandInteraction) {
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

async function handleBotSubcommand(interaction: ChatInputCommandInteraction, client: NexClient) {
	const bot = client.user;

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

export {
	buildInfoCommand as metadata,
	executeInfoCommand as execute,
};