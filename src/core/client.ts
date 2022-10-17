import {
	Client,
	type ClientOptions,
	Collection,
} from 'discord.js';
import { NexCommand } from './command';

export class NexClient extends Client {
	commands: Collection<string, NexCommand>;

	constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection();
	}
}