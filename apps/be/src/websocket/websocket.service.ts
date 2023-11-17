import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WsEvent } from '@sok/game-common';

@Injectable()
export class WebsocketService {
  constructor(private readonly gateway: WebsocketGateway) {}

  public emit<T>(event: WsEvent, message: T) {
    return this.gateway.emit(event, message);
  }
}
