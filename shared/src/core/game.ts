import { characterNext } from './character';
import { Game } from './interfaces';

export const runGame = (game: Game, delta: number) => {
  game.players.forEach((player) => characterNext(player, game.platforms, delta));
  return game;
};
