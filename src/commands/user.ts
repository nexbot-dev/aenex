import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

function BuildUserCommand() {
    const data = new SlashCommandBuilder()
        .setName('user')
        .setDescription('Checks user\'s account information.')

    return data
}

async function ExecuteUserCommand(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Henlo')
}

export {
    BuildUserCommand as metadata,
    ExecuteUserCommand as execute
}