import express from 'express';
import path from 'path';
import { get, submit, update } from './ProfileController';
import redis from 'redis';
import { getPartialByAccountId, savePartial } from './ProfileRepository';
import { savePartialProfile } from './ProfileService';

const app = express();
const router = express.Router();
const port = 8080;
const client = redis.createClient();

app.use(express.urlencoded());
router.use(express.static(path.resolve(__dirname, '..', 'view')));

// Setup dependencies via partial application
const savePartialProfileFn = savePartialProfile(
  getPartialByAccountId(client),
  savePartial(client),
);

router.get('/', get);
router.post('/submit', submit);
router.post('/update', update(savePartialProfileFn));

app.use(router);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
