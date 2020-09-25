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
import React from 'react';
import { renderSpa, renderSsr } from './ProfileViewRenderer';
import { v4 as uuid } from 'uuid';

export const app = express();
const router = express.Router();
const port = 8080;
export const client = redis.createClient();
export const dbConnection = getConnection({
  user: 'postgres',
  host: 'localhost',
  database: 'profile_db_test',
  password: 'postgres',
  port: 5432,
});

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

// load react into global for spa render
// eslint-disable-next-line functional/immutable-data
global.React = React;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
