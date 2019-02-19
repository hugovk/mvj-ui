// @flow
import {expect} from 'chai';

import {
  fetchAttributes,
  attributesNotFound,
  receiveAttributes,
  receiveMethods,
  fetchCollectionCourtDecisionsByLease,
  receiveCollectionCourtDecisionsByLease,
  notFoundByLease,
} from './actions';
import collectionCourtDecisionReducer from './reducer';

import type {CollectionCourtDecisionState} from './types';

const defaultState: CollectionCourtDecisionState = {
  attributes: null,
  byLease: {},
  isFetchingAttributes: false,
  isFetchingByLease: {},
  methods: null,
};

// $FlowFixMe
describe('collectionCourtDecision', () => {

  // $FlowFixMe
  describe('Reducer', () => {

    // $FlowFixMe
    describe('collectionCourtDecisionReducer', () => {

      // $FlowFixMe
      it('should update isFetchingAttributes flag to true when fetching attributes', () => {
        const newState = {...defaultState, isFetchingAttributes: true};

        const state = collectionCourtDecisionReducer({}, fetchAttributes());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetchingAttributes flag to false by attributesNotFound', () => {
        const newState = {...defaultState, isFetchingAttributes: false};

        let state = collectionCourtDecisionReducer({}, fetchAttributes());
        state = collectionCourtDecisionReducer(state, attributesNotFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update attributes', () => {
        const dummyAttributes = {foo: 'bar'};
        const newState = {...defaultState, attributes: dummyAttributes};

        const state = collectionCourtDecisionReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update methods', () => {
        const dummyMethods = {foo: 'bar'};
        const newState = {...defaultState, methods: dummyMethods};

        const state = collectionCourtDecisionReducer({}, receiveMethods(dummyMethods));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching collection court decisions', () => {
        const lease = 1;
        const newState = {...defaultState, isFetchingByLease: {[lease]: true}};

        const state = collectionCourtDecisionReducer({}, fetchCollectionCourtDecisionsByLease(lease));
        expect(state).to.deep.equal(newState);
      });

      it('should update collection court decision list', () => {
        const lease = 1;
        const dummyCollectionCourtDecisions = [
          {
            id: 1,
            label: 'Foo',
            name: 'Bar',
          },
        ];

        const newState = {...defaultState, isFetchingByLease: {[lease]: false}, byLease: {[lease]: dummyCollectionCourtDecisions}};

        const state = collectionCourtDecisionReducer({}, receiveCollectionCourtDecisionsByLease({lease: lease, collectionCourtDecisions: dummyCollectionCourtDecisions}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFoundByLease', () => {
        const lease = 1;
        const newState = {...defaultState, isFetchingByLease: {[lease]: false}};

        const state = collectionCourtDecisionReducer({}, notFoundByLease(lease));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
