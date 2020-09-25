import {
  create,
  getByUserId,
  getPartialByUserId,
  savePartial,
} from '../src/ProfileRepository';
import { createProfile } from './Factory';
import { getDatabase } from './IntegrationSetup';
import { v4 as uuid } from 'uuid';
import redis from 'redis';

describe('RateRepository', () => {
  const { client, connection } = getDatabase();
  const redisClient = redis.createClient();

  const flushRedis = (): Promise<void> =>
    new Promise((resolve, reject) => {
      redisClient.flushall(error => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      });
    });

  beforeEach(async () => {
    await flushRedis();
    await client.none('TRUNCATE profile CASCADE');
  });

  afterAll(async () => {
    await connection.end();
    redisClient.end(true);
  });

  describe('create', () => {
    test('profile is created and returned', async () => {
      const profile = createProfile();
      const createdProfile = await create(client)(profile);

      expect(createdProfile).toStrictEqual(profile);
    });
  });

  describe('getByUserId', () => {
    test('profile is return if found', async () => {
      const profile = createProfile();
      await create(client)(profile);

      const matchedProfile = await getByUserId(client)(profile.userId);
      expect(matchedProfile).toStrictEqual(profile);
    });

    test('null is returned if not found', async () => {
      const matchedProfile = await getByUserId(client)(uuid());
      expect(matchedProfile).toBeNull();
    });
  });

  describe('savePartial', () => {
    it('partial profile is stored in redis', async () => {
      await savePartial(redisClient, { ttl: 10000 })('userId', {
        givenName: 'jimbo',
      });

      const partialProfile = await getPartialByUserId(redisClient)('userId');
      expect(partialProfile).toStrictEqual({
        givenName: 'jimbo',
      });
    });
  });

  describe('getPartialByUserId', () => {
    it('gets partial profile is stored in redis', async () => {
      await savePartial(redisClient, { ttl: 10000 })('userId', {
        postcode: '2111',
      });

      const partialProfile = await getPartialByUserId(redisClient)('userId');
      expect(partialProfile).toStrictEqual({
        postcode: '2111',
      });
    });

    it('gets null if not found', async () => {
      const partialProfile = await getPartialByUserId(redisClient)('userId');
      expect(partialProfile).toBeNull();
    });
  });
});
