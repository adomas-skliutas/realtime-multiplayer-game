import type { Socket } from 'socket.io-client';
import {
  ServerCreateGamePayload,
  ServerGetGamePlayersPayload,
  ServerJoinGamePayload,
  ServerStartGamePayload,
  WEBSOCKET_MESSAGES,
} from 'shared';
import type { ClientEvents } from './events.connections';
import { addPlayer, addSelf, setGameStarted, setJoinedGame, getSelf, getGameJoined } from './state.connection';
import { updateGameKey } from '../button/button';

export const createHandlers = (socket: Socket, clientEvents: ClientEvents) => {
  socket.on(WEBSOCKET_MESSAGES.CREATE_GAME, (data: ServerCreateGamePayload) => {
    clientEvents.joinGame(data);
  });
  socket.on(WEBSOCKET_MESSAGES.JOIN_GAME, (data: ServerJoinGamePayload) => {
    if (!getGameJoined()) {
      setJoinedGame(data.gameKey);
    }
    if (!getSelf()) {
      addSelf(data.player);
      return;
    }
    addPlayer(data.player);
  });
  socket.on(WEBSOCKET_MESSAGES.START_GAME, (data: ServerStartGamePayload) => {
    setGameStarted(data);
  });
  socket.on(WEBSOCKET_MESSAGES.GET_GAME_PLAYERS, (data: ServerGetGamePlayersPayload) => {
    data.filter((playerId) => playerId !== getSelf()?.playerId).forEach((playerId) => addPlayer(playerId));
  });
  socket.on(WEBSOCKET_MESSAGES.ERROR, (data: string) => {
    if (data === 'Game has already started') {
      updateGameKey();
    }
    console.error(data);
  });
};
