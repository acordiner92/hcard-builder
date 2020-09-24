import { PartialProfile, Profile } from './Profile';
import {
  SavePartial,
  GetPartialByAccountId,
  Create,
} from './ProfileRepository';
import { v4 as uuid } from 'uuid';

export const getPartialProfile = (
  getPartialByAccountId: GetPartialByAccountId,
) => (accountId: string): Promise<PartialProfile | null> =>
  getPartialByAccountId(accountId);

export type GetPartialProfile = (
  accountId: string,
) => Promise<PartialProfile | null>;

export const savePartialProfile = (
  getPartialByAccountId: GetPartialByAccountId,
  savePartial: SavePartial,
) => async (
  accountId: string,
  partialProfile: PartialProfile,
): Promise<void> => {
  const existingPartialProfile = await getPartialByAccountId(accountId);
  const updatedPartialProfile = existingPartialProfile
    ? {
        ...existingPartialProfile,
        ...partialProfile,
      }
    : partialProfile;

  await savePartial(accountId, updatedPartialProfile);
};
export type SavePartialProfile = (
  accountId: string,
  partialProfile: PartialProfile,
) => Promise<void>;

export const createProfile = (create: Create) => (
  profile: Profile,
): Promise<Profile> => create({ ...profile, id: uuid() });

export type CreateProfile = (profile: Profile) => Promise<Profile>;
