import { Profile, PartialProfile } from './Profile';
import { IDatabase } from 'pg-promise';
import { RedisClient } from 'redis';

export const getByUserId = (client: IDatabase<unknown>) => (
  userId: string,
): Promise<Profile | null> =>
  client.oneOrNone<Profile>(
    `
    SELECT id, user_id, given_name, surname, email, phone, house_number, street, suburb, state, postcode, country
    FROM profile
    WHERE user_id=$1
  `,
    [userId],
  );
export type GetByUserId = (userId: string) => Promise<Profile | null>;

export const getPartialByUserId = (redisClient: RedisClient) => (
  userId: string,
): Promise<PartialProfile | null> =>
  new Promise((resolve, reject) => {
    redisClient.get(userId, (error, value) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(value ? (JSON.parse(value) as PartialProfile) : null);
      }
    });
  });
export type GetPartialByUserId = (
  userId: string,
) => Promise<PartialProfile | null>;

export const savePartial = (redisClient: RedisClient) => (
  userId: string,
  partialProfile: PartialProfile,
): Promise<void> =>
  new Promise((resolve, reject) => {
    redisClient.set(userId, JSON.stringify(partialProfile), error => {
      if (error) {
        return reject(error);
      } else {
        return resolve();
      }
    });
  });

export type SavePartial = (
  userId: string,
  partialProfile: PartialProfile,
) => Promise<void>;

export const create = (client: IDatabase<unknown>) => (
  profile: Profile,
): Promise<Profile> =>
  client.one<Profile>(
    `
              INSERT INTO profile
              (id, user_id, given_name, surname, email, phone, house_number, street, suburb, state, postcode, country)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
              RETURNING id, user_id, given_name, surname, email, phone, house_number, street, suburb, state, postcode, country
        `,
    [
      profile.id,
      profile.userId,
      profile.givenName,
      profile.surname,
      profile.email,
      profile.phone,
      profile.houseNumber,
      profile.street,
      profile.suburb,
      profile.state,
      profile.postcode,
      profile.country,
    ],
  );
export type Create = (profile: Profile) => Promise<Profile>;
