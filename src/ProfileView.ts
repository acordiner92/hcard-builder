import path from 'path';
import fs from 'fs';

import React from 'react';
import ReactDomServer from 'react-dom/server';
import { PartialProfile } from './Profile';
// eslint-disable-next-line @typescript-eslint/no-var-requires

const rootTemplatePath = path.resolve(__dirname, '..', 'view/index.html');

const readRootTemplate = (): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(rootTemplatePath, 'utf-8', (error, data) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(data);
      }
    });
  });

export const render = async (
  partialProfile: PartialProfile | null,
): Promise<string> => {
  const template = require('../view/main').default;

  const rootTemplate = await readRootTemplate();
  const componentTemplate = ReactDomServer.renderToString(
    React.createElement(template, partialProfile ?? {}),
  );
  const view = rootTemplate.replace(
    '<div class="HcardApp" />',
    `<div class="HcardApp">${componentTemplate}</div>`,
  );
  return view;
};
