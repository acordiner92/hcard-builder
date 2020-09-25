/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from 'express';
import path from 'path';
import fs from 'fs';
import { get, submit, update } from './ProfileController';
import { getView } from './ProfileViewController';
import redis from 'redis';
import {
  create,
  getByUserId,
  getPartialByUserId,
  savePartial,
} from './ProfileRepository';
import {
  createProfile,
  getProfile,
  savePartialProfile,
} from './ProfileService';
import { getConnection } from './DbConnection';
import { renderSpa, renderSsr } from './ProfileViewRenderer';
import { v4 as uuid } from 'uuid';
import { IConnectionParameters } from 'pg-promise/typescript/pg-subset';

export type AppConfiguration = {
  readonly postgres: IConnectionParameters;
};

export const initialise = (config: AppConfiguration) => {
  const app = express();
  const router = express.Router();
  const client = redis.createClient();
  const dbConnection = getConnection(config.postgres);

  const partialProfileConfiguration = {
    // we want to store the form values for 1 day maximum since
    // we want to balance how much is stored in redis vs how long we should keep it saved
    // for the user
    ttl: 86400000, // 1 day
  };

  app.use(express.urlencoded({ extended: true }));

  // Setup dependencies via partial application
  const createProfileFn = createProfile(create(dbConnection.client), uuid);
  const getProfileFn = getProfile(getByUserId(dbConnection.client));

  const savePartialProfileFn = savePartialProfile(
    getPartialByUserId(client),
    savePartial(client, partialProfileConfiguration),
  );

  router.get(
    '^/$',
    getView(
      getPartialByUserId(client),
      getProfileFn,
      renderSsr(fs.readFile),
      renderSpa(fs.readFile),
    ),
  );
  router.use(express.static(path.resolve(__dirname, '..', 'view')));

  router.get('/profile', get(getPartialByUserId(client), getProfileFn));
  router.post('/submit', submit(createProfileFn));
  router.post('/update', update(savePartialProfileFn));

  app.use(router);
  return {
    app,
    redisClient: client,
    dbConnection,
  };
};
