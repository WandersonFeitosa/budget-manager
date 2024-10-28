import { Module } from '@nestjs/common';
import { PubSubProxy } from './pub-sub/pub-sub.proxy';
import { RedisProxy } from './redis/redis-proxy';
@Module({
  imports: [],
  controllers: [],
  providers: [PubSubProxy, RedisProxy],
  exports: [PubSubProxy, RedisProxy],
})
export class ProxiesModule {}
