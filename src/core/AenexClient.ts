import { NexClient } from '@nexbot/nex-framework';
import { SetDB } from '#databases/SetDB';

export class AenexClient extends NexClient {
	public db?: SetDB;
}