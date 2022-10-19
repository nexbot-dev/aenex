import { NexCommand } from '#core/NexCommand';
import readDirectory from '#libs/readDirectory';
import { URL } from 'node:url';

export default async function getCommands() {
	const commands = [];

	const { directoryPath, filteredFiles } = await readDirectory('./../commands');

	for (const file of filteredFiles) {
		const filePath = new URL(`./commands/${file}`, directoryPath).href;
		const { AenexCommand } = await import(filePath);
		const command: NexCommand = new AenexCommand();

		commands.push(command.buildApplicationCommand?.().toJSON());
	}

	return commands;
}