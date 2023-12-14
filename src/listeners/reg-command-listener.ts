import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';
import Accounts from '@/models/accounts';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import AccountDto from '@/data-transfer-objects/models/account-dto';

class RegCommandListener extends BaseListener {
  getEventTrigger(): RegExp | TelegramBot.MessageType {
    return /^\/re[dg] (.+)/gi;
  }

  protected async handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    match: RegExpExecArray,
    _metadata: TelegramBot.Metadata,
  ): Promise<void> {
    const ids = match[1].split(/\D+/).map(Number);
    for (const currentId of ids) {
      const accountsModel = new Accounts();
      const accountsTable = accountsModel.getTable();
      const result = accountsTable.findOne({
        chat_id : message.chat.id,
        id      : currentId,
      } as object);

      const totalUsers = accountsTable.count({
        chat_id: message.chat.id,
      } as object);

      const activeUsers = accountsTable.count({
        chat_id  : message.chat.id,
        disabled : false,
      } as object);

      if (!result) {
        const accountDto = new AccountDto();
        accountDto.activated_promos = [];
        accountDto.error_promos = [];
        accountDto.id = currentId;
        accountDto.disabled = false;
        accountDto.chat_id = message.chat.id;

        accountsTable.insertOne(accountDto);

        await bot.sendMessage(message.chat.id, `Пользователь добавлен! <b>(${activeUsers + 1}/${totalUsers + 1})</b>`, { parse_mode: 'HTML' });
        Logger.info(`User ${currentId} was added in chat ${message.chat.id} by user ${message.from.id}`, LogTagEnum.Handler);

        continue;
      }

      const accountDto = accountsModel.formDto(result) as AccountDto;
      if (!accountDto.disabled) {
        Logger.warning(`User ${message.from.id} tried to add existing user ${currentId} in chat ${message.chat.id}`, LogTagEnum.Handler);

        await bot.sendMessage(
          message.chat.id,
          `Пользователь <b>${currentId}</b> уже был добавлен! <b>(${activeUsers}/${totalUsers})</b>`,
          { parse_mode: 'HTML' },
        );
        continue;
      }

      accountDto.disabled = false;
      accountsTable.update(accountDto);

      await bot.sendMessage(
        message.chat.id,
        `Пользователь <b>${currentId}</b> добавлен! <b>(${activeUsers + 1}/${totalUsers})</b>`,
        { parse_mode: 'HTML' },
      );
      Logger.info(`User ${currentId} was updated (disabled = false) in chat ${message.chat.id} by user ${message.from.id}`, LogTagEnum.Handler);
    }
  }

  isOnText(): boolean {
    return true;
  }
}

export default RegCommandListener;
