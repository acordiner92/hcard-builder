import path from 'path';
import fs from 'fs';

import React from 'react';
import ReactDomServer from 'react-dom/server';
import { PartialProfile } from './Profile';

const rootTemplatePath = path.resolve(__dirname, '..', 'view/index.html');

type ReadFile = typeof fs.readFile;

const readRootTemplate = (readFile: ReadFile) => (): Promise<string> =>
  new Promise((resolve, reject) => {
    readFile(rootTemplatePath, 'utf-8', (error, data) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(data);
      }
    });
  });

/**
 * Renders the profile page as static html via
 * React
 *
 * @param {(PartialProfile | null)} profileProps
 * @returns {Promise<string>}
 */
export const renderSsr = (profileProps: PartialProfile | null): string => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const template = require('../view/main').default;

  const componentTemplate = ReactDomServer.renderToString(
    React.createElement(template, profileProps),
  );
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Live hCard Preview</title>

      <link href="css/bootstrap.min.css" rel="stylesheet" />
      <link href="css/main.css" rel="stylesheet" />
    </head>

    <body>
    ${componentTemplate}
    </body>
  </html>
  `;
};
export type RenderSsr = (profileProps: PartialProfile | null) => string;

/**
 * Renders the profile view index.html.
 *
 * @returns {Promise<string>}
 */
export const renderSpa = (readFile: ReadFile) => (): Promise<string> =>
  readRootTemplate(readFile)();

export type RenderSpa = () => Promise<string>;
