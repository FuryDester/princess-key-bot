import { BotCommand } from 'node-telegram-bot-api';

interface Config {
  commands: BotCommand[],
}

export const config: Config = {
  commands: [
    {
      command     : '/reg',
      description : '#ID - Регистрация учётной записи (только для администратора)',
    },
    {
      command     : '/del',
      description : '#ID - Удаление учётной записи (только для администратора)',
    },
    {
      command     : '/uc',
      description : '(short, #CODE) - получение информации по активированным промокодам через бота',
    },
    {
      command     : '/code',
      description : 'Активация промокода (только для администратора)',
    },
    {
      command     : '/help',
      description : 'Вызов подсказки по командам',
    },
  ],
};