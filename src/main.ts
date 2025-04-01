import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import {
  CONTEXT_PATH,
  NODE_ENV,
  PORT,
  SWAGGER_ENDPOINT,
} from './app.environment';
import { HttpExceptionFilter } from './common/exceptions/http-exception';
import { ErrorsInterceptor, TransformInterceptor } from './interceptors';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { swaggerOptions } from './config';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.enableCors();
  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.setGlobalPrefix(CONTEXT_PATH, {
    exclude: ['health'],
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(app.get(Reflector)),
    new ErrorsInterceptor(),
    new LoggerErrorInterceptor(),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableShutdownHooks();

  if (NODE_ENV != 'production') {
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup(SWAGGER_ENDPOINT, app, document);
  }

  await app.listen(PORT);
}
bootstrap();
