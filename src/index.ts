import express from 'express';
import path from 'path';
import { get, submit, update } from './ProfileController';

const app = express();
const router = express.Router();
const port = 8080;

router.use(express.static(path.resolve(__dirname, '..', 'view')));

router.get('/', get);
router.post('/submit', submit);
router.post('/update', update);

app.use(router);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
