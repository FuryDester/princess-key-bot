import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';

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

      await bot.sendMessage(
        message.chat.id,
        `@${user.username}, приветствую! Для регистрации аккаунта введите команду: <b>/reg #ID (Пример: /reg 1014003978)</b>`,
        { parse_mode: 'HTML' },
      );
      Logger.info(`Sent hello message to chat ${message.chat.id} to user ${user.id} (${user.username})`, LogTagEnum.Handler);
    }
  }

  isOnText(): boolean {
    return false;
  }
}

export default NewChatMemberListener;
