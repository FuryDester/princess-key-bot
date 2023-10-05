import * as TelegramBot from 'node-telegram-bot-api';
import { client } from '@/index';

abstract class BaseListener {
  constructor() {
    this.handleSimple = this.handleSimple.bind(this);
    this.handleOnText = this.handleOnText.bind(this);
  }

  abstract getEventTrigger(): RegExp | TelegramBot.MessageType;

  abstract isOnText(): boolean;

  needToProcess(message: TelegramBot.Message): boolean {
    return !message.from.is_bot && ['supergroup', 'group'].includes(message.chat.type);
  }

  handleSimple(message: TelegramBot.Message, metadata: TelegramBot.Metadata): void {
    if (!this.needToProcess(message)) {
      return;
    }

    this.handleEvent(client, message, {} as RegExpExecArray, metadata);
  }

  handleOnText(message: TelegramBot.Message, match: RegExpExecArray): void {
    if (!this.needToProcess(message)) {
      return;
    }

    this.handleEvent(client, message, match, {});
  }

  protected abstract handleEvent(
    bot: TelegramBot,
    message: TelegramBot.Message,
    match: RegExpExecArray,
    metadata: TelegramBot.Metadata
  ): Promise<void>;
}

export default BaseListener;