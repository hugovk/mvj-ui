// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchAreaNoteAttributes} from '$src/areaNote/actions';
import {fetchAttributes as fetchContactAttributes} from '$src/contacts/actions';
import {fetchAttributes as fetchIndexAttributes} from '$src/index/actions';
import {fetchAttributes as fetchInfillDevelopmentAttributes} from '$src/infillDevelopment/actions';
import {fetchAttributes as fetchInvoiceAttributes} from '$src/invoices/actions';
import {fetchAttributes as fetchLeaseAttributes} from '$src/leases/actions';
import {fetchAttributes as fetchLeaseholdTransferAttributes} from '$src/leaseholdTransfer/actions';
import {fetchAttributes as fetchRentBasisAttributes} from '$src/rentbasis/actions';
import {fetchAttributes as fetchUiDataAttributes} from '$src/uiData/actions';
import {fetchUsersPermissions} from '$src/usersPermissions/actions';
import {
  getAttributes as getAreaNoteAttributes,
  getIsFetchingAttributes as getIsFetchingAreaNoteAttributes,
  getMethods as getAreaNoteMethods,
} from '$src/areaNote/selectors';
import {
  getAttributes as getContactAttributes,
  getIsFetchingAttributes as getIsFetchingContactAttributes,
  getMethods as getContactMethods,
} from '$src/contacts/selectors';
import {
  getAttributes as getIndexAttributes,
  getIsFetchingAttributes as getIsFetchingIndexAttributes,
  getMethods as getIndexMethods,
} from '$src/index/selectors';
import {
  getAttributes as getInfillDevelopmentAttributes,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttributes,
  getMethods as getInfillDevelopmentMethods,
} from '$src/infillDevelopment/selectors';
import {
  getAttributes as getInvoiceAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceAttributes,
  getMethods as getInvoiceMethods,
} from '$src/invoices/selectors';
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseAttributes,
  getMethods as getLeaseMethods,
} from '$src/leases/selectors';
import {
  getAttributes as getLeaseholdTransferAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseholdTransferAttributes,
  getMethods as getLeaseholdTransferMethods,
} from '$src/leaseholdTransfer/selectors';
import {
  getAttributes as getRentBasisAttributes,
  getIsFetchingAttributes as getIsFetchingRentBasisAttributes,
  getMethods as getRentBasisMethods,
} from '$src/rentbasis/selectors';
import {
  getAttributes as getUiDataAttributes,
  getIsFetchingAttributes as getIsFetchingUiDataAttributes,
  getMethods as getUiDataMethods,
} from '$src/uiData/selectors';
import {
  getUsersPermissions,
  getIsFetching as getIsFetchingUsersPermissions,
} from '$src/usersPermissions/selectors';

import type {Attributes, Methods} from '$src/types';
import type {UsersPermissions} from '$src/usersPermissions/types';

function CommonAttributes(WrappedComponent: any) {
  type Props = {
    areaNoteAttributes: Attributes,
    areaNoteMethods: Methods,
    contactAttributes: Attributes,
    contactMethods: Methods,
    fetchAreaNoteAttributes: Function,
    fetchContactAttributes: Function,
    fetchIndexAttributes: Function,
    fetchInfillDevelopmentAttributes: Function,
    fetchInvoiceAttributes: Function,
    fetchLeaseAttributes: Function,
    fetchLeaseholdTransferAttributes: Function,
    fetchRentBasisAttributes: Function,
    fetchUiDataAttributes: Function,
    fetchUsersPermissions: Function,
    indexAttributes: Attributes,
    indexMethods: Methods,
    infillDevelopmentAttributes: Attributes,
    infillDevelopmentMethods: Methods,
    invoiceAttributes: Attributes,
    invoiceMethods: Methods,
    isFetchingAreaNoteAttributes: boolean,
    isFetchingContactAttributes: boolean,
    isFetchingIndexAttributes: boolean,
    isFetchingInfillDevelopmentAttributes: boolean,
    isFetchingInvoiceAttributes: boolean,
    isFetchingLeaseAttributes: boolean,
    isFetchingLeaseholdTransferAttributes: boolean,
    isFetchingRentBasisAttributes: boolean,
    isFetchingUiDataAttributes: boolean,
    isFetchingUsersPermissions: boolean,
    leaseAttributes: Attributes,
    leaseMethods: Methods,
    leaseholdTransferAttributes: Attributes,
    leaseholdTransferMethods: Methods,
    rentBasisAttributes: Attributes,
    rentBasisMethods: Methods,
    uiDataAttributes: Attributes,
    uiDataMethods: Methods,
    usersPermissions: UsersPermissions,
  }

  type State = {
    isFetchingCommonAttributes: boolean,
  }

  return class CommonAttributes extends PureComponent<Props, State> {
    state = {
      isFetchingCommonAttributes: false,
    }

    componentDidMount() {
      const {
        areaNoteMethods,
        contactMethods,
        fetchAreaNoteAttributes,
        fetchContactAttributes,
        fetchIndexAttributes,
        fetchInfillDevelopmentAttributes,
        fetchInvoiceAttributes,
        fetchLeaseAttributes,
        fetchLeaseholdTransferAttributes,
        fetchRentBasisAttributes,
        fetchUiDataAttributes,
        fetchUsersPermissions,
        indexMethods,
        infillDevelopmentMethods,
        invoiceAttributes,
        invoiceMethods,
        isFetchingAreaNoteAttributes,
        isFetchingContactAttributes,
        isFetchingIndexAttributes,
        isFetchingInfillDevelopmentAttributes,
        isFetchingInvoiceAttributes,
        isFetchingLeaseAttributes,
        isFetchingLeaseholdTransferAttributes,
        isFetchingRentBasisAttributes,
        isFetchingUiDataAttributes,
        isFetchingUsersPermissions,
        leaseMethods,
        leaseholdTransferAttributes,
        leaseholdTransferMethods,
        rentBasisMethods,
        uiDataMethods,
        usersPermissions,
      } = this.props;

      if(!isFetchingUsersPermissions && isEmpty(usersPermissions)) {
        fetchUsersPermissions();
      }

      if(!isFetchingAreaNoteAttributes && !areaNoteMethods) {
        fetchAreaNoteAttributes();
      }

      if(!isFetchingContactAttributes && !contactMethods) {
        fetchContactAttributes();
      }

      if(!isFetchingIndexAttributes && !indexMethods) {
        fetchIndexAttributes();
      }

      if(!isFetchingInfillDevelopmentAttributes && !infillDevelopmentMethods) {
        fetchInfillDevelopmentAttributes();
      }

      if(!isFetchingInvoiceAttributes && !invoiceMethods && !invoiceAttributes) {
        fetchInvoiceAttributes();
      }

      if(!isFetchingLeaseAttributes && !leaseMethods) {
        fetchLeaseAttributes();
      }

      if(!isFetchingLeaseholdTransferAttributes && !leaseholdTransferAttributes && !leaseholdTransferMethods) {
        fetchLeaseholdTransferAttributes();
      }

      if(!isFetchingRentBasisAttributes && !rentBasisMethods) {
        fetchRentBasisAttributes();
      }

      if(!isFetchingUiDataAttributes && !uiDataMethods) {
        fetchUiDataAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingAreaNoteAttributes !== prevProps.isFetchingAreaNoteAttributes ||
        this.props.isFetchingContactAttributes !== prevProps.isFetchingContactAttributes ||
        this.props.isFetchingIndexAttributes !== prevProps.isFetchingIndexAttributes ||
        this.props.isFetchingInfillDevelopmentAttributes !== prevProps.isFetchingInfillDevelopmentAttributes ||
        this.props.isFetchingInvoiceAttributes !== prevProps.isFetchingInvoiceAttributes ||
        this.props.isFetchingLeaseAttributes !== prevProps.isFetchingLeaseAttributes ||
        this.props.isFetchingLeaseholdTransferAttributes !== prevProps.isFetchingLeaseholdTransferAttributes ||
        this.props.isFetchingRentBasisAttributes !== prevProps.isFetchingRentBasisAttributes ||
        this.props.isFetchingUiDataAttributes !== prevProps.isFetchingUiDataAttributes ||
        this.props.isFetchingUsersPermissions !== prevProps.isFetchingUsersPermissions) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {
        isFetchingAreaNoteAttributes,
        isFetchingContactAttributes,
        isFetchingIndexAttributes,
        isFetchingInfillDevelopmentAttributes,
        isFetchingInvoiceAttributes,
        isFetchingLeaseAttributes,
        isFetchingLeaseholdTransferAttributes,
        isFetchingRentBasisAttributes,
        isFetchingUiDataAttributes,
        isFetchingUsersPermissions,
      } = this.props;
      const isFetching = isFetchingAreaNoteAttributes ||
        isFetchingContactAttributes ||
        isFetchingIndexAttributes ||
        isFetchingInfillDevelopmentAttributes ||
        isFetchingInvoiceAttributes ||
        isFetchingLeaseAttributes ||
        isFetchingLeaseholdTransferAttributes ||
        isFetchingRentBasisAttributes ||
        isFetchingUiDataAttributes ||
        isFetchingUsersPermissions;

      this.setState({isFetchingCommonAttributes: isFetching});
    }

    render() {
      return <WrappedComponent isFetchingCommonAttributes={this.state.isFetchingCommonAttributes} {...this.props} />;
    }
  };
}

// $FlowFixMe
const withCommonAttributes = flowRight(
  connect(
    (state) => {
      return{
        areaNoteAttributes: getAreaNoteAttributes(state),
        areaNoteMethods: getAreaNoteMethods(state),
        contactAttributes: getContactAttributes(state),
        contactMethods: getContactMethods(state),
        indexAttributes: getIndexAttributes(state),
        indexMethods: getIndexMethods(state),
        infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
        infillDevelopmentMethods: getInfillDevelopmentMethods(state),
        invoiceAttributes: getInvoiceAttributes(state),
        invoiceMethods: getInvoiceMethods(state),
        isFetchingAreaNoteAttributes: getIsFetchingAreaNoteAttributes(state),
        isFetchingContactAttributes: getIsFetchingContactAttributes(state),
        isFetchingIndexAttributes: getIsFetchingIndexAttributes(state),
        isFetchingInfillDevelopmentAttributes: getIsFetchingInfillDevelopmentAttributes(state),
        isFetchingInvoiceAttributes: getIsFetchingInvoiceAttributes(state),
        isFetchingLeaseAttributes: getIsFetchingLeaseAttributes(state),
        isFetchingLeaseholdTransferAttributes: getIsFetchingLeaseholdTransferAttributes(state),
        isFetchingRentBasisAttributes: getIsFetchingRentBasisAttributes(state),
        isFetchingUiDataAttributes: getIsFetchingUiDataAttributes(state),
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        leaseAttributes: getLeaseAttributes(state),
        leaseMethods: getLeaseMethods(state),
        leaseholdTransferAttributes: getLeaseholdTransferAttributes(state),
        leaseholdTransferMethods: getLeaseholdTransferMethods(state),
        rentBasisAttributes: getRentBasisAttributes(state),
        rentBasisMethods: getRentBasisMethods(state),
        uiDataAttributes: getUiDataAttributes(state),
        uiDataMethods: getUiDataMethods(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      fetchAreaNoteAttributes,
      fetchContactAttributes,
      fetchIndexAttributes,
      fetchInfillDevelopmentAttributes,
      fetchInvoiceAttributes,
      fetchLeaseAttributes,
      fetchLeaseholdTransferAttributes,
      fetchRentBasisAttributes,
      fetchUiDataAttributes,
      fetchUsersPermissions,
    }
  ),
  CommonAttributes,
);

export {withCommonAttributes};
