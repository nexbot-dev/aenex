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

function buildUserCommand() {
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

async function executeUserCommand(interaction: ChatInputCommandInteraction) {
	const subCommandName = interaction.options.getSubcommand();

	if (subCommandName === 'metadata') {
		return handleMetadataSubCommand(interaction);
	}
	else if (subCommandName === 'misc') {
		return handleMiscellaneousSubCommand(interaction);
	}
}

async function handleMetadataSubCommand(interaction: ChatInputCommandInteraction) {
	const user = interaction.options.getUser('target');

	if (!user) {
		return await interaction.reply(`Hello ${interaction.user.username}`);
	}

	await interaction.reply(`Hello ${user.username}`);
}

async function handleMiscellaneousSubCommand(interaction: ChatInputCommandInteraction) {
	const info = interaction.options.getString('info_name');
	const responses = new Map<string, string>()
		.set('gif_funny', 'FUNNY GIF')
		.set('gif_meme', 'MEME GIF')
		.set('gif_movie', 'MOVIE GIF');

	const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(primary, secondary);

	if (info !== null && responses.has(info)) {
		await interaction.reply({ content: responses.get(info), components: [row] });
		await handleClickButton(interaction);
	}
	else {
		await interaction.reply('No input given');
	}
}

async function handleClickButton(interaction: ChatInputCommandInteraction) {
	const message = await interaction.fetchReply();

	const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 15_000,
	});

	if (!collector) return;

	collector.on('collect', async i => {
		await i.deferUpdate();

		if (i.user.id !== interaction.user.id) {
			await i.reply({
				content: 'This button is not for you',
				ephemeral: true,
			});

			return;
		}

		if (i.customId === 'primary') {
			const row = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(secondary);

			await i.update({ content: 'Primary clicked!', components: [row] });
		}
		if (i.customId === 'secondary') {
			const row = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(primary);

			await i.update({ content: 'Secondary clicked!', components: [row] });
		}
	});

	collector.on('end', async collected => {
		console.log(`Collected ${collected.size} items`);
		await interaction.editReply({ content: `Collected ${collected.size} click`, components: [] });
	});
}

export {
	buildUserCommand as metadata,
	executeUserCommand as execute,
};