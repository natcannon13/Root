import { describe, test, expect, beforeEach } from 'vitest';
import { Clearing } from '../src/Clearing.ts';
import {
  makeWarrior,
  makeBuilding,
  makeToken,
  makePawn,
  makeRuin,
  makeItem,
  resetIds,
} from './helpers.ts';
 
beforeEach(() => resetIds());
 
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
 
  test('bird card is NOT a suit a clearing can have (only fox/rabbit/mouse) — printedSuit null is valid', () => {
    // Clearings with no printed suit (e.g. Burrow) have null
    const c = new Clearing({ id: 1, printedSuit: null, slotCount: 0 });
    expect(c.printedSuit).toBeNull();
  });
});
 
describe('Clearing — building slots (§2.2.3)', () => {
  test('openSlots() returns all indices when no buildings placed', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    expect(c.openSlots()).toHaveLength(3);
  });
 
  test('openSlots() excludes occupied slots', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    const b = makeBuilding('marquise');
    c.build(0, b);
    expect(c.openSlots()).toEqual([1, 2]);
  });
 
  test('build() places building in the specified slot', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const b = makeBuilding('marquise');
    c.build(0, b);
    expect(c.buildingSlots.get(0)).toBe(b);
  });
 
  test('build() throws when slot is already occupied', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    c.build(0, makeBuilding('marquise'));
    expect(() => c.build(0, makeBuilding('eyrie'))).toThrow();
  });
 
  test('ruins occupy slots and those slots are not open (§2.2.4)', () => {
    const ruin = makeRuin([makeItem('boot')]);
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2, ruins: [{ slot: 0, ruin }] });
    expect(c.openSlots()).toEqual([1]);
  });
 
  test('a clearing with no open slots cannot receive a building', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 1 });
    c.build(0, makeBuilding('marquise'));
    expect(c.openSlots()).toHaveLength(0);
  });
});
 
describe('Clearing — pieces (§1.5, §G.20, §G.24)', () => {
  test('addPieces() adds tokens', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t = makeToken();
    c.addPieces([t]);
    expect(c.getPieces()).toContain(t);
  });
 
  test('addPieces() adds pawns', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const p = makePawn({ isWarrior: true });
    c.addPieces([p]);
    expect(c.getPieces()).toContain(p);
  });
 
  test('removePieces() removes the specified pieces', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t = makeToken();
    c.addPieces([t]);
    c.removePieces([t]);
    expect(c.getPieces()).not.toContain(t);
  });
 
  test('hasPieces() returns true when pieces are present', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t = makeToken();
    c.addPieces([t]);
    expect(c.hasPieces([t])).toBe(true);
  });
 
  test('hasPieces() returns false when pieces are absent', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const t = makeToken();
    expect(c.hasPieces([t])).toBe(false);
  });
 
  test('getPieces() filters by predicate', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const w = makeWarrior('marquise');
    const p = makePawn({ isWarrior: false });
    c.addPieces([w, p]);
    const warriors = c.getPieces((piece) => (piece as typeof w).isWarrior === true);
    expect(warriors).toContain(w);
    expect(warriors).not.toContain(p);
  });
 
  test('replace() swaps a target piece with a new piece', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const old = makeToken();
    const fresh = makeToken();
    c.addPieces([old]);
    c.replace(old, fresh);
    expect(c.getPieces()).toContain(fresh);
    expect(c.getPieces()).not.toContain(old);
  });
});
 
describe('Clearing — rule (§2.5, §G.28)', () => {
  test('getRuler() returns the faction with the most warriors + buildings', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    c.addPieces([makeWarrior('marquise'), makeWarrior('marquise')]);
    c.addPieces([makeWarrior('eyrie')]);
    expect(c.getRuler()).toBe('marquise');
  });
 
  test('getRuler() returns null on a tie (§2.5)', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    c.addPieces([makeWarrior('marquise'), makeWarrior('eyrie')]);
    expect(c.getRuler()).toBeNull();
  });
 
  test('getRuler() returns null when the clearing is empty', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    expect(c.getRuler()).toBeNull();
  });
 
  test('tokens do NOT contribute to rule (§2.5)', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    // Eyrie has 1 warrior; Alliance has 3 sympathy tokens but no warriors
    c.addPieces([makeWarrior('eyrie')]);
    c.addPieces([makeToken(), makeToken(), makeToken()]); // treat as alliance tokens
    expect(c.getRuler()).toBe('eyrie');
  });
 
  test('buildings count toward rule (§2.5)', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 3 });
    c.addPieces([makeWarrior('marquise')]); // marquise: 1 warrior + 1 building = 2
    c.build(0, makeBuilding('marquise'));
    c.addPieces([makeWarrior('eyrie'), makeWarrior('eyrie')]); // eyrie: 2 warriors
    // tie: 2 vs 2 → no ruler
    expect(c.getRuler()).toBeNull();
  });
 
  test('pawns do NOT contribute to rule (§2.5)', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    c.addPieces([makeWarrior('marquise')]);
    // Vagabond pawn: isWarrior = false
    c.addPieces([makePawn({ isWarrior: false }), makePawn({ isWarrior: false })]);
    expect(c.getRuler()).toBe('marquise');
  });
});
 
describe('Clearing — warrior and cardboard queries', () => {
  test('getWarriors(faction) returns only that faction\'s warriors', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const mq = makeWarrior('marquise');
    const ey = makeWarrior('eyrie');
    c.addPieces([mq, ey]);
    const result = c.getWarriors('marquise');
    expect(result).toContain(mq);
    expect(result).not.toContain(ey);
  });
 
  test('getCardboard(faction) returns buildings and tokens owned by faction', () => {
    const c = new Clearing({ id: 1, printedSuit: 'fox', slotCount: 2 });
    const b = makeBuilding('marquise');
    const t = makeToken();
    t.type = { name: 'keep', owningFaction: 'marquise' } as any;
    c.build(0, b);
    c.addPieces([t]);
    const result = c.getCardboard('marquise');
    expect(result).toContain(b);
    expect(result).toContain(t);
  });
});