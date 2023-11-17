import { Injectable } from '@nestjs/common';
import { events } from './state.types';
import { createMachine } from 'xstate';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { states, GameState } from '@sok/game-common';
@Injectable()
export class StateService {
  stateMachine = createMachine(
    {
      id: 'dice-online',
      initial: states.waiting,
      predictableActionArguments: true,
      states: {
        [states.waiting]: {
          on: {
            [events.startGame]: states.playing,
          },
          entry: ['startWaiting'],
        },
        [states.playing]: {
          on: {
            [events.startWaiting]: states.waiting,
          },
          entry: ['startGame'],
          exit: ['exitGame'],
        },
      },
    },
    {
      actions: {
        startWaiting: () => {
          this.eventEmitter.emit(events.startWaiting);
        },
        startGame: () => {
          this.eventEmitter.emit(events.startGame);
        },
        exitGame: () => {
          this.eventEmitter.emit(events.exitGame);
        },
      },
    },
  );

  constructor(private readonly eventEmitter: EventEmitter2) {}

  private currentState = this.stateMachine.initialState;

  getCurrentState(): GameState {
    return states[String(this.currentState.value)];
  }

  sendEvent(event) {
    this.currentState = this.stateMachine.transition(this.currentState, event);
    const { actions } = this.currentState;

    actions.forEach((action) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typeof action.exec === 'function' && action.exec();
    });
  }
}
