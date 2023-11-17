import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [StateService],
  imports: [EventEmitterModule.forRoot()],
  exports: [StateService],
})
export class StateModule {}
