import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { StateModule } from '../state/state.module';
import { GameModule } from '../game/game.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    StateModule,
    forwardRef(() => GameModule),
    forwardRef(() => WebsocketModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
