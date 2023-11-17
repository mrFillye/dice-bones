import { BinaryLike } from 'crypto';
import { generateHash } from '../utils/hash';

export function valuesFromHash(seed: BinaryLike): [number, number] {
  const hash = generateHash(seed);

  const moduleDivision = 25;

  if (parseInt(hash, 16) % moduleDivision === 0) {
    return generateEdge(hash);
  }

  return [
    (parseInt(hash.slice(0, 32), 16) % 6) + 1,
    (parseInt(hash.slice(12, 24), 16) % 6) + 1,
  ];
}

export function generateEdge(hash: string): [number, number] {
  if (parseInt(hash.slice(12, 16), 16) % 2 === 0) {
    return [0, 1 + (parseInt(hash, 16) % 6)];
  }
  return [1 + (parseInt(hash, 16) % 6), 0];
}
