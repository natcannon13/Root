import type { Piece } from "../pieces/Piece";
import type { RootGame } from "../game/RootGame";
import type { FactionType } from "../Enums";
import type { RulesChange } from "../rulesModule/RulesChange";
import type { Event } from "../game/Event";
import { BaseFaction } from "./BaseFaction";
export class MarquiseDeCat extends BaseFaction {
    name: FactionType = "marquise-de-cat";
    pieces: Piece[] = [];
    game!: RootGame;
    hasCraftedBox: boolean = true;
    addToSupply: (piece: Piece) => void = () => {};
    getPiece: (pieceID: number) => Piece | null = () => null;
    staticRulesChanges: RulesChange[] = [];
    globalEvents: (game: RootGame) => Event[] = () => [];
    isMilitant: boolean = true;

    setup(game: RootGame) {
        this.game = game;
    }
}