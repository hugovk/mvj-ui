import {expect} from 'chai';
import {
  receiveAttributes,
  receiveInvoicesByLease,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditInvoicePanelOpen,
  receiveIsCreateClicked,
  receiveIsCreditClicked,
  receiveIsEditClicked,
  fetchInvoicesByLease,
  createInvoice,
  patchInvoice,
  receivePatchedInvoice,
  clearPatchedInvoice,
  notFound,
  receiveInvoiceToCredit,
} from './actions';
import invoiceReducer from './reducer';

const rootState = {
  attributes: {},
  byLease: {},
  invoiceToCredit: null,
  isCreateClicked: false,
  isCreatePanelOpen: false,
  isCreditClicked: false,
  isCreditPanelOpen: false,
  isEditClicked: false,
  isFetching: false,
  patchedInvoice: null,
};

describe('Invoices', () => {

  describe('Reducer', () => {

    describe('invoiceReducer', () => {

      it('should update contact attributes', () => {
        const dummyAttributes = {
          val1: 'Foo',
          val2: 'Bar',
        };
        const newState = {...rootState};
        newState.attributes = dummyAttributes;

        const state = invoiceReducer({}, receiveAttributes(dummyAttributes));
        expect(state).to.deep.equal(newState);
      });

      it('should update invoices received by lease', () => {
        const dummyInvoices = [
          {
            id: 1,
            label: 'Foo',
          },
        ];
        const newState = {...rootState, byLease: {1: dummyInvoices}};

        const state = invoiceReducer({}, receiveInvoicesByLease({leaseId: 1, invoices: dummyInvoices}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreatePanelOpen flag to true', () => {
        const isCreatePanelOpen = true;
        const newState = {...rootState, isCreatePanelOpen: isCreatePanelOpen};

        const state = invoiceReducer({}, receiveIsCreateInvoicePanelOpen(isCreatePanelOpen));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreateClicked flag to true', () => {
        const isCreateClicked = true;
        const newState = {...rootState, isCreateClicked: isCreateClicked};

        const state = invoiceReducer({}, receiveIsCreateClicked(isCreateClicked));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreditClicked flag to true', () => {
        const isCreditClicked = true;
        const newState = {...rootState, isCreditClicked: isCreditClicked};

        const state = invoiceReducer({}, receiveIsCreditClicked(isCreditClicked));
        expect(state).to.deep.equal(newState);
      });

      it('should update isEditClicked flag to true', () => {
        const isEditClicked = true;
        const newState = {...rootState, isEditClicked: isEditClicked};

        const state = invoiceReducer({}, receiveIsEditClicked(isEditClicked));
        expect(state).to.deep.equal(newState);
      });

      it('should update isCreateCreditOpen flag to true', () => {
        const isCreditPanelOpen = true;
        const newState = {...rootState, isCreditPanelOpen: isCreditPanelOpen};

        const state = invoiceReducer({}, receiveIsCreditInvoicePanelOpen(isCreditPanelOpen));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when fetching invoices', () => {
        const newState = {...rootState, isFetching: true};

        const state = invoiceReducer({}, fetchInvoicesByLease());
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when creating invoice', () => {
        const newState = {...rootState, isFetching: true};

        const state = invoiceReducer({}, createInvoice({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to true when patching invoice', () => {
        const newState = {...rootState, isFetching: true};

        const state = invoiceReducer({}, patchInvoice({}));
        expect(state).to.deep.equal(newState);
      });

      it('should update isFetching flag to false by notFound', () => {
        const newState = {...rootState, isFetching: false};

        const state = invoiceReducer(state, notFound());
        expect(state).to.deep.equal(newState);
      });

      it('should update patchedInvoice', () => {
        const dummyInvoice = {
          foo: 'bar',
        };
        const newState = {...rootState, patchedInvoice: dummyInvoice};

        const state = invoiceReducer({}, receivePatchedInvoice(dummyInvoice));
        expect(state).to.deep.equal(newState);
      });

      it('should clear patchedInvoice', () => {
        const dummyInvoice = {
          foo: 'bar',
        };
        const newState = {...rootState, patchedInvoice: null};

        let state = invoiceReducer({}, receivePatchedInvoice(dummyInvoice));
        state = invoiceReducer(state, clearPatchedInvoice());
        expect(state).to.deep.equal(newState);
      });

      it('should update invoiceToCredit', () => {
        const newState = {...rootState, invoiceToCredit: 'foo'};

        const state = invoiceReducer({}, receiveInvoiceToCredit('foo'));
        expect(state).to.deep.equal(newState);
      });
    });
  });
});
