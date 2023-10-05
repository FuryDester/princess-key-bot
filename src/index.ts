import 'module-alias/register';

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env') });

import '@/exceptions/handler';

import { databaseClient } from '@/wrappers/database-client';
import Logger from '@/wrappers/logger';
import * as process from 'process';
import { config as appConfig } from '@/config';
import listeners from '@/listeners/listeners';

// Exit listeners
let onExitCalled = false;
const onExit = () => {
  if (!onExitCalled) {
    onExitCalled = true;

    Logger.info('Stopping...');

    databaseClient.close();
  }
};

databaseClient.afterAvailability(async () => {
  Logger.info('Starting up...');
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
