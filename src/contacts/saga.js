// @flow

import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import {push} from 'react-router-redux';
import {SubmissionError} from 'redux-form';

import {displayUIMessage} from '$util/helpers';
import {getRouteById} from '../root/routes';

import {
  hideEditMode,
  receiveAttributes,
  receiveContacts,
  receiveSingleContact,
  notFound,
} from './actions';

import {receiveError} from '$src/api/actions';

import {
  createContact,
  editContact,
  fetchAttributes,
  fetchContacts,
  fetchSingleContact,
} from './requests';

function* fetchAttributesSaga(): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchAttributes);
    const attributes = bodyAsJson.fields;

    switch (statusCode) {
      case 200:
        yield put(receiveAttributes(attributes));
        break;
      case 401:
      case 404:
      case 500:
        yield put(notFound());
        break;
    }
  } catch (error) {
    console.error('Failed to fetch identifiers with error "%s"', error);
    yield put(receiveError(error));
  }
}

function* fetchContactsSaga({payload: search}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchContacts, search);
    const contacts = bodyAsJson.results;
    switch (statusCode) {
      case 200:
        yield put(receiveContacts(contacts));
        break;
      case 401:
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

function* fetchSingleContactSaga({payload: id}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(fetchSingleContact, id);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleContact(bodyAsJson));
        break;
      case 401:
      case 404:
        break;
      case 500:
        yield put(notFound());
        yield put(receiveError(new SubmissionError({...bodyAsJson})));
        break;
    }
  } catch (error) {
    console.error('Failed to fetch leases with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* createContactSaga({payload: contact}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(createContact, contact);

    switch (statusCode) {
      case 201:
        yield put(push(`${getRouteById('contacts')}/${bodyAsJson.id}`));
        displayUIMessage({title: 'Asiakas tallennettu', body: 'Asiakas on tallennettu onnistuneesti'});
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
    console.error('Failed to create contact with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

function* editContactSaga({payload: contact}): Generator<> {
  try {
    const {response: {status: statusCode}, bodyAsJson} = yield call(editContact, contact);

    switch (statusCode) {
      case 200:
        yield put(receiveSingleContact(bodyAsJson));
        yield put(hideEditMode());
        displayUIMessage({title: 'Asiakas tallennettu', body: 'Asiakas on tallennettu onnistuneesti'});
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
    console.error('Failed to edit contact with error "%s"', error);
    yield put(notFound());
    yield put(receiveError(error));
  }
}

export default function*(): Generator<> {
  yield [
    fork(function*(): Generator<> {
      yield takeLatest('mvj/contacts/FETCH_ATTRIBUTES', fetchAttributesSaga);
      yield takeLatest('mvj/contacts/FETCH_ALL', fetchContactsSaga);
      yield takeLatest('mvj/contacts/FETCH_SINGLE', fetchSingleContactSaga);
      yield takeLatest('mvj/contacts/CREATE', createContactSaga);
      yield takeLatest('mvj/contacts/EDIT', editContactSaga);
    }),
  ];
}
