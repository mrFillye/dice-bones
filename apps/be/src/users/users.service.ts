import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  GameUser,
  PlayingUser,
  PlayingUserDto,
  UserDto,
  states,
  socketEvents,
} from '@sok/game-common';
import { StateService } from '../state/state.service';
import { GameService } from '../game/game.service';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable()
export class UsersService {
  private users: Record<GameUser['id'], GameUser> = {};
  private socketIdToUserIds: Record<string, GameUser['id']> = {};
  public participants: Record<PlayingUser['id'], PlayingUser> = {};
  public results: Record<PlayingUser['id'], PlayingUser> = {};

  private userUpdates: PlayingUser[] = [];

  constructor(
    private readonly stateService: StateService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    @Inject(forwardRef(() => WebsocketService))
    private readonly websocket: WebsocketService,
  ) {}

  public addUser(user: UserDto, socketId: string) {
    this.socketIdToUserIds[socketId] = user.id;
    const existing = this.users[user.id];

    if (this.users[user.id]) {
      if (!existing.socketIds.includes(socketId)) {
        this.users[user.id] = {
          ...existing,
          socketIds: [...existing.socketIds, socketId],
        };
      }
    } else {
      this.users[user.id] = {
        ...user,
        type: 'user',
        socketIds: [socketId],
      };
    }
  }

  removeUser(socketId: string) {
    const userId = this.socketIdToUserIds[socketId];
    const user = this.users[userId];

    if (!user) {
      return null;
    }

    const { socketIds } = user;

    if (socketIds.length === 1 && socketIds.includes(socketId)) {
      delete this.users[userId];
    } else {
      this.users[userId].socketIds = socketIds.filter(
        (sid) => sid !== socketId,
      );
    }
  }

  makeBet(user: PlayingUserDto) {
    if (this.stateService.getCurrentState() !== states.waiting) {
      throw new Error('It is not time to make a bet');
    }

    if (!this.users[user.id]) {
      throw new Error("There isn't any user with such id");
    }

    if (this.participants[user.id]) {
      throw new Error('You have already made a bet');
    }

    if (!user.bet) {
      throw new Error('Your bet is wrong');
    }

    const { socketIds } = this.users[user.id];

    this.participants[user.id] = {
      ...user,
      socketIds,
      state: 'idle',
      type: 'participant',
    };

    this.results[user.id] = this.gameService.handlePlayingUser(
      this.participants[user.id],
    );

    this.userUpdates.push(this.participants[user.id]);

    this.emitUserUpdates();

    return {
      result: 'ok',
    };
  }

  public resetParticipants() {
    this.participants = {};
    this.results = {};
  }

  private emitUserUpdates() {
    const updates = this.userUpdates;
    this.userUpdates = [];

    this.websocket.emit(socketEvents.users.update, updates);
  }
}
