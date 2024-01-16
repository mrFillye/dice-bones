import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { GameStepArgs } from './game.types';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '../state/state.types';
import { StateService } from '../state/state.service';
import { FairnessService } from '../fairness/fairness.service';
import { ConfigService } from '@nestjs/config';
import { LimitedHistory } from '../utils/limited-history';
import {
  CurrentState,
  FairnessResult,
  socketEvents,
  PlayingUser,
  Snapshot,
  GameState,
  states,
} from '@sok/game-common';
import { WebsocketService } from '../websocket/websocket.service';
import { UsersService } from '../users/users.service';
import { calculateWonAmount, determineDiceResult } from './game.common';

const GAME_HISTORY_LIMIT = 5;

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  startTime: number;
  currentTime: number;
  timer?: NodeJS.Timer;

  history: LimitedHistory<FairnessResult> = new LimitedHistory(
    GAME_HISTORY_LIMIT,
  );

  currentGame: FairnessResult;

  waitingTimeMs: number;
  syncTimeMs: number;
  playingTimeMs: number;

  constructor(
    private readonly stateService: StateService,
    private readonly fairnessService: FairnessService,
    private readonly config: ConfigService,
    private readonly websocket: WebsocketService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    this.waitingTimeMs = Number(config.getOrThrow<number>('WAITING_TIME_MS'));
    this.syncTimeMs = Number(config.getOrThrow<number>('SYNC_TIME_MS'));
    this.playingTimeMs = Number(config.getOrThrow<number>('PLAYING_TIME_MS'));

    this.currentGame = this.fairnessService.createNewGame();
  }

  public startGame() {
    this.resetCurrentGameParams();
    this.startWaiting();
  }

  public getCurrentGameSnapshot(): Snapshot {
    const state = this.stateService.getCurrentState();

    const participants = Object.values(this.usersService.participants);

    const time =
      this.startTime +
      (state == 'playing' ? this.playingTimeMs : this.waitingTimeMs) -
      Date.now();

    return {
      time,
      state,
      currentTime: this.currentTime,
      startTime: this.startTime,
      history: this.history.toArray(),
      participants,
      ...this.getGameResult(state),
    };
  }

  handlePlayingUser(user: PlayingUser): PlayingUser {
    const { bet } = user;

    const diceResult = determineDiceResult(this.currentGame);

    if (bet.half === diceResult) {
      return {
        ...user,
        state: 'win',
        wonAmount: calculateWonAmount(bet),
      };
    }

    return {
      ...user,
      state: 'lost',
    };
  }

  private switchToWaiting() {
    this.stateService.sendEvent({
      type: events.startWaiting,
    });
  }

  @OnEvent(events.startWaiting)
  private startWaiting() {
    const newGame = this.fairnessService.createNewGame();
    this.currentGame = newGame;

    this.runGameStep({
      gameStepTime: this.waitingTimeMs,
      state: this.stateService.getCurrentState(),
      syncTime: this.syncTimeMs,
      onEnd: () => {
        this.switchToPlaying();
      },
    });
  }

  private switchToPlaying() {
    this.stateService.sendEvent({
      type: events.startGame,
    });
  }

  @OnEvent(events.startGame)
  private startPlaying() {
    this.updateHistory(this.currentGame);

    this.runGameStep({
      gameStepTime: this.playingTimeMs,
      syncTime: this.syncTimeMs,
      state: this.stateService.getCurrentState(),
      onEnd: () => {
        this.switchToWaiting();
      },
    });
  }

  @OnEvent(events.exitGame)
  private exitPlaying() {
    this.usersService.resetParticipants();
  }

  private runGameStep(args: GameStepArgs) {
    const { gameStepTime, syncTime, onEnd, onTick, state } = args;
    this.resetCurrentGameParams();

    this.emitCurrentState(state, gameStepTime);

    this.timer = setInterval(() => {
      if (this.startTime + gameStepTime < this.currentTime) {
        clearInterval(this.timer);
        onEnd?.call(this);
      } else {
        this.currentTime = Date.now();
        onTick?.call(this, this.currentTime - this.startTime);
      }
    }, syncTime);
  }

  private resetCurrentGameParams() {
    this.startTime = Date.now();
    this.currentTime = Date.now();
  }

  private emitCurrentState(state: GameState, gameStepTime = 0) {
    const message = {
      state,
    };

    const time = this.startTime + gameStepTime - Date.now();

    const results = this.getGameResult(state);

    const currentState: CurrentState = {
      time,
      ...message,
      ...results,
    };

    this.websocket.emit<CurrentState>(socketEvents.state.current, currentState);
  }

  private getGameResult(state: GameState) {
    return state === states.playing
      ? {
          result: this.currentGame,
          results: Object.values(this.usersService.results),
        }
      : {};
  }

  private updateHistory(game: FairnessResult) {
    this.history.append(game);

    this.websocket.emit(socketEvents.history.update, {
      history: this.history.toArray(),
    });
  }
}
