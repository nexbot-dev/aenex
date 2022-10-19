import type { NexClient } from '#core/NexClient';

const MetadataReadyEvent = {
	name: 'ready',
	once: true,
};

function ExecuteReadyEvent(client: NexClient) {
	console.log(`Ready! Logged in as ${client.user?.tag}`);
}

export {
	MetadataReadyEvent as metadata,
	ExecuteReadyEvent as execute,
};