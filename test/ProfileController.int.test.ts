import request from 'supertest';
import { app, client as redisClient, dbConnection } from '../src';

describe('ProfileController', () => {
  const flushRedis = (): Promise<void> =>
    new Promise((resolve, reject) => {
      redisClient.flushall(error => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      });
    });

  beforeEach(async () => {
    await flushRedis();
    await dbConnection.client.none('TRUNCATE profile CASCADE');
  });

  afterAll(async () => {
    await dbConnection.connection.end();
    redisClient.end(true);
  });

  describe('get', () => {
    test('partial profile is returned if no profile exists', async () => {
      await request(app).post('/update').send('givenName=jimbo');

      const response = await request(app).get('/profile');
      expect(response.body).toStrictEqual({
        givenName: 'jimbo',
      });
    });

    test('profile is returned if exists', async () => {
      await request(app).post('/update').send('givenName=jimbo');
      await request(app)
        .post('/submit')
        .send(
          'givenName=Sam&surname=Fairfax&email=sam.fairfax%40fairfaxmedia.com.au&phone=0292822833&houseNumber=100&street=Harris+Street&suburb=Pyrmont&state=NSW&postcode=2009&country=Australia',
        );

      const response = await request(app).get('/profile');
      expect(response.body.id).toBeDefined();
    });
  });

  describe('submit', () => {
    test('new profile is created', async () => {
      await request(app)
        .post('/submit')
        .send(
          'givenName=Sam&surname=Fairfax&email=sam.fairfax%40fairfaxmedia.com.au&phone=0292822833&houseNumber=100&street=Harris+Street&suburb=Pyrmont&state=NSW&postcode=2009&country=Australia',
        );

      const response = await request(app).get('/profile');
      expect(response.body).toEqual(
        expect.objectContaining({
          givenName: 'Sam',
          surname: 'Fairfax',
          email: 'sam.fairfax@fairfaxmedia.com.au',
          phone: '0292822833',
          houseNumber: '100',
          street: 'Harris Street',
          suburb: 'Pyrmont',
          state: 'NSW',
          postcode: '2009',
          country: 'Australia',
        }),
      );
    });
  });

  describe('update', () => {
    test('partial profile gets updated', async () => {
      await request(app).post('/update').send('surname=potter');

      const response = await request(app).get('/profile');
      expect(response.body).toStrictEqual({
        surname: 'potter',
      });
    });
  });
});
