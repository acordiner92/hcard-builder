/* eslint-disable no-var */
import { Request, Response } from 'express';

import React from 'react';
import {
  SavePartialProfile,
  GetPartialProfile,
  CreateProfile,
} from './ProfileService';
import { PartialProfile, Profile } from './Profile';
import { render } from './ProfileView';

// eslint-disable-next-line functional/prefer-type-literal
interface Global {
  // eslint-disable-next-line functional/prefer-readonly-type
  React: any;
}
declare var global: Global;
// eslint-disable-next-line functional/immutable-data
global.React = React;

export const getView = (getPartialProfile: GetPartialProfile) => async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  const partialProfile = await getPartialProfile(
    '2ab748b8-5b3c-4184-acb4-cb3550b8c6de',
  );
  const view = await render(partialProfile);
  return response.send(view);
};

export const get = (getPartialProfile: GetPartialProfile) => async (
  _request: Request,
  response: Response,
): Promise<Response> => {
  const partialProfile = await getPartialProfile(
    '2ab748b8-5b3c-4184-acb4-cb3550b8c6de',
  );
  return response.send(partialProfile);
};

export const submit = (createProfile: CreateProfile) => async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const profile = request.body as Profile;
  const createdProfile = await createProfile({
    ...profile,
    accountId: '2ab748b8-5b3c-4184-acb4-cb3550b8c6de',
  });
  return response.send(createdProfile);
};

export const update = (savePartialProfile: SavePartialProfile) => async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const accountId = '2ab748b8-5b3c-4184-acb4-cb3550b8c6de';
  const partialProfile = request.body as PartialProfile;

  await savePartialProfile(accountId, partialProfile);
  return response.status(204).send();
};
