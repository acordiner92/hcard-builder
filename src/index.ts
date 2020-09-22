import express from 'express';

const app = express();
const router = express.Router();
const port = 8080;

router.use('^/$', (_, response) => response.send('hello world'));

app.use(router);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
