import { Building } from "../src/Building";
import { ItemType, PlayerFactionType } from "../src/Enums";
import { Pawn } from "../src/Pawn";
import { PieceType } from "../src/PieceType";
import { Ruin } from "../src/Ruin";
import { Token } from "../src/Token";
import { Item } from "../src/Item";


let _idCounter = 1;
export function nextId(): number {
  return _idCounter++;
}
export function resetIds(): void {
  _idCounter = 1;
}


export function makePieceType(
  overrides: Partial<PieceType> = {}
): PieceType {
  return {
    name: 'generic-piece',
    owningFaction: null,
    ...overrides,
  };
}

export function makeToken(overrides: Partial<Token> = {}): Token {
  return {
    id: nextId(),
    type: makePieceType({ name: 'token' }),
    faceUp: true,
    ...overrides,
  };
}
 
export function makePawn(overrides: Partial<Pawn> = {}): Pawn {
  return {
    id: nextId(),
    type: makePieceType({ name: 'pawn' }),
    isWarrior: false,
    ...overrides,
  };
}
 
export function makeWarrior(faction: PlayerFactionType, overrides: Partial<Pawn> = {}): Pawn {
  return {
    id: nextId(),
    type: makePieceType({ name: `${faction}-warrior`, owningFaction: faction }),
    isWarrior: true,
    ...overrides,
  };
}

export function makeBuilding(faction: PlayerFactionType, name = 'building', overrides: Partial<Building> = {}): Building {
  return {
    id: nextId(),
    type: makePieceType({ name, owningFaction: faction }),
    ...overrides,
  };
}

export function makeRuin(items: Item[] = []): Ruin {
  return new Ruin(nextId(), items);
}
 
export function makeItem(itemType: ItemType = 'boot'): Item {
  return new Item(nextId(), makePieceType({ name: itemType, owningFaction: null }));
}