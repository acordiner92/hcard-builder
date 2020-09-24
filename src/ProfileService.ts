import { PartialProfile, Profile } from './Profile';
import {
  SavePartial,
  GetPartialByUserId,
  Create,
  GetByUserId,
} from './ProfileRepository';
import { v4 as uuid } from 'uuid';

export const getPartialProfile = (getPartialByUserId: GetPartialByUserId) => (
  userId: string,
): Promise<PartialProfile | null> => getPartialByUserId(userId);

export type GetPartialProfile = (
  userId: string,
) => Promise<PartialProfile | null>;

export const savePartialProfile = (
  getPartialByUserId: GetPartialByUserId,
  savePartial: SavePartial,
) => async (userId: string, partialProfile: PartialProfile): Promise<void> => {
  const existingPartialProfile = await getPartialByUserId(userId);
  const updatedPartialProfile = existingPartialProfile
    ? {
        ...existingPartialProfile,
        ...partialProfile,
      }
    : partialProfile;

  await savePartial(userId, updatedPartialProfile);
};
export type SavePartialProfile = (
  userId: string,
  partialProfile: PartialProfile,
) => Promise<void>;

export const createProfile = (create: Create) => (
  profile: Profile,
): Promise<Profile> => create({ ...profile, id: uuid() });

export type CreateProfile = (profile: Profile) => Promise<Profile>;

export const getProfile = (getByUserId: GetByUserId) => (
  userId: string,
): Promise<Profile | null> => getByUserId(userId);
export type GetProfile = (userId: string) => Promise<Profile | null>;
