/* eslint-disable no-var */
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDomServer from 'react-dom/server';
import { SavePartialProfile } from './ProfileService';
import { PartialProfile } from './Profile';

// eslint-disable-next-line functional/prefer-type-literal
interface Global {
  // eslint-disable-next-line functional/prefer-readonly-type
  React: any;
}
declare var global: Global;
// eslint-disable-next-line functional/immutable-data
global.React = React;

export const get = (request: Request, response: Response): any => {
  const hCardComponent = require('../view/main.js').default;
  const hCardApp = ReactDomServer.renderToString(
    React.createElement(hCardComponent, {
      givenName: 'Sam',
      surname: 'Fairfax',
      email: 'sam.fairfax@fairfaxmedia.com.au',
      phone: '0292822833',
      houseNumber: '100',
      street: 'Harris Street',
      suburb: 'Pyrmont',
      state: 'NSW',
      postcode: '2009',
      country: 'Australia',
    }),
  );
  fs.readFile(
    path.resolve(__dirname, '..', 'view/index.html'),
    'utf-8',
    (error, data) => {
      if (error) {
        console.log(error);
        return response.status(500).send('error has occured');
      } else {
        return response.send(
          data.replace(
            '<div class="HcardApp" />',
            `<div class="HcardApp">${hCardApp}</div>`,
          ),
        );
      }
    },
  );
};

export const submit = (request: Request, response: Response): Response => {
  console.log('submit');
  return response.send('submit');
};

export const update = (savePartialProfile: SavePartialProfile) => async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const accountId = '2ab748b8-5b3c-4184-acb4-cb3550b8c6de';
  const partialProfile = request.body as PartialProfile;

  await savePartialProfile(accountId, partialProfile);
  return response.send();
};
