import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'src/database/entities/entities';
import { WebsocketListenerService } from './websocket-listenet.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [WebsocketListenerService],
})
export class WebsocketListenerModule {}
