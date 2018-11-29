// @flow
import PropTypes from 'prop-types';

import type {Action} from '../types';
import type {LeaseId} from '$src/leases/types';
import {RentCalculatorTypes} from '$components/enums';

const RentCalculatorType = PropTypes.oneOf([
  RentCalculatorTypes.YEAR,
  RentCalculatorTypes.RANGE,
  RentCalculatorTypes.BILLING_PERIOD,
]);

export type RentForPeriodId = number;

export type RentForPeriodState = {
  byLease: Object,
  isFetching: boolean,
  isSaveClicked: boolean,
};

export type RentForPeriodOptions = {
  id: RentForPeriodId,
  allowDelete: boolean,
  leaseId: LeaseId,
  type: RentCalculatorType,
  startDate: string,
  endDate: string,
}

export type RentForPeriodDeleteOptions = {
  id: RentForPeriodId,
  leaseId: LeaseId,
}

export type RentForPeriod = Object;

export type FetchRentForPeriodAction = Action<'mvj/rentforperiod/FETCH_ALL', RentForPeriodOptions>;
export type ReceiveRentForPeriodByLeaseAction = Action<'mvj/rentforperiod/RECEIVE_BY_LEASE', RentForPeriod>;
export type DeleteRentForPeriodByLeaseAction = Action<'mvj/rentforperiod/DELETE_BY_LEASE', RentForPeriodDeleteOptions>;
export type RentForPeriodNotFoundAction = Action<'mvj/rentforperiod/NOT_FOUND', void>;
export type ReceiveIsSaveClickedAction = Action<'mvj/rentforperiod/RECEIVE_SAVE_CLICKED', boolean>;
