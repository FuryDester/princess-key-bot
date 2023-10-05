import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';
import Promos from '@/models/promos';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import PromoDto from '@/data-transfer-objects/models/promo-dto';

class UcShortCommandListener extends BaseListener {
  getEventTrigger(): RegExp | TelegramBot.MessageType {
    return /^\/uc short/gi;
  }

  protected async handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    _match: RegExpExecArray,
    _metadata: TelegramBot.Metadata,
  ): Promise<void> {
    const promosModel = new Promos();
    const promosTable = promosModel.getTable();

    const promosData = promosTable.find({
      chat_id: message.chat.id,
    } as object);

    if (!promosData.length) {
      Logger.warning(
        `No promos were used but command (uc short) was written by user ${message.from.id} in chat ${message.chat.id}`,
        LogTagEnum.Handler,
      );

      await bot.sendMessage(message.chat.id, 'К сожалению, ещё ни один промокод не был активирован!');
      return;
    }

    const promos = promosModel.formDtos(promosData) as PromoDto[];

    Logger.info(
      `Giving out total promos activated number (${promos.length}) by user ${message.from.id} in chat ${message.chat.id}`,
      LogTagEnum.Handler,
    );

    const promosList = promos.map((item) => item.promo).join(', ');
    await bot.sendMessage(
      message.chat.id,
      `Всего активировано промокодов: <b>${promos.length}</b>\n${promosList}`,
      { parse_mode: 'HTML' },
    );
  }

  isOnText(): boolean {
    return true;
  }
}

export default UcShortCommandListener;
