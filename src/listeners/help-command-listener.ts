import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';

class HelpCommandListener extends BaseListener {
  getEventTrigger(): RegExp | TelegramBot.MessageType {
    return /^\/help.?/gi;
  }

  protected async handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    _match: RegExpExecArray,
    _metadata: TelegramBot.Metadata,
  ): Promise<void> {
    await bot.sendMessage(
      message.chat.id,
      'Ну типа помощь',
    );
  }

  isOnText(): boolean {
    return true;
  }
}

export default HelpCommandListener;
