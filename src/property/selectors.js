// @flow
import get from 'lodash/get';

import type {Attributes, Selector} from '../types';
import type {RootState} from '$src/root/types';

import type {
  Property,
  PropertyList,
} from './types';

export const getAttributes: Selector<Attributes, void> = (state: RootState): Attributes =>
  state.property.attributes;

export const getIsEditMode: Selector<boolean, void> = (state: RootState): boolean =>
  state.property.isEditMode;

export const getCollapseStateByKey: Selector<?Object, string> = (state: RootState, key: string): ?Object => {
  return get(state.lease.collapseStates, key);
};

export const getIsFetching: Selector<boolean, void> = (state: RootState): boolean =>
  state.property.isFetching;

export const getIsFetchingAttributes: Selector<boolean, void> = (state: RootState): boolean =>
  state.property.isFetchingAttributes;

export const getCurrentProperty: Selector<Property, void> = (state: RootState): Property =>
  state.property.current;

export const getPropertyList: Selector<PropertyList, void> = (state: RootState): PropertyList =>
  state.property.list;
