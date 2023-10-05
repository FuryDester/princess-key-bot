import BaseException from '@/exceptions/custom-exceptions/base-exception';
import Logger from '@/wrappers/logger';
import * as process from 'process';

const exceptionHandlers = [];

interface ApiError {
  response: {
    error_msg: string;
  }
}

process.on('uncaughtException', (error: Error) => {
  let foundHandler = false;
  if (error instanceof BaseException) {
    exceptionHandlers.forEach((item) => {
      if (error instanceof item[0]) {
        new item[1](error as unknown as BaseException & string);
        foundHandler = true;
      }
    });
  }

  if (!foundHandler) {
    Logger.emergency(`Unhandled error: ${error.stack}, api message: ${(error as unknown as ApiError)?.response?.error_msg ?? ''}`);
    // TODO: Return?
    // process.exit(1);
  }
});