import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './infrastructure/interceptors/response.interceptor';
import { LoggerService } from './modules/logger/logger.service';
import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(process.env.SSL_KEY),
  //   cert: fs.readFileSync(process.env.SSL_CERT),
  //   ca: fs.readFileSync(process.env.SSL_CA),
  // };

  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor(new LoggerService()));

  await app.listen(process.env.PORT || 3000);
  console.log(`Server started on HTTPS port ${process.env.PORT || 3000}`);
}
bootstrap();
