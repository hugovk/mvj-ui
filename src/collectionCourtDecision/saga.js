// @flow
import {all, call, fork, put, select, takeLatest} from 'redux-saga/effects';
import {SubmissionError} from 'redux-form';

import {receiveError} from '$src/api/actions';
import {
  fetchCollectionCourtDecisionsByLease as fetchCollectionCourtDecisionsByLeaseAction,
  receiveCollectionCourtDecisionsByLease,
  notFoundByLease,
} from './actions';
import {displayUIMessage} from '../util/helpers';
import {
  fetchCollectionCourtDecisionsByLease,
  uploadCollectionCourtDecision,
  deleteCollectionCourtDecision,
} from './requests';
import {getCollectionCourtDecisionsByLease} from './selectors';

function* fetchCollectionCourtDecisionsByLeaseSaga({payload: lease}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchCollectionCourtDecisionsByLease, lease);

    switch (statusCode) {
      case 200:
        yield put(receiveCollectionCourtDecisionsByLease({lease: lease, collectionCourtDecisions: bodyAsJson.results}));
        break;
      default:
        yield put(notFoundByLease(lease));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch collection court decisoins by lease with error "%s"', error);
    yield put(notFoundByLease(lease));
  }
}

function* uploadCollectionCourtDecisionSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(uploadCollectionCourtDecision, payload);

    switch (statusCode) {
      case 201:
        yield put(fetchCollectionCourtDecisionsByLeaseAction(payload.data.lease));
        displayUIMessage({title: '', body: 'Käräjäoikeuden päätös tallennettu'});
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to upload collection court decision with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* deleteCollectionCourtDecisionSaga({payload}): Generator<any, any, any> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(deleteCollectionCourtDecision, payload.id);

    switch (statusCode) {
      case 204:
        const currentDecisions = yield select(getCollectionCourtDecisionsByLease, payload.lease);
        yield put(receiveCollectionCourtDecisionsByLease({
          lease: payload.lease,
          collectionCourtDecisions: currentDecisions.filter((decision) => decision.id !== payload.id)}
        ));
        displayUIMessage({title: '', body: 'Käräjäoikeuden päätös poistettu'});
        break;
      default:
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to delete collection court decision with error "%s"', error);
    yield put(receiveError(error));
  }
}

export default function*(): Generator<any, any, any> {
  yield all([
    fork(function*(): Generator<any, any, any> {
      yield takeLatest('mvj/collectionCourtDecision/FETCH_BY_LEASE', fetchCollectionCourtDecisionsByLeaseSaga);
      yield takeLatest('mvj/collectionCourtDecision/UPLOAD', uploadCollectionCourtDecisionSaga);
      yield takeLatest('mvj/collectionCourtDecision/DELETE', deleteCollectionCourtDecisionSaga);
    }),
  ]);
}