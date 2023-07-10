import { NexClient, Event } from '@nexbot/nex-framework';

export class AppEvent extends Event {
	constructor(client: NexClient) {
		super(client, {
			name: 'ready',
			once: true,
		});
	}

	async execute() {
		console.log(`Ready! Logged in as ${this.client.user?.tag}`);
	}
}