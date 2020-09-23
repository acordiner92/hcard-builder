import { create } from '../src/ProfileRepository';
import { createProfile } from './Factory';
import { getDatabase } from './IntegrationSetup';

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
});
