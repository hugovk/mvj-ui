// @flow

import {createAction} from 'redux-actions';

import type {LeaseId} from '$src/leases/types';

import type {
  Attributes,
  Comment,
  FetchAttributesAction,
  ReceiveAttributesAction,
  FetchCommentsByLeaseAction,
  CreateCommentAction,
  EditCommentAction,
  ReceiveCommentsByLeaseAction,
  CommentNotFoundAction,
} from './types';

export const notFound = (): CommentNotFoundAction =>
  createAction('mvj/comments/NOT_FOUND')();

export const fetchAttributes = (): FetchAttributesAction =>
  createAction('mvj/comments/FETCH_ATTRIBUTES')();

export const receiveAttributes = (identifiers: Attributes): ReceiveAttributesAction =>
  createAction('mvj/comments/RECEIVE_ATTRIBUTES')(identifiers);

export const fetchCommentsByLease = (leaseId: LeaseId): FetchCommentsByLeaseAction =>
  createAction('mvj/comments/FETCH_BY_LEASE')(leaseId);

export const receiveCommentsByLease = (comments: Comment): ReceiveCommentsByLeaseAction =>
  createAction('mvj/comments/RECEIVE_BY_LEASE')(comments);

export const createComment = (comment: Comment): CreateCommentAction =>
  createAction('mvj/comments/CREATE')(comment);

export const editComment = (comment: Comment): EditCommentAction =>
  createAction('mvj/comments/EDIT')(comment);