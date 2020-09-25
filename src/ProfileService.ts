import { PartialProfile, Profile } from './Profile';
import {
  SavePartial,
  GetPartialByUserId,
  Create,
  GetByUserId,
} from './ProfileRepository';
import { v4 as uuid } from 'uuid';

/**
 * Gets a partial profile by user id.
 *
 * @param {string} userId
 * @returns {(Promise<PartialProfile | null>)}
 */
export const getPartialProfile = (getPartialByUserId: GetPartialByUserId) => (
  userId: string,
): Promise<PartialProfile | null> => getPartialByUserId(userId);

export type GetPartialProfile = (
  userId: string,
) => Promise<PartialProfile | null>;

/**
 * Upserts a partial profile.
 *
 * @param {string} userId
 * @param {PartialProfile} partialProfile
 * @returns {Promise<void>}
 */
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

/**
 * Creates a new profile.
 *
 * @param {Profile} profile
 * @returns {Promise<Profile>}
 */
export const createProfile = (create: Create) => (
  profile: Profile,
): Promise<Profile> => create({ ...profile, id: uuid() });

export type CreateProfile = (profile: Profile) => Promise<Profile>;

/**
 * Gets a profile by user id.
 *
 * @param {string} userId
 * @returns {(Promise<Profile | null>)}
 */
export const getProfile = (getByUserId: GetByUserId) => (
  userId: string,
): Promise<Profile | null> => getByUserId(userId);
export type GetProfile = (userId: string) => Promise<Profile | null>;
