import { DocumentBuilder } from '@nestjs/swagger';

const swaggerOptions = new DocumentBuilder()
  .setTitle('Solana Indexer')
  .setDescription('APIs for DApp built with NestJS, PostgreSQL')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export { swaggerOptions };
