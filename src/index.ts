import React from 'react';
import { initialise } from './App';

// load react into global for spa render
// eslint-disable-next-line functional/immutable-data
global.React = React;
const config = {
  postgres: {
    user: 'postgres',
    host: 'localhost',
    database: 'profile_db',
    password: 'postgres',
    port: 5432,
  },
};
const port = 8080;
const { app } = initialise(config);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
