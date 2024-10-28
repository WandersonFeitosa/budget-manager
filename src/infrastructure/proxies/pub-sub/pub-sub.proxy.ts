import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class PubSubProxy {
  pubSubClient = new PubSub({
    keyFile: process.env.KEY_FILE,
  });
  constructor(private readonly logger: LoggerService) {}

  async publish(topic: string, message: any) {
    try {
      return this.pubSubClient
        .topic(topic)
        .publishMessage({ data: Buffer.from(JSON.stringify(message)) });
    } catch (error) {
      this.logger.error('Error publishing message', error);
      throw new Error('Error publishing message');
    }
  }
}
