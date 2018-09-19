// @flow
import {createAction} from 'redux-actions';

import type {
  PreviewInvoices,
  PreviewInvoicesFetchPayload,
  FetchPreviewInvoicesAction,
  ReceivePreviewInvoicesAction,
  ClearPreviewInvoicesAction,
  PreviewInvoicesNotFoundAction,
} from './types';

export const fetchPreviewInvoices = (payload: PreviewInvoicesFetchPayload): FetchPreviewInvoicesAction =>
  createAction('mvj/previewInvoices/FETCH_ALL')(payload);

export const receivePreviewInvoices = (previewInvoices: PreviewInvoices): ReceivePreviewInvoicesAction =>
  createAction('mvj/previewInvoices/RECEIVE_ALL')(previewInvoices);

export const clearPreviewInvoices = (): ClearPreviewInvoicesAction =>
  createAction('mvj/previewInvoices/CLEAR')();


export const notFound = (): PreviewInvoicesNotFoundAction =>
  createAction('mvj/previewInvoices/NOT_FOUND')();
