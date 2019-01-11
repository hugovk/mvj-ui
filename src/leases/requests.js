// @flow
import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import type {CreateChargePayload, LeaseId, Lease} from './types';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('lease/'), {method: 'OPTIONS'}));
};

export const fetchLeases = (search: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${search || ''}`)));
};

export const fetchSingleLease = (id: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${id}/`)));
};

export const createLease = (lease: Lease): Generator<any, any, any> => {
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/`), {
    method: 'POST',
    body,
  }));
};

export const patchLease = (lease: Lease): Generator<any, any, any> => {
  const {id} = lease;
  const body = JSON.stringify(lease);

  return callApi(new Request(createUrl(`lease/${id}/`), {
    method: 'PATCH',
    body,
  }));
};

export const copyAreasToContract = (leaseId: LeaseId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease_copy_areas_to_contract/?lease=${leaseId}`), {
    method: 'POST',
  }));
};

export const createCharge = (payload: CreateChargePayload): Generator<any, any, any> => {
  const {leaseId, data} = payload;
  const body = JSON.stringify(data);

  return callApi(new Request(createUrl(`lease/${leaseId}/create_charge/`), {
    method: 'POST',
    body,
  }));
};

export const startInvoicing = (leaseId: LeaseId): Generator<any, any, any> => {
  const body = JSON.stringify({invoicing_enabled: true});

  return callApi(new Request(createUrl(`lease/${leaseId}/set_invoicing_state/`), {
    method: 'POST',
    body,
  }));
};

export const stopInvoicing = (leaseId: LeaseId): Generator<any, any, any> => {
  const body = JSON.stringify({invoicing_enabled: false});

  return callApi(new Request(createUrl(`lease/${leaseId}/set_invoicing_state/`), {
    method: 'POST',
    body,
  }));
};

export const setRentInfoComplete = (leaseId: LeaseId): Generator<any, any, any> => {
  const body = JSON.stringify({rent_info_complete: true});

  return callApi(new Request(createUrl(`lease_set_rent_info_completion_state/?lease=${leaseId}`), {
    method: 'POST',
    body,
  }));
};

export const setRentInfoUncomplete = (leaseId: LeaseId): Generator<any, any, any> => {
  const body = JSON.stringify({rent_info_complete: false});

  return callApi(new Request(createUrl(`lease_set_rent_info_completion_state/?lease=${leaseId}`), {
    method: 'POST',
    body,
  }));
};
