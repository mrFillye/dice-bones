import { Module } from '@nestjs/common';
import { StateModule } from './state/state.module';
import { FairnessModule } from './fairness/fairness.module';
import { GameModule } from './game/game.module';
import { WebsocketModule } from './websocket/websocket.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    StateModule,
    FairnessModule,
    GameModule,
    WebsocketModule,
    UsersModule,
  ],
})
export class AppModule {}
