import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useProfile() {
  return useQuery(api.functions.getProfile.getProfile, {});
}
