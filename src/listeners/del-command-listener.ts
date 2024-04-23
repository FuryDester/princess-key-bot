import BaseListener from '@/listeners/base-listener';
import * as TelegramBot from 'node-telegram-bot-api';
import Accounts from '@/models/accounts';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import AccountDto from '@/data-transfer-objects/models/account-dto';

class RegCommandListener extends BaseListener {
  getEventTrigger(): RegExp | TelegramBot.MessageType {
    return /^\/del (\d+)/gi;
  }

  protected async handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    match: RegExpExecArray,
    _metadata: TelegramBot.Metadata,
  ): Promise<void> {
    const ids = match[1].split(/\D+/).map(Number);
    if (!ids.length) {
      await bot.sendMessage(message.chat.id, 'В команде не указан ни один идентификатор!');
      Logger.warning(`No correct IDs given! User: ${message.from.id}, chat: ${message.chat.id}`, LogTagEnum.Handler);

      return;
    }

    const accountsModel = new Accounts();
    const accountsTable = accountsModel.getTable();
    for (const id of ids) {
      if (id <= 0 || Number.isNaN(id)) {
        continue;
      }

      const result = accountsTable.findOne({
        chat_id : message.chat.id,
        id      : id,
      } as object);

      if (!result) {
        Logger.warning(`User ${message.from.id} tried to remove unexciting user ${id} in chat ${message.chat.id}`, LogTagEnum.Handler);

        await bot.sendMessage(message.chat.id, 'Пользователь не найден!');
        return;
      }

      const accountDto = accountsModel.formDto(result) as AccountDto;
      if (accountDto.disabled) {
        Logger.warning(`User ${message.from.id} tried to remove exciting disabled user ${id} in chat ${message.chat.id}`, LogTagEnum.Handler);

        await bot.sendMessage(message.chat.id, 'Пользователь не найден!');
        return;
      }

      accountDto.disabled = true;
      accountsTable.update(accountDto);

      const totalUsers = accountsTable.count({
        chat_id: message.chat.id,
      } as object);

      const activeUsers = accountsTable.count({
        chat_id  : message.chat.id,
        disabled : false,
      } as object);
      await bot.sendMessage(message.chat.id, `Пользователь удалён! <b>(${activeUsers}/${totalUsers})</b>`, { parse_mode: 'HTML' });
      Logger.info(`User ${id} was removed in chat ${message.chat.id} by user ${message.from.id}`, LogTagEnum.Handler);
    }
  }

  isOnText(): boolean {
    return true;
  }
}

export default RegCommandListener;
