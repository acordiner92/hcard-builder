import express from 'express';
import { get, submit, update } from './ProfileController';

const app = express();
const router = express.Router();
const port = 8080;

router.use('/', get);
router.use('/submit', submit);
router.use('/update', update);

app.use(router);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
