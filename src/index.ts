import express from 'express';
import path from 'path';
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

const app = express();
const router = express.Router();
const port = 8080;
const client = redis.createClient();
const dbConnection = getConnection({
  user: 'postgres',
  host: 'localhost',
  database: 'profile_db_test',
  password: 'postgres',
  port: 5432,
});

app.use(express.urlencoded({ extended: true }));

// Setup dependencies via partial application
const createProfileFn = createProfile(create(dbConnection.client));
const getProfileFn = getProfile(getByUserId(dbConnection.client));

const savePartialProfileFn = savePartialProfile(
  getPartialByUserId(client),
  savePartial(client),
);

router.get('^/$', getView(getPartialByUserId(client), getProfileFn));
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
