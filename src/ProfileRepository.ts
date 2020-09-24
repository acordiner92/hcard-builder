import { Profile } from './Profile';
import { IDatabase } from 'pg-promise';

export const getByAccountId = (client: IDatabase<unknown>) => (
  accountId: string,
): Promise<Profile | null> =>
  client.oneOrNone<Profile>(
    `
    SELECT id, account_id, given_name, surname, email, phone, house_number, street, suburb, state, postcode, country
    FROM profile
    WHERE account_id=$1
  `,
    [accountId],
  );

export const create = (client: IDatabase<unknown>) => (
  profile: Profile,
): Promise<Profile> =>
  client.one<Profile>(
    `
              INSERT INTO profile
              (id, account_id, given_name, surname, email, phone, house_number, street, suburb, state, postcode, country)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
              RETURNING id, account_id, given_name, surname, email, phone, house_number, street, suburb, state, postcode, country
        `,
    [
      profile.id,
      profile.accountId,
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

export const update = (client: IDatabase<unknown>) => (
  profile: Profile,
): Promise<null> =>
  client.none(
    `
                UPDATE profile
                SET given_name=$1, surname=$2, email=$3, phone=$4, house_number=$5, street=$6, 
                suburb=$7, state=$8, postcode=$9, country=$10
                WHERE account_id=$11
          `,
    [
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
      profile.accountId,
    ],
  );
