import { Module } from '@nestjs/common';

import { LoggerService } from '../logger/logger.service';
import { CostsGateway } from './costs.gateway';
import { ProxiesModule } from 'src/infrastructure/proxies/proxies.module';

@Module({
  imports: [ProxiesModule],
  providers: [CostsGateway, LoggerService],
})
export class CostsModule {}
