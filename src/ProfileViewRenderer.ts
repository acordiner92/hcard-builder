import path from 'path';
import fs from 'fs';

import React from 'react';
import ReactDomServer from 'react-dom/server';
import { PartialProfile } from './Profile';

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

export const renderSsr = async (
  profileProps: PartialProfile | null,
): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const template = require('../view/main').default;

  const rootTemplate = await readRootTemplate();
  const componentTemplate = ReactDomServer.renderToString(
    React.createElement(template, profileProps),
  );
  const view = rootTemplate.replace(
    '<div class="HcardApp" />',
    `<div class="HcardApp">${componentTemplate}</div>`,
  );
  return view;
};

export const renderSPA = (): Promise<string> => readRootTemplate();