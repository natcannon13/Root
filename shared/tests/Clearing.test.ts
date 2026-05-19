import { describe, test, expect, beforeEach } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { Clearing } from '../src/Clearing.ts';
import type { Building } from '../src/Building.ts';
import type { Token } from '../src/Token.ts';
import type { Pawn } from '../src/Pawn.ts';
import { Ruin } from '../src/Ruin.ts';
import { Item } from '../src/Item.ts';

 

 
describe('Clearing — suit', () => {
  test('stores the printed suit', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    expect(c.printedSuit).toBe('fox');
  });
 
  test('matches(suit) returns true when the clearing suit matches', () => {
    const c = new Clearing({ id: 1, printedSuit: 'rabbit', slotCount: 2 });
    expect(c.matches('rabbit')).toBe(true);
  });
 
  test('matches(suit) returns false for a different suit', () => {
    const c = new Clearing({ id: 1, printedSuit: 'mouse', slotCount: 2 });
    expect(c.matches('fox')).toBe(false);
  });
 
  test('printedSuit null is valid', () => {
    // Clearings with no printed suit (e.g. Burrow) have null
    const c = new Clearing({ id: 1, printedSuit: null, slotCount: 0 });
    expect(c.printedSuit).toBeNull();
  });
});
 
describe('Clearing — building slots (§2.2.3)', () => {
  test('openSlots() returns all indices when no buildings placed', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    expect(c.openSlots()).toEqual(3);
  });
 
  test('building reduces open slots', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    const b = mock<Building>();
    c.addPieces([b]);
    expect(c.openSlots()).toEqual(2);
  });
 
  test('build() throws when there are no open slots', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    c.addPieces([mock<Building>(), mock<Building>()]);
    expect(() => c.addPieces([mock<Building>()])).toThrow();
  });
 
  test('ruins occupy slots (§2.2.4)', () => {
    const ruin = mock<Ruin>();
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    c.addPieces([ruin]);
    expect(c.openSlots()).toEqual(1);
  });
 
  test('openSlots() returns 0 when all slots are occupied', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 1 });
    c.addPieces([mock<Building>()]);
    expect(c.openSlots()).toEqual(0);
  });
});
 
describe('Clearing — pieces (§1.5, §G.20, §G.24)', () => {
  test('addPieces() adds tokens', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t = mock<Token>();
    c.addPieces([t]);
    expect(c.getPieces()).toContain(t);
  });
 
  test('addPieces() adds pawns', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const p = mock<Pawn>();
    c.addPieces([p]);
    expect(c.getPieces()).toContain(p);
  });
 
  test('removePieces() removes the specified pieces', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t = mock<Token>();
    c.addPieces([t]);
    c.removePieces([t]);
    expect(c.getPieces()).not.toContain(t);
  });

  test('removePieces() does not remove pieces not specified', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t1 = mock<Token>();
    const t2 = mock<Token>();
    c.addPieces([t1, t2]);
    c.removePieces([t1]);
    expect(c.getPieces()).toContain(t2);
  });

  test('hasPieces() returns true when pieces are present', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t1 = mock<Token>();
    const t2 = mock<Pawn>();
    c.addPieces([t1, t2]);
    expect(c.hasPieces([t1, t2])).toBe(true);
  });
 
  test('hasPieces() returns false when pieces are absent', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t = mock<Token>();
    expect(c.hasPieces([t])).toBe(false);
  });

  test('hasPieces() returns false when only some pieces are present', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t1 = mock<Token>();
    const t2 = mock<Token>();
    c.addPieces([t1]);
    expect(c.hasPieces([t1, t2])).toBe(false);
  });
 
  test('getPieces() filters by predicate', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const w = mock<Pawn>({ id: 1, name: 'warrior', owningFaction: 'marquise-de-cat', isWarrior: true });
    const p = mock<Pawn>({ id: 2, name: 'pawn', owningFaction: 'vagabond', isWarrior: false });
    c.addPieces([w, p]);
    const warriors = c.getPieces((piece) => (piece as any).isWarrior === true);
    expect(warriors).toContain(w);
    expect(warriors).not.toContain(p);
  });
 
  test('replace() swaps a target piece with a new piece', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const old = mock<Token>({ id: 1 });
    const fresh = mock<Building>({ id: 2 });
    c.addPieces([old]);
    c.replace(old, fresh);
    expect(c.getPieces()).toContain(fresh);
    expect(c.getPieces()).not.toContain(old);
  });
});
 
describe('Clearing — rule (§2.5, §G.28)', () => {
  test('getRuler() returns the faction with the most warriors', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    c.addPieces([
        mock<Pawn>({ id: 1, name: 'warrior', owningFaction: 'marquise-de-cat', isWarrior: true }), 
        mock<Pawn>({ id: 2, name: 'warrior', owningFaction: 'marquise-de-cat', isWarrior: true })
    ]);
    c.addPieces([mock<Pawn>({ id: 3, name: 'warrior', owningFaction: 'eyrie-dynasties', isWarrior: true })]);
    expect(c.getRuler()).toBe('marquise-de-cat');
  });
 
  test('getRuler() returns null on a tie (§2.5)', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    c.addPieces([mock<Pawn>({ id: 1, name: 'warrior', owningFaction: 'marquise-de-cat', isWarrior: true }), mock<Pawn>({ id: 2, name: 'warrior', owningFaction: 'eyrie-dynasties', isWarrior: true })]);
    expect(c.getRuler()).toBeNull();
  });
 
  test('getRuler() returns null when the clearing is empty', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    expect(c.getRuler()).toBeNull();
  });
 
  test('tokens do NOT contribute to rule (§2.5)', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    // Eyrie has 1 warrior; Alliance has 3 sympathy tokens but no warriors
    c.addPieces([mock<Pawn>({ id: 1, name: 'warrior', owningFaction: 'eyrie-dynasties', isWarrior: true })]);
    c.addPieces([mock<Token>({ id: 2, name: 'sympathy', owningFaction: 'woodland-alliance', faceUp: true }), mock<Token>({ id: 3, name: 'sympathy', owningFaction: 'woodland-alliance', faceUp: true }), mock<Token>({ id: 4, name: 'sympathy', owningFaction: 'woodland-alliance', faceUp: true })]);
    expect(c.getRuler()).toBe('eyrie-dynasties');
  });
 
  test('buildings count toward rule (§2.5)', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    c.addPieces([mock<Pawn>({ id: 1, name: 'warrior', owningFaction: 'marquise-de-cat', isWarrior: true })]);
    c.addPieces([mock<Building>({ id: 1, name: 'keep', owningFaction: 'marquise-de-cat' })]);
    c.addPieces([mock<Pawn>({ id: 2, name: 'warrior', owningFaction: 'eyrie-dynasties', isWarrior: true }), mock<Pawn>({ id: 3, name: 'warrior', owningFaction: 'eyrie-dynasties', isWarrior: true })]);
    expect(c.getRuler()).toBeNull();
  });
 
  test('pawns do NOT contribute to rule (§2.5)', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    c.addPieces([mock<Pawn>({ id: 1, name: 'warrior', owningFaction: 'marquise-de-cat', isWarrior: true })]);
    c.addPieces([mock<Pawn>({ id: 2, name: 'pawn', owningFaction: 'vagabond', isWarrior: false }), mock<Pawn>({ id: 3, name: 'pawn', owningFaction: 'vagabond', isWarrior: false })]);
    expect(c.getRuler()).toBe('marquise-de-cat');
  });
});
 
describe('Clearing — warrior and cardboard queries', () => {
  test('getWarriors(faction) returns only that faction\'s warriors', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const mq = mock<Pawn>({ id: 1, name: 'warrior', owningFaction: 'marquise-de-cat', isWarrior: true });
    const ey = mock<Pawn>({ id: 2, name: 'warrior', owningFaction: 'eyrie-dynasties', isWarrior: true });
    c.addPieces([mq, ey]);
    const result = c.getWarriors('marquise-de-cat');
    expect(result).toContain(mq);
    expect(result).not.toContain(ey);
  });
 
  test('getCardboard(faction) returns buildings and tokens owned by faction', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const b = mock<Building>({ id: 1, name: 'keep', owningFaction: 'marquise-de-cat' });
    const t = mock<Token>({ id: 2, name: 'keep', owningFaction: 'marquise-de-cat', faceUp: true });
    c.addPieces([b, t]);
    const result = c.getCardboard('marquise-de-cat');
    expect(result).toContain(b);
    expect(result).toContain(t);
  });
});