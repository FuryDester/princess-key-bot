import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';
import { config } from '@/config';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import { massPromoActivate } from '@/logic/mass-promo-activate';

class RepostCodeTextListener extends BaseListener {
  getEventTrigger(): RegExp | TelegramBot.MessageType {
    return 'text';
  }

  protected async handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    _match: RegExpExecArray,
    _metadata: TelegramBot.Metadata,
  ): Promise<void> {
    if (!message.forward_from_chat) {
      return;
    }

    const matches = [...message.text.matchAll(config.promo_text)][0];
    if (!matches) {
      return;
    }

    const promo = matches[1].toUpperCase().trim();
    if (!promo) {
      return;
    }

    Logger.info(`Found promo repost by user ${message.from.id} in chat ${message.chat.id}. Promo: ${promo}`, LogTagEnum.Handler);
    await bot.sendMessage(message.chat.id, `Найден промокод из репоста: <b>${promo}</b>.\nЗапускается процесс активации...`, { parse_mode: 'HTML' });

    await massPromoActivate(promo, message, bot);
  }

  isOnText(): boolean {
    return false;
  }
}

export default RepostCodeTextListener;
