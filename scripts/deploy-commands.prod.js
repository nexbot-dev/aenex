import dotenv from 'dotenv';
import { Deployer } from '../dist/core/Deployer.js';

dotenv.config();

(async function deployCommands() {
	const deployment = new Deployer(process.env.DISCORD_BOT_TOKEN);

	(await deployment.loadCommands()).deployToGlobal();
})();