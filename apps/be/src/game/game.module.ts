import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { StateModule } from '../state/state.module';
import { FairnessModule } from '../fairness/fairness.module';
import { ConfigModule } from '@nestjs/config';
import { WebsocketModule } from '../websocket/websocket.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    StateModule,
    FairnessModule,
    ConfigModule.forRoot(),
    forwardRef(() => WebsocketModule),
    forwardRef(() => UsersModule),
  ],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
