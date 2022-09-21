import { Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import config from '#root/config'
import readDirectory from '#libs/readDirectory'
import type { CommandType } from './registry'
import { URL } from 'node:url'

async function deployGuildCommands() {
    const commands = []
    const { directoryPath, filteredFiles } = await readDirectory('./../commands')

    for (const file of filteredFiles) {
        const filePath = new URL(`./commands/${file}`, directoryPath).href
        const command: CommandType = await import(filePath)

        commands.push(command.metadata().toJSON())
    }

    const rest = new REST({
        version: '10'
    }).setToken(config.token)

    rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error)
}

deployGuildCommands()