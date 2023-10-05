import 'module-alias/register';

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env') });

import '@/exceptions/handler';

import { databaseClient } from '@/wrappers/database-client';
import * as TelegramBot from 'node-telegram-bot-api';
import Logger from '@/wrappers/logger';
import * as process from 'process';
import listeners from '@/listeners/listeners';
import { config as appConfig } from '@/config';

export let client: TelegramBot;

// Exit listeners
let onExitCalled = false;
const onExit = () => {
  if (!onExitCalled) {
    onExitCalled = true;

    Logger.info('Stopping...');

    databaseClient.close();

    if (client) {
      client.close();
    }
  }
};

databaseClient.afterAvailability(async () => {
  Logger.info('Starting up...');

  const key = process.env.TELEGRAM_KEY;
  if (!key) {
    Logger.critical('Cannot find key in .env file!');
    process.exit(1);
  }

  client = new TelegramBot(key, { polling: true });

  try {
    const data = await client.getMe();
    if (!data.is_bot) {
      Logger.warning('Bot is running on simple user, not bot account!');
    }
  } catch (e) {
    Logger.critical('Invalid credentials given or server is not available!');
    process.exit(1);
  }

  Logger.info('Setting up event listeners');
  listeners.forEach((listener) => {
    if (listener.isOnText()) {
      client.onText(listener.getEventTrigger() as RegExp, listener.handleOnText);
    } else {
      client.on(listener.getEventTrigger() as TelegramBot.MessageType, listener.handleSimple);
    }

    Logger.info(`Added ${listener.isOnText() ? 'on text' : 'simple'} event with trigger ${listener.getEventTrigger()}`);
  });

  Logger.info('Adding commands');
  await client.setMyCommands(appConfig.commands);

  Logger.info('Bot setup completed!');
});

process.on('exit', () => {
  onExit();
});

process.on('SIGINT', () => {
  onExit();
  process.exit(0);
});

process.on('SIGUSR1', () => {
  onExit();
  process.exit(0);
});
process.on('SIGUSR2', () => {
  onExit();
  process.exit(0);
});
