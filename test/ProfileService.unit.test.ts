import { createProfile, savePartialProfile } from '../src/ProfileService';
import { createProfile as createProfileMock } from './Factory';

describe('ProfileService', () => {
  describe('createProfile', () => {
    test('id is generated for profile', async () => {
      const create = jest.fn();
      const getUuid = jest.fn().mockReturnValue('xxxx');

      const profile = createProfileMock();

      await createProfile(create, getUuid)(profile);
      expect(create.mock.calls[0][0].id).toBe('xxxx');
    });
  });

  describe('savePartialProfile', () => {
    test('new partial profile gets added to existing one', async () => {
      const getPartialByUserId = jest
        .fn()
        .mockResolvedValue({ surname: 'potter' });
      const savePartial = jest.fn();
      const userId = 'xxxx';

      await savePartialProfile(getPartialByUserId, savePartial)(userId, {
        givenName: 'jimbo',
      });

      expect(savePartial.mock.calls[0][1]).toStrictEqual({
        surname: 'potter',
        givenName: 'jimbo',
      });
    });
  });
});
