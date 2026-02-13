import { describe, expect, it } from 'vitest';
import {
  applyMove,
  createInitialEncoding,
  isGoalEncoding,
  solveHanoiBfs,
  solveHanoiRecursive
} from '../hanoiEngine';

describe('hanoiEngine', () => {
  it('recursive solution has 2^n - 1 moves', () => {
    for (const n of [1, 2, 3, 4, 5]) {
      const moves = solveHanoiRecursive(n, 0, 2, 1);
      expect(moves.length).toBe(2 ** n - 1);
    }
  });

  it('BFS from initial state matches optimal length', () => {
    for (const n of [3, 4, 5, 6]) {
      const start = createInitialEncoding(n);
      const path = solveHanoiBfs(start, n, 2);
      expect(path.length).toBe(2 ** n - 1);
    }
  });

  it('applying recursive moves reaches the goal', () => {
    const n = 5;
    let enc = createInitialEncoding(n);
    const moves = solveHanoiRecursive(n, 0, 2, 1);
    for (const mv of moves) {
      const next = applyMove(enc, n, mv);
      expect(next).not.toBeNull();
      enc = next!;
    }
    expect(isGoalEncoding(enc, n, 2)).toBe(true);
  });
});

