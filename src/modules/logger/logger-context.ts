import { AsyncLocalStorage } from 'async_hooks';

interface LoggerContext {
  uuid: string;
  controllerName: string;
  methodName: string;
}

export const loggerContextStorage = new AsyncLocalStorage<LoggerContext>();

export function setLoggerContext(context: LoggerContext) {
  loggerContextStorage.enterWith(context);
}

export function getLoggerContext(): LoggerContext | undefined {
  return loggerContextStorage.getStore();
}
