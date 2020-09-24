import { PartialProfile } from './Profile';
import { SavePartial, GetPartialByAccountId } from './ProfileRepository';

export const savePartialProfile = (
  getPartialByAccountId: GetPartialByAccountId,
  savePartial: SavePartial,
) => async (
  accountId: string,
  partialProfile: PartialProfile,
): Promise<void> => {
  const existingPartialProfile = await getPartialByAccountId(accountId);
  const updatedPartialProfile = existingPartialProfile
    ? {
        ...existingPartialProfile,
        ...partialProfile,
      }
    : partialProfile;

  await savePartial(accountId, updatedPartialProfile);
};
export type SavePartialProfile = (
  accountId: string,
  partialProfile: PartialProfile,
) => Promise<void>;
