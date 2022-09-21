import {
    Client,
    type ClientOptions,
    Collection
} from 'discord.js'
import type { CommandType } from './registry'

export class NexClient extends Client {
    commands: Collection<string, CommandType>

    constructor(options: ClientOptions) {
        super(options)
        this.commands = new Collection()
    }
}