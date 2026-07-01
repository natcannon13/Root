import type { Piece } from "../pieces/Piece";
import type { RootGame } from "../game/RootGame";
import type { FactionType } from "../Enums";
import type { Faction } from "../rulesModule/Faction";
import type { RulesChange } from "../rulesModule/RulesChange";
import type { Event } from "../game/Event";

export abstract class BaseFaction implements Faction {
    abstract name: FactionType;
    abstract pieces: Piece[];
    abstract game: RootGame;
    abstract hasCraftedBox: boolean;
    abstract addToSupply: (piece: Piece) => void;
    abstract getPiece: (pieceID: number) => Piece | null;
    staticRulesChanges: RulesChange[] = [];
    abstract setup(game: RootGame): void;
    globalEvents: (game: RootGame) => Event[] = () => [];
    abstract isMilitant: boolean;
}