import { BinaryLike, createHash, randomBytes } from 'crypto';

export function generateHash(seed: BinaryLike) {
  return createHash('sha256').update(seed).digest('hex');
}

export function randomSeed(bytes = 32) {
  return randomBytes(bytes).toString('hex');
}

export function generateNextHashes(hashFrom: BinaryLike, count: number) {
  const hashes = new Array<string>(count);
  let hash = hashFrom;
  for (let i = 0; i < count; i++) {
    hash = generateHash(hash);
    hashes[i] = hash;
  }
  return hashes;
}
