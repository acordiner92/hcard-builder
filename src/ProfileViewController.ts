/* eslint-disable no-var */
import { Request, Response } from 'express';
import { GetPartialProfile, GetProfile } from './ProfileService';
import { RenderSpa, RenderSsr } from './ProfileViewRenderer';

export const getView = (
  getPartialProfile: GetPartialProfile,
  getProfile: GetProfile,
  renderSsr: RenderSsr,
  renderSpa: RenderSpa,
) => async (request: Request, response: Response): Promise<Response> => {
  const shouldSsr = request.cookies && request.cookies['hasJs'] === 'false';
  if (shouldSsr) {
    const profile = await getProfile('2ab748b8-5b3c-4184-acb4-cb3550b8c6de');
    if (profile) {
      const view = await renderSsr({ ...profile });
      return response.send(view);
    } else {
      const partialProfile = await getPartialProfile(
        '2ab748b8-5b3c-4184-acb4-cb3550b8c6de',
      );
      const view = await renderSsr(partialProfile);
      return response.send(view);
    }
  } else {
    const spa = await renderSpa();
    return response.send(spa);
  }
};
