import { Injectable, Logger } from '@nestjs/common';
import { getLoggerContext } from './logger-context';

@Injectable()
export class LoggerService {
  private logger: Logger = new Logger();

  constructor() {}

  private getContextInfo() {
    const context = getLoggerContext();
    return {
      uuid: context?.uuid || 'NO_UUID',
      controllerName: context?.controllerName || 'NO_CONTROLLER',
      methodName: context?.methodName || 'NO_METHOD',
    };
  }

  formatMessage(message: string): string {
    const { uuid } = this.getContextInfo();
    return `[${uuid}] ${message}`;
  }

  formatParams(params: Record<string, any>): string {
    const { uuid } = this.getContextInfo();
    const parsedParams = JSON.stringify(params, null);
    return `[${uuid}] ${parsedParams}`;
  }

  private logWithContext(
    logMethod: 'error' | 'log' | 'warn' | 'debug',
    message?: string,
    params?: Record<string, any>,
  ): void {
    const { controllerName, methodName } = this.getContextInfo();
    const method = `${controllerName}.${methodName}`;

    this.logger[logMethod](this.formatMessage(message), method);
    if (params) this.logger[logMethod](this.formatParams(params), method);
  }

  public error(message?: string | Error, params?: Record<string, any>): void {
    if (message instanceof Error) {
      this.logWithContext('error', '', params);
      console.error(message);
    } else {
      this.logWithContext('error', message, params);
    }
  }

  public log(message?: string, params?: Record<string, any>): void {
    this.logWithContext('log', message, params);
  }

  public warn(message?: string, params?: Record<string, any>): void {
    this.logWithContext('warn', message, params);
  }

  public debug(message?: string, params?: Record<string, any>): void {
    this.logWithContext('debug', message, params);
  }
}
