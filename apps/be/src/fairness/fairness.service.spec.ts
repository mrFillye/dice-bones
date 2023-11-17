import { Test, TestingModule } from '@nestjs/testing';
import { FairnessService } from './fairness.service';
import { valuesFromHash } from './fairness.common';

describe('FairnessService', () => {
  let service: FairnessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FairnessService],
    }).compile();

    service = module.get<FairnessService>(FairnessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createHistory', () => {
    it('creates a new history with the specified size', () => {
      service['createHistory']('test', 3);
      expect(service['history'].size()).toBe(3);
    });
  });

  describe('createNewGame', () => {
    it('returns a fairness result with a hash', () => {
      const result = service.createNewGame();
      expect(result.hash).toBeDefined();
    });

    it('returns expected a fairness result with a hash', () => {
      service['createHistory']('test', 3);
      const result = service.createNewGame();
      expect(result.hash).toBe(
        '5b24f7aa99f1e1da5698a4f91ae0f4b45651a1b625c61ed669dd25ff5b937972',
      );
    });

    it('creates a new history if the current history is empty', () => {
      service['history'].clear();
      service.createNewGame();
      expect(service['history'].isEmpty()).toBe(false);
    });

    it("doesn't throw an error if the history is empty", () => {
      service['history'].clear();
      expect(() => service.createNewGame()).not.toThrow();
    });
  });

  describe('Generate fair results', () => {
    it('Generates equal results with one seed', () => {
      const seed = 'test';
      const firstResult = valuesFromHash(seed);
      const secondResult = valuesFromHash(seed);
      expect(firstResult).toEqual(secondResult);
    });
  });
});
