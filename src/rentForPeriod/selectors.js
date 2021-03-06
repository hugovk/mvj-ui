// @flow
import type {Selector} from '$src/types';
import type {RootState} from '../root/types';
import type {RentForPeriod} from './types';

import type {LeaseId} from '$src/leases/types';

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.rentForPeriod.isFetching;

export const getRentForPeriodArrayByLease: Selector<RentForPeriod, LeaseId> = (state: RootState, leaseId: LeaseId): RentForPeriod => {
  return state.rentForPeriod.byLease[leaseId];
};

export const getIsSaveClicked: Selector<boolean, void> = (state: RootState): boolean =>
  state.rentForPeriod.isSaveClicked;
