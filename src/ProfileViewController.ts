/* eslint-disable no-var */
import { Request, Response } from 'express';
import { GetPartialProfile, GetProfile } from './ProfileService';
import { RenderSpa, RenderSsr } from './ProfileViewRenderer';

// For this demo I am hardcoded this variable as a boolean
// Ideally in a real life situation we would get a value out of
// cookie to indicate whether the user has no js support or not.
// https://www.codeproject.com/Tips/1217469/How-to-Detect-if-Client-has-JavaScript-Enabled-Dis
const shouldRenderSsr = false;

// Hardcoded user id here but ideally this would be retrieved by
// the stateless auth setup like JWT's
const userId = '2ab748b8-5b3c-4184-acb4-cb3550b8c6de';

/**
 * Gets the profile view as SSR or SPA
 * depending if client has JS support or not.
 *
 * @param {Request} request
 * @param {Response} response
 * @returns {Promise<Response>}
 */
export const getView = (
  getPartialProfile: GetPartialProfile,
  getProfile: GetProfile,
  renderSsr: RenderSsr,
  renderSpa: RenderSpa,
) => async (_request: Request, response: Response): Promise<Response> => {
  if (shouldRenderSsr) {
    const profile = await getProfile(userId);
    if (profile) {
      const view = await renderSsr({ ...profile });
      return response.send(view);
    } else {
      const partialProfile = await getPartialProfile(userId);
      const view = await renderSsr(partialProfile);
      return response.send(view);
    }
  } else {
    const spa = await renderSpa();
    return response.send(spa);
  }
};
