import * as TelegramBot from 'node-telegram-bot-api';
import { client } from '@/index';

export const isUserAdmin = async (message: TelegramBot.Message): Promise<boolean> => {
  const userData = await client.getChatMember(message.chat.id, message.from.id);
  return ['administrator', 'creator'].includes(userData.status);
};
