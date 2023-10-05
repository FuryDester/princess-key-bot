import TelegramBot from 'node-telegram-bot-api';
import Promos from '@/models/promos';
import PromoDto from '@/data-transfer-objects/models/promo-dto';
import * as moment from 'moment/moment';
import Accounts from '@/models/accounts';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import AccountDto from '@/data-transfer-objects/models/account-dto';
import WebClient from '@/wrappers/web-client';

export const massPromoActivate = async (promoText: string, message: TelegramBot.Message, bot: TelegramBot): Promise<void> => {
  const promosModel = new Promos();
  const promosTable = promosModel.getTable();

  const promoData = promosTable.findOne({
    chat_id : message.chat.id,
    promo   : promoText,
  } as object);

  const promo = promoData ? (promosModel.formDto(promoData) as PromoDto) : new PromoDto();
  if (!promoData) {
    promo.created_at = moment().unix();
    promo.promo = promoText;
    promo.chat_id = message.chat.id;

    promosTable.insertOne(promo);
  }

  promo.updated_at = moment().unix();
  promosTable.update(promo);

  const accountsModel = new Accounts();
  const accountsTable = accountsModel.getTable();
  const accountsData = accountsTable.find({
    chat_id          : message.chat.id,
    disabled         : false,
    activated_promos : { $where: ((array: string[]) => array.indexOf(promoText) === -1) },
  } as object);

  if (!accountsData.length) {
    Logger.warning(`No account found for activating promo ${promoText} in chat ${message.chat.id} by user ${message.from.id}`, LogTagEnum.Handler);

    await bot.sendMessage(
      message.chat.id,
      `Не найдены аккаунты, которым необходимо активировать промокод "<b>${promoText}</b>"!`,
      { parse_mode: 'HTML' },
    );
    return;
  }

  Logger.info(
    `Activating promo ${promoText} in chat ${message.chat.id} by user ${message.from.id} for ${accountsData.length} users`,
    LogTagEnum.Handler,
  );
  await bot.sendMessage(
    message.chat.id,
    `Активация промокода "${promoText}" для ${accountsData.length} участник${accountsData.length === 1 ? 'а' : 'ов'}...`,
  );

  const accounts = accountsModel.formDtos(accountsData) as AccountDto[];

  const startTime = moment().unix();
  const promises = accounts.map(async (account): Promise<boolean> => {
    const web = new WebClient(account.id, promoText);

    const result = await web.activatePromo();
    if (!result) {
      if (!account.error_promos.includes(promoText)) {
        account.error_promos.push(promoText);
        accountsTable.update(account);
      }

      return false;
    }

    if (result.code === -1 && result.msg.endsWith('.[-54]')) {
      account.activated_promos.push(promoText);
      accountsTable.update(account);

      return true;
    }

    const returnData = result.code === 0;
    if (!returnData && !account.error_promos.includes(promoText)) {
      account.error_promos.push(promoText);
    } else if (returnData) {
      account.activated_promos.push(promoText);
    }

    accountsTable.update(account);
    return returnData;
  });

  const results = await Promise.all(promises);
  const totalTime = moment().unix() - startTime;

  const successCount = results.filter(Boolean).length;

  const text =
    `Промокод успешно активирован на <b>${successCount}</b> `
    + `аккаунт${successCount === 1 ? 'е' : 'ах'} из <b>${accounts.length}</b>`
    + ` <b>(${successCount}/${accounts.length}, ${totalTime} сек.)</b>`;

  await bot.sendMessage(message.chat.id, text, { parse_mode: 'HTML' });
  Logger.info(
    `Activated promo ${promoText} in chat ${message.chat.id} (${successCount}/${accounts.length}) by user ${message.from.id} in ${totalTime}`,
    LogTagEnum.Handler,
  );
};
