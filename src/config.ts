import { BotCommand } from 'node-telegram-bot-api';

interface Config {
  commands: BotCommand[],
}

export const config: Config = {
  commands: [
  ],
};