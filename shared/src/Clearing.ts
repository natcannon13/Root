import type { Suit } from './Enums';
import { Location } from './Location';
import type { Piece } from './Piece';
import type { Token } from './Token';
import type { Warrior } from './Warrior';
import type { Building } from './Building';
import { Ruin } from './Ruin';

export class Clearing extends Location {
    id: number;
    printedSuit: Suit | null;
    slotCount: number;
    buildingSlots: Map<number, Building | Ruin>;

    constructor(args: { id: number; printedSuit: Suit | null; slotCount: number; ruins?: { slot: number; ruin: Ruin }[] }) {
        super();
        this.id = args.id;
        this.printedSuit = args.printedSuit;
        this.slotCount = args.slotCount;
        this.buildingSlots = new Map();
    }

    matches(suit: Suit | null): boolean { return false; }
    openSlots(): number[] { return []; }
    build(slot: number, building: Building): void { }
    addPieces(pieces: Piece[]): void { }
    removePieces(pieces: Piece[]): void { }
    hasPieces(pieces: Piece[]): boolean { return false; }
    getPieces(predicate?: (p: Piece) => boolean): Piece[] { return []; }
    replace(oldPiece: Piece, newPiece: Piece): void { }
    getRuler(): string | null { return null; }
    getWarriors(faction: string): Warrior[] { return []; }
    getCardboard(faction: string): Array<Building | Token> { return []; }
}
