import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';
import { isUserAdmin } from '@/helpers/is-user-admin';
import { massPromoActivate } from '@/logic/mass-promo-activate';

class CodeCommandListener extends BaseListener {
  getEventTrigger(): RegExp | TelegramBot.MessageType {
    return /^\/code (.+)/gi;
  }

  protected async handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    match: RegExpExecArray,
    _metadata: TelegramBot.Metadata,
  ): Promise<void> {
    if (!await isUserAdmin(message)) {
      return;
    }

    const promo = match[1].toUpperCase().trim();

    await massPromoActivate(promo, message, bot);
  }

  isOnText(): boolean {
    return true;
  }
}

export default CodeCommandListener;
