import { Client, type ClientOptions, Collection } from 'discord.js';
import { NexCommand } from '#core/command';
import { Registry } from '#core/registry';

export class NexClient extends Client {
	commands: Collection<string, NexCommand>;
	registry: Registry;

	constructor(options: ClientOptions) {
		super(options);

		this.commands = new Collection();
		this.registry = new Registry(this);
	}
}