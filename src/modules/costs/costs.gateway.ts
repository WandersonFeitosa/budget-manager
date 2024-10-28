import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { LoggerService } from '../logger/logger.service';
import { RedisProxy } from 'src/infrastructure/proxies/redis/redis-proxy';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class CostsGateway {
  constructor(
    private readonly logger: LoggerService,
    private readonly redisService: RedisProxy,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Client connected');
      console.log('Client id is: ' + socket.id);
    });
  }

  @SubscribeMessage('getProducts')
  async getProducts(
    @MessageBody() data: { id: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const costs = await this.redisService.get(data.id);
      socket.emit('products', JSON.parse(costs));
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage('updateProducts')
  async updateProducts(
    @MessageBody() body: { id: string; productsCategory: any },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const { id, productsCategory } = body;
      await this.redisService.set(id, JSON.stringify(productsCategory));
      this.logger.log(
        `Products updated for ${id} by ${socket.id}`,
        productsCategory,
      );
      this.server.emit('products', productsCategory);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
