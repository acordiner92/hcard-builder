import { Request, Response } from 'express';

import {
  SavePartialProfile,
  GetPartialProfile,
  CreateProfile,
  GetProfile,
} from './ProfileService';
import { PartialProfile, Profile } from './Profile';

// Hardcoded user id here but ideally this would be retrieved by
// the stateless auth setup like JWT's
const userId = '2ab748b8-5b3c-4184-acb4-cb3550b8c6de';

/**
 * Gets a profile or partial profile depending
 * of whether user has finished creating the
 * profile or not.
 *
 * @param {Request} _request
 * @param {Response} response
 * @returns {Promise<Response>}
 */
export const get = (
  getPartialProfile: GetPartialProfile,
  getProfile: GetProfile,
) => async (_request: Request, response: Response): Promise<Response> => {
  const profile = await getProfile('2ab748b8-5b3c-4184-acb4-cb3550b8c6de');
  if (profile) {
    return response.send(profile);
  } else {
    const partialProfile = await getPartialProfile(
      '2ab748b8-5b3c-4184-acb4-cb3550b8c6de',
    );
    if (partialProfile) {
      return response.send(partialProfile);
    } else {
      return response.status(404).send();
    }
  }
};

/**
 * Creates a new profile.
 *
 * @param {Request} request
 * @param {Response} response
 * @returns {Promise<Response>}
 */
export const submit = (createProfile: CreateProfile) => async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const profile = request.body as Profile;
  const createdProfile = await createProfile({
    ...profile,
    userId,
  });
  return response.send(createdProfile);
};

/**
 * Upserts the partial profile (saving values as user moves through form).
 *
 * @param {Request} request
 * @param {Response} response
 * @returns {Promise<Response>}
 */
export const update = (savePartialProfile: SavePartialProfile) => async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const partialProfile = request.body as PartialProfile;

  await savePartialProfile(userId, partialProfile);
  return response.status(204).send();
};
