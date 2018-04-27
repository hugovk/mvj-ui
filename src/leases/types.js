// @flow

import type {Action} from '../types';
import type {Contact} from '$src/contacts/types';

export type LeaseState = Object;

export type ContactModalSettings = Object | null;

export type Attributes = Object;
export type Lease = Object;
export type LeaseList = Object;
export type LeaseId = number;
export type LessorList = Array<Object>;

export type FetchAttributesAction = Action<'mvj/leases/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leases/RECEIVE_ATTRIBUTES', Attributes>;
export type FetchLeasesAction = Action<'mvj/leases/FETCH_ALL', string>;
export type ReceiveLeasesAction = Action<'mvj/leases/RECEIVE_ALL', LeaseList>;
export type FetchSingleLeaseAction = Action<'mvj/leases/FETCH_SINGLE', LeaseId>;
export type ReceiveSingleLeaseAction = Action<'mvj/leases/RECEIVE_SINGLE', Lease>;
export type CreateLeaseAction = Action<'mvj/leases/CREATE', Lease>;
export type PatchLeaseAction = Action<'mvj/leases/PATCH', Lease>;
export type StartInvoicingAction = Action<'mvj/leases/START_INVOICING', LeaseId>;
export type StopInvoicingAction = Action<'mvj/leases/STOP_INVOICING', LeaseId>;
export type LeaseNotFoundAction = Action<'mvj/leases/NOT_FOUND', void>;

export type HideContactModalAction = Action<'mvj/leases/HIDE_CONTACT_MODAL', void>;
export type ShowContactModalAction = Action<'mvj/leases/SHOW_CONTACT_MODAL', void>;
export type ReceiveContactModalSettingsAction = Action<'mvj/leases/RECEIVE_CONTACT_SETTINGS', ContactModalSettings>;
export type CreateContactAction = Action<'mvj/leases/CREATE_CONTACT', Contact>;
export type EditContactAction = Action<'mvj/leases/EDIT_CONTACT', Contact>;

export type FetchLessorsAction = Action<'mvj/leases/FETCH_LESSORS', void>;
export type ReceiveLessorsAction = Action<'mvj/leases/RECEIVE_LESSORS', LessorList>;

export type HideEditModeAction = Action<'mvj/leases/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/leases/SHOW_EDIT', void>;

export type ClearFormValidityFlagsAction = Action<'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS', void>
export type ReceiveConstructabilityFormValidAction = Action<'mvj/leases/RECEIVE_CONSTRUCTABILITY_FORM_VALID', boolean>;
export type ReceiveContractsFormValidAction = Action<'mvj/leases/RECEIVE_CONTRACTS_FORM_VALID', boolean>;
export type ReceiveDecisionsFormValidAction = Action<'mvj/leases/RECEIVE_DECISIONS_FORM_VALID', boolean>;
export type ReceiveInspectionsFormValidAction = Action<'mvj/leases/RECEIVE_INSPECTIONS_FORM_VALID', boolean>;
export type ReceiveLeaseAreasFormValidAction = Action<'mvj/leases/RECEIVE_LEASE_AREAS_FORM_VALID', boolean>;
export type ReceiveLeaseInfoFormValidAction = Action<'mvj/leases/RECEIVE_LEASE_INFO_FORM_VALID', boolean>;
export type ReceiveRentsFormValidAction = Action<'mvj/leases/RECEIVE_RENTS_FORM_VALID', boolean>;
export type ReceiveSummaryFormValidAction = Action<'mvj/leases/RECEIVE_SUMMARY_FORM_VALID', boolean>;
export type ReceiveTenantsFormValidAction = Action<'mvj/leases/RECEIVE_TENANTS_FORM_VALID', boolean>;
