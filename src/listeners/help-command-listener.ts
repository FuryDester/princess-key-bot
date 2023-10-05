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
      '<b>Сводка по командам:</b>\n\n'
      + '/reg #ID - Регистрация учётной записи\n'
      + '/del #ID - Удаление учётной записи\n'
      + '/uc short - Получение информации по активированным промокодам через бота\n'
      + '/uc #CODE - Получение информации о статусе активации промокода через бота (хотя бы раз)\n'
      + '/code #CODE - Активация промокода <b>(только для администратора)</b>',
      { parse_mode: 'HTML' },
    );
  }

  isOnText(): boolean {
    return true;
  }
}

export default HelpCommandListener;
