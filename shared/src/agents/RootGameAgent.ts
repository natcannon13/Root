import type { PlayerFactionType } from '../Enums';
import type { Move } from '../gameActions/Move';
import type { Battle } from '../gameActions/Battle';
import type { PlayerID } from '../game/RootGame';

export interface RootGameAgent {
    id: PlayerID;
    chooseOne<T>(message: string, options: T[]): T;
    chooseAny<T>(message: string, options: T[], restriction?: (option: T) => boolean): T[];
    chooseBoolean(message: string): boolean;
    chooseMove(faction: PlayerFactionType, restriction?: (move: Move) => boolean): Move;
    chooseBattle(faction: PlayerFactionType, restriction?: (battle: Battle) => boolean): Battle;
}
