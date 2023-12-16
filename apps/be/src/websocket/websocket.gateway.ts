import { Inject, Logger, forwardRef } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  PlayingUserDto,
  UserDto,
  WsEvent,
  socketEvents,
} from '@sok/game-common';
import { GameService } from '../game/game.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(WebsocketGateway.name);

  @WebSocketServer() private readonly server: Server;

  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  afterInit() {
    this.gameService.startGame();
  }

  @SubscribeMessage('/game,["playing"]')
  async playRound() {
    try {
      await this.gameService.startPlaying();
    } catch ({ message }: any) {
      this.server.emit('play', { message, type: 'error' });
    }
  }

  @SubscribeMessage(socketEvents.snapshot.snapshot)
  hello(@ConnectedSocket() client: Socket, @MessageBody() user: UserDto) {
    if (user) {
      this.usersService.addUser(user, client.id);
    }

    const gameSnapshot = this.gameService.getCurrentGameSnapshot();

    this.server
      .to(client.id)
      .emit(socketEvents.snapshot.snapshot, gameSnapshot);
  }

  @SubscribeMessage(socketEvents.users.bet)
  makeBet(
    @ConnectedSocket() client: Socket,
    @MessageBody() user: PlayingUserDto,
  ) {
    try {
      const response = this.usersService.makeBet(user);
      this.server.to(client.id).emit(socketEvents.users.bet, response);
    } catch ({ message }: any) {
      this.server
        .to(client.id)
        .emit(socketEvents.users.bet, { message, result: 'error' });
    }
  }

  handleDisconnect(client: Socket) {
    this.usersService.removeUser(client.id);
    this.logger.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Connected ${client.id}`);
  }

  emit<T>(event: WsEvent, message: T) {
    this.server.emit(event, message);
  }
}
