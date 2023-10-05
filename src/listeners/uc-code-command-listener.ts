import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';
import Promos from '@/models/promos';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import PromoDto from '@/data-transfer-objects/models/promo-dto';
import * as moment from 'moment';

class UcCodeCommandListener extends BaseListener {
  getEventTrigger(): RegExp | TelegramBot.MessageType {
    return /^\/uc (.+)/gi;
  }

  protected async handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    match: RegExpExecArray,
    _metadata: TelegramBot.Metadata,
  ): Promise<void> {
    const promosModel = new Promos();
    const promosTable = promosModel.getTable();

    const promoText = match[1].toUpperCase().trim();
    if (promoText === 'SHORT') {
      return;
    }

    const promoData = promosTable.findOne({
      chat_id : message.chat.id,
      promo   : promoText,
    } as object);

    if (!promoData) {
      Logger.info(
        `Promo ${promoText} was not activated (uc code) was written by user ${message.from.id} in chat ${message.chat.id}`,
        LogTagEnum.Handler,
      );

      await bot.sendMessage(message.chat.id, `Промокод "${promoText}" ещё не был активирован!`);
      return;
    }

    const promo = promosModel.formDto(promoData) as PromoDto;
    Logger.info(
      `Giving out promo ${promoText} information by user ${message.from.id} in chat ${message.chat.id}`,
      LogTagEnum.Handler,
    );

    await bot.sendMessage(
      message.chat.id,
      `Первая попытка активации была произведена: <b>${moment.unix(promo.created_at).format('DD.MM.YYYY HH:mm:ss')}</b>\n`
      + `Последняя попытка активации была произведена: <b></b>${moment.unix(promo.updated_at).format('DD.MM.YYYY HH:mm:ss')}</b>`,
      { parse_mode: 'HTML' },
    );
  }

  isOnText(): boolean {
    return true;
  }
}

export default UcCodeCommandListener;
