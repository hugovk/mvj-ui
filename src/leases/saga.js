// @flow
import {all, call, fork, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';

import {getRouteById} from '../root/routes';
import {
  fetchSingleLease as fetchSingleLeaseAction,
  hideContactModal,
  hideEditMode,
  hideDeleteRelatedLeaseModal,
  notFound,
  notFoundById,
  receiveAttributes,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  receiveLeases,
  receiveSingleLease,
  receiveLeaseById,
} from './actions';
import {fetchInvoicesByLease, receiveIsCreateInvoicePanelOpen} from '$src/invoices/actions';
import {fetchInvoiceSetsByLease} from '$src/invoiceSets/actions';
import {
  createCharge,
  createLease,
  fetchAttributes,
  fetchLeases,
  fetchSingleLease,
  patchLease,
  createRelatedLease,
  deleteReleatedLease,
} from './requests';
import {getContactModalSettings} from './selectors';
import {
  createContact,
  editContact,
} from '../contacts/requests';
import {receiveError} from '../api/actions';

function* fetchAttributesSaga(): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const attributes = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveAttributes(attributes));
        break;
      case 404:
      case 500:
        break;
    }
  } catch (error) {
    console.error('Failed to fetch identifiers with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchLeasesSaga({payload: search}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchLeases, search);

    switch (statusCode) {
      case 200:
        yield put(receiveLeases(bodyAsJson));
        break;
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchSingleLeaseSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleLease, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        break;
      case 404:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* fetchLeaseByIdSaga({payload: id}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleLease, id);

    switch (statusCode) {
      case 200:
        yield put(receiveLeaseById({leaseId: id, lease: bodyAsJson}));
        break;
      default:
        yield put(notFoundById(id));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch lease by id with error "%s"', error);
    yield put(notFoundById(id));
  }
}

function* createLeaseSaga({payload: lease}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createLease, lease);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById('leases')}/${bodyAsJson.id}`));
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* patchLeaseSaga({payload: lease}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(fetchSingleLeaseAction(lease.id));
        yield put(receiveIsSaveClicked(false));
        yield put(hideEditMode());
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({_error: 'Server error 400', ...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit lease with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* startInvoicingSaga({payload: leaseId}): Generator<any, any, any> {
  try {
    const lease = {
      id: leaseId,
      is_invoicing_enabled: true,
    };
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        break;
      case 400:
        yield put(receiveError(new SubmissionError({_error: 'Server error 400', ...bodyAsJson})));
        break;
      case 500:
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to start invoicing with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* stopInvoicingSaga({payload: leaseId}): Generator<any, any, any> {
  try {
    const lease = {
      id: leaseId,
      is_invoicing_enabled: false,
    };
    const {response: {status: statusCode}, bodyAsJson} = yield call(patchLease, lease);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleLease(bodyAsJson));
        break;
      case 400:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({_error: 'Server error 400', ...bodyAsJson})));
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to stop invoicing with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createContactSaga({payload: contact}): Generator<any, any, any> {
  try {
    const contactModalSettings = yield select(getContactModalSettings);
    const isSelected = contact.isSelected ? true : false;
    contact.isSelected = undefined;

    const {response: {status: statusCode}, bodyAsJson} = yield call(createContact, contact);

    switch (statusCode) {
      case 201:
        if (isSelected) {
          contactModalSettings.contact = bodyAsJson;
          yield put(receiveContactModalSettings(contactModalSettings));
        }
        yield put(hideContactModal());
        break;
      case 400:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to create contact with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* editContactSaga({payload: contact}): Generator<any, any, any> {
  try {
    const contactModalSettings = yield select(getContactModalSettings);
    const {response: {status: statusCode}, bodyAsJson} = yield call(editContact, contact);

    switch (statusCode) {
      case 200:
        contactModalSettings.contact = bodyAsJson;
        yield put(receiveContactModalSettings(contactModalSettings));
        yield put(hideContactModal());
        break;
      case 400:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
      case 500:
        yield put(receiveError(new Error(bodyAsJson)));
        break;
    }
  } catch (error) {
    console.error('Failed to edit contact with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* createReleatedLeaseSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson: bodyDelete} = yield call(createRelatedLease, payload);

    switch (statusCode) {
      case 201:
        const {response: {status}, bodyAsJson} = yield call(fetchSingleLease, payload.from_lease);

        switch (status) {
          case 200:
            yield put(receiveSingleLease(bodyAsJson));
            break;
          default:
            yield put(receiveError(new SubmissionError({...bodyAsJson})));
            break;
        }
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyDelete})));
        break;
    }
  } catch (error) {
    console.error('Failed to create related lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* createChargeSaga({payload}): Generator<any, any, any> {
  try {
    const {leaseId} = payload;
    const {response: {status: statusCode}, bodyAsJson} = yield call(createCharge, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchInvoicesByLease(leaseId));
        yield put(fetchInvoiceSetsByLease(leaseId));
        yield put(receiveIsCreateInvoicePanelOpen(false));
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to create charge with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteReleatedLeaseSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson: bodyDelete} = yield call(deleteReleatedLease, payload.id);

    switch (statusCode) {
      case 204:
        yield put(hideDeleteRelatedLeaseModal());

        const {response: {status}, bodyAsJson} = yield call(fetchSingleLease, payload.leaseId);

        switch (status) {
          case 200:
            yield put(receiveSingleLease(bodyAsJson));
            break;
          default:
            yield put(receiveError(new SubmissionError({...bodyAsJson})));
            break;
        }
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyDelete})));
        break;
    }
  } catch (error) {
    console.error('Failed to delete related lease with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/leases/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/leases/FETCH_ALL', fetchLeasesSaga);
      yield takeLatest('mvj/leases/FETCH_SINGLE', fetchSingleLeaseSaga);
      yield takeEvery('mvj/leases/FETCH_BY_ID', fetchLeaseByIdSaga);
      yield takeLatest('mvj/leases/CREATE', createLeaseSaga);
      yield takeLatest('mvj/leases/PATCH', patchLeaseSaga);
      yield takeLatest('mvj/leases/START_INVOICING', startInvoicingSaga);
      yield takeLatest('mvj/leases/STOP_INVOICING', stopInvoicingSaga);
      yield takeLatest('mvj/leases/CREATE_CONTACT', createContactSaga);
      yield takeLatest('mvj/leases/EDIT_CONTACT', editContactSaga);
      yield takeLatest('mvj/leases/CREATE_CHARGE', createChargeSaga);
      yield takeLatest('mvj/leases/CREATE_RELATED_LEASE', createReleatedLeaseSaga);
      yield takeLatest('mvj/leases/DELETE_RELATED_LEASE', deleteReleatedLeaseSaga);
    }),
  ]);
}
