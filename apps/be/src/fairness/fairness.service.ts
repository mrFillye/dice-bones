import { Injectable } from '@nestjs/common';
import { BinaryLike } from 'crypto';
import { generateNextHashes, randomSeed } from '../utils/hash';
import { Stack } from '../utils/stack';
import { FairnessResult } from '@sok/game-common';
import { valuesFromHash } from './fairness.common';

@Injectable()
export class FairnessService {
  private history: Stack<string> = new Stack();

  constructor() {
    // TODO: Use pre-generated values from DB
    this.createHistory(randomSeed());
  }

  createNewGame(): FairnessResult {
    if (this.history.isEmpty()) {
      this.createHistory(randomSeed());
    }
    const hash = this.history.pop();

    if (!hash) {
      throw new Error('History is empty!');
    }

    return this.takeResult(hash);
  }

  private createHistory(seed: BinaryLike, historySize = 1_000_000) {
    this.history = new Stack(generateNextHashes(seed, historySize));
  }

  private takeResult(hash: string): FairnessResult {
    const result = valuesFromHash(hash);
    return {
      hash,
      result,
    };
  }
}
