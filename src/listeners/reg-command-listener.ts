import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';
import Accounts from '@/models/accounts';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import AccountDto from '@/data-transfer-objects/models/account-dto';

class RegCommandListener extends BaseListener {
  getEventTrigger(): RegExp | TelegramBot.MessageType {
    return /^\/re[dg] (\d+)/gi;
  }

  protected async handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    match: RegExpExecArray,
    _metadata: TelegramBot.Metadata,
  ): Promise<void> {
    const id = Number.parseInt(match[1], 10);

    const accountsModel = new Accounts();
    const accountsTable = accountsModel.getTable();
    const result = accountsTable.findOne({
      chat_id : message.chat.id,
      id      : id,
    } as object);

    if (!result) {
      const accountDto = new AccountDto();
      accountDto.activated_promos = [];
      accountDto.error_promos = [];
      accountDto.id = id;
      accountDto.disabled = false;
      accountDto.chat_id = message.chat.id;

      accountsTable.insertOne(accountDto);

      await bot.sendMessage(message.chat.id, 'Пользователь добавлен!');
      Logger.info(`User ${id} was added in chat ${message.chat.id} by user ${message.from.id}`, LogTagEnum.Handler);

      return;
    }

    const accountDto = accountsModel.formDto(result) as AccountDto;
    if (!accountDto.disabled) {
      Logger.warning(`User ${message.from.id} tried to add existing user ${id} in chat ${message.chat.id}`, LogTagEnum.Handler);

      await bot.sendMessage(message.chat.id, 'Пользователь уже был добавлен!');
      return;
    }

    accountDto.disabled = false;
    accountsTable.update(accountDto);

    await bot.sendMessage(message.chat.id, 'Пользователь добавлен!');
    Logger.info(`User ${id} was updated (disabled = false) in chat ${message.chat.id} by user ${message.from.id}`, LogTagEnum.Handler);
  }

  isOnText(): boolean {
    return true;
  }
}

export default RegCommandListener;
