import { Profile } from './Profile';
import { IDatabase } from 'pg-promise';

export const create = (client: IDatabase<unknown>) => (
  profile: Profile,
): Promise<Profile> =>
  client.one<Profile>(
    `
              INSERT INTO profile
              (id, given_name, surname, email, phone, house_number, street, suburb, state, postcode, country)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
              RETURNING id, given_name, surname, email, phone, house_number, street, suburb, state, postcode, country
        `,
    [
      profile.id,
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
