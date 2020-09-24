import { Profile } from '../src/Profile';
import { v4 as uuid } from 'uuid';

export const createProfile = (): Readonly<Profile> => ({
  id: uuid(),
  accountId: uuid(),
  givenName: 'Sam',
  surname: 'Fairfax',
  email: 'sam.fairfax@fairfaxmedia.com.au',
  phone: '0292822833',
  houseNumber: 100,
  street: 'Harris Street',
  suburb: 'Pyrmont',
  state: 'NSW',
  postcode: '2009',
  country: 'Australia',
});
