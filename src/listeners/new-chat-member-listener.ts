import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import { getRandomNumber } from '@/helpers/get-random-number';

class NewChatMemberListener extends BaseListener {
  getEventTrigger(): RegExp | TelegramBot.MessageType {
    return 'new_chat_members';
  }

  protected async handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    _match: RegExpExecArray,
    _metadata: TelegramBot.Metadata,
  ): Promise<void> {
    for (const user of message.new_chat_members) {
      if (user.is_bot) {
        continue;
      }

      const number = getRandomNumber(1000000000, 1999999999);
      const userName = user.username
        ? `@${user.username}`
        : user.first_name || user.id;

      const messageText =
        `${userName}, приветствую! Для регистрации аккаунта введите команду: <b>/reg #ID (Пример: /reg ${number})</b>`
        + '\n\n<b>Обращаем ваше внимание, что вы также можете зарегистрировать сразу несколько аккаунтов, прописав их через запятую, либо иной'
        + ` разделитель (пробел, точка с запятой, буква и тд)</b>\n\nПример:\n${this.generateExample()}`;

      await bot.sendMessage(message.chat.id, messageText, { parse_mode: 'HTML' });
      Logger.info(`Sent hello message to chat ${message.chat.id} to user ${user.id} (${user.username})`, LogTagEnum.Handler);
    }
  }

  isOnText(): boolean {
    return false;
  }

  // Функция для генерации случайного примера регистрации
  private generateExample(): string {
    const identifiers = Array.from({ length: 4 }, () => getRandomNumber(100, 199));
    return `/reg ${identifiers.join()}\n/reg ${identifiers.join(' ')}\n/reg ${identifiers.join(';')}\n/reg ${identifiers.join('a')}`;
  }
}

export default NewChatMemberListener;
