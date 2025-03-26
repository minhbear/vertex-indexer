import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';
import { WebsocketListenerService } from './websocket-listenet.service';
import { BullModule } from '@nestjs/bull';
import { PdaSystemQueueConfig } from 'src/common/queue';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    BullModule.registerQueue(PdaSystemQueueConfig),
  ],
  providers: [WebsocketListenerService],
})
export class WebsocketListenerModule {}
