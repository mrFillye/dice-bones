import { Module, forwardRef } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { GameModule } from '../game/game.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => GameModule), forwardRef(() => UsersModule)],
  providers: [WebsocketService, WebsocketGateway],
  exports: [WebsocketService],
})
export class WebsocketModule {}
