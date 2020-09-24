import { create, getByUserId, update } from '../src/ProfileRepository';
import { createProfile } from './Factory';
import { getDatabase } from './IntegrationSetup';
import { v4 as uuid } from 'uuid';
import { AustralianState } from '../src/Profile';

describe('RateRepository', () => {
  const { client, connection } = getDatabase();

  beforeEach(async () => {
    await client.none('TRUNCATE profile CASCADE');
  });

  afterAll(async () => {
    await connection.end();
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
});
