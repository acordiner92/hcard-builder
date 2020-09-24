export const AustralianState = {
  nsw: 'NSW',
  qld: 'QLD',
  act: 'ACT',
  vic: 'VIC',
  sa: 'SA',
  tas: 'TAS',
  nt: 'NT',
  wa: 'WA',
} as const;
export type AustralianState = typeof AustralianState[keyof typeof AustralianState];

export type Profile = {
  readonly id: string;
  readonly userId: string;
  readonly givenName: string;
  readonly surname: string;
  readonly email: string;
  readonly phone: string;
  readonly houseNumber: string;
  readonly street: string;
  readonly suburb: string;
  readonly state: AustralianState;
  readonly postcode: string;
  readonly country: string;
};

export type PartialProfile = {
  readonly givenName?: string;
  readonly surname?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly houseNumber?: string;
  readonly street?: string;
  readonly suburb?: string;
  readonly state?: AustralianState;
  readonly postcode?: string;
  readonly country?: string;
};
