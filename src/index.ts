import express from 'express';
import path from 'path';
import { get, getView, submit, update } from './ProfileController';
import redis from 'redis';
import {
  create,
  getPartialByAccountId,
  savePartial,
} from './ProfileRepository';
import { createProfile, savePartialProfile } from './ProfileService';
import { getConnection } from './DbConnection';

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
router.get('^/$', getView(getPartialByAccountId(client)));

router.use(express.static(path.resolve(__dirname, '..', 'view')));

// Setup dependencies via partial application
const createProfileFn = createProfile(create(dbConnection.client));

const savePartialProfileFn = savePartialProfile(
  getPartialByAccountId(client),
  savePartial(client),
);

router.get('/profile', get(getPartialByAccountId(client)));
router.post('/submit', submit(createProfileFn));
router.post('/update', update(savePartialProfileFn));

app.use(router);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
