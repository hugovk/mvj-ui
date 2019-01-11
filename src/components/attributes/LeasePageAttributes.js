// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchBillingPeriodAttributes} from '$src/billingPeriods/actions';
import {fetchAttributes as fetchCollectionCourtDecisionAttributes} from '$src/collectionCourtDecision/actions';
import {fetchAttributes as fetchCollectionLetterAttributes} from '$src/collectionLetter/actions';
import {fetchAttributes as fetchCollectionNoteAttributes} from '$src/collectionNote/actions';
import {fetchAttributes as fetchCommentAttributes} from '$src/comments/actions';
import {fetchAttributes as fetchCopyAreasToContractAttributes} from '$src/copyAreasToContract/actions';
import {fetchAttributes as fetchCreateCollectionLetterAttributes} from '$src/createCollectionLetter/actions';
import {fetchAttributes as fetchInvoiceAttributes} from '$src/invoices/actions';
import {fetchAttributes as fetchPreviewInvoicesAttributes} from '$src/previewInvoices/actions';
import {fetchAttributes as fetchRelatedLeaseAttributes} from '$src/relatedLease/actions';
import {fetchAttributes as fetchRentForPeriodAttributes} from '$src/rentForPeriod/actions';
import {fetchAttributes as fetchSetInvoicingStateAttributes} from '$src/setInvoicingState/actions';
import {fetchAttributes as fetchSetRentInfoCompletionStateAttributes} from '$src/setRentInfoCompletionState/actions';
import {
  getAttributes as getBillingPeriodAttributes,
  getIsFetchingAttributes as getIsFetchingBillingPeriodAttributes,
  getMethods as getBillingPeriodMethods,
} from '$src/billingPeriods/selectors';
import {
  getAttributes as getCollectionCourtDecisionAttributes,
  getIsFetchingAttributes as getIsFetchingCollectionCourtDecisionAttributes,
  getMethods as getCollectionCourtDecisionMethods,
} from '$src/collectionCourtDecision/selectors';
import {
  getAttributes as getCollectionLetterAttributes,
  getIsFetchingAttributes as getIsFetchignCollectionLetterAttributes,
  getMethods as getCollectionLetterMethods,
} from '$src/collectionLetter/selectors';
import {
  getAttributes as getCollectionNoteAttributes,
  getIsFetchingAttributes as getIsFetchignCollectionNoteAttributes,
  getMethods as getCollectionNoteMethods,
} from '$src/collectionNote/selectors';
import {
  getAttributes as getCommentAttributes,
  getIsFetchingAttributes as getIsFetchingCommentAttributes,
  getMethods as getCommentMethods,
} from '$src/comments/selectors';
import {
  getAttributes as getCopyAreasToContractAttributes,
  getIsFetchingAttributes as getIsFetchingCopyAreasToContractAttributes,
  getMethods as getCopyAreasToContractMethods,
} from '$src/copyAreasToContract/selectors';
import {
  getAttributes as getCreateCollectionLetterAttributes,
  getIsFetchingAttributes as getIsFetchignCreateCollectionLetterAttributes,
  getMethods as getCreateCollectionLetterMethods,
} from '$src/createCollectionLetter/selectors';
import {
  getAttributes as getInvoiceAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceAttributes,
  getMethods as getInvoiceMethods,
} from '$src/invoices/selectors';
import {
  getAttributes as getPreviewInvoicesAttributes,
  getIsFetchingAttributes as getIsFetchingPreviewInvoicesAttributes,
  getMethods as getPreviewInvoicesMethods,
} from '$src/previewInvoices/selectors';
import {
  getAttributes as getRelatedLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingRelatedLeaseAttributes,
  getMethods as getRelatedLeaseMethods,
} from '$src/relatedLease/selectors';
import {
  getAttributes as getRentForPeriodAttributes,
  getIsFetchingAttributes as getIsFetchingRentForPeriodAttributes,
  getMethods as getRentForPeriodMethods,
} from '$src/rentForPeriod/selectors';
import {
  getAttributes as getSetInvoicingStateAttributes,
  getIsFetchingAttributes as getIsFetchingSetInvoicingStateAttributes,
  getMethods as getSetInvoicingStateMethods,
} from '$src/setInvoicingState/selectors';
import {
  getAttributes as getSetRentInfoCompletionStateAttributes,
  getIsFetchingAttributes as getIsFetchingSetRentInfoCompletionStateAttributes,
  getMethods as getSetRentInfoCompletionStateMethods,
} from '$src/setRentInfoCompletionState/selectors';

import type {Attributes, Methods} from '$src/types';

function LeasePageAttributes(WrappedComponent: any) {
  type Props = {
    billingPeriodAttributes: Attributes,
    billingPeriodMethods: Methods,
    collectionCourtDecisionAttributes: Attributes,
    collectionCourtDecisionMethods: Methods,
    collectionLetterAttributes: Attributes,
    collectionLetterMethods: Methods,
    collectionNoteAttributes: Attributes,
    collectionNoteMethods: Methods,
    commentAttributes: Attributes,
    commentMethods: Methods,
    copyAreasToContractAttributes: Attributes,
    copyAreasToContractMethods: Methods,
    createCollectionLetterAttributes: Attributes,
    createCollectionLetterMethods: Methods,
    fetchBillingPeriodAttributes: Function,
    fetchCollectionCourtDecisionAttributes: Function,
    fetchCollectionLetterAttributes: Function,
    fetchCollectionNoteAttributes: Function,
    fetchCommentAttributes: Function,
    fetchCopyAreasToContractAttributes: Function,
    fetchCreateCollectionLetterAttributes: Function,
    fetchInvoiceAttributes: Function,
    fetchPreviewInvoicesAttributes: Function,
    fetchRelatedLeaseAttributes: Function,
    fetchRentForPeriodAttributes: Function,
    fetchSetInvoicingStateAttributes: Function,
    fetchSetRentInfoCompletionStateAttributes: Function,
    invoiceAttributes: Attributes,
    invoiceMethods: Methods,
    isFetchingBillingPeriodAttributes: boolean,
    isFetchingCollectionCourtDecisionAttributes: boolean,
    isFetchingCollectionLetterAttributes: boolean,
    isFetchingCollectionNoteAttributes: boolean,
    isFetchingCommentAttributes: boolean,
    isFetchingCopyAreasToContractAttributes: boolean,
    isFetchingCreateCollectionLetterAttributes: boolean,
    isFetchingInvoiceAttributes: boolean,
    isFetchingPreviewInvoicesAttributes: boolean,
    isFetchingRelatedLeaseAttributes: boolean,
    isFetchingRentForPeriodAttributes: boolean,
    isFetchingSetInvoicingStateAttributes: boolean,
    isFetchingSetRentInfoCompletionStateAttributes: boolean,
    previewInvoicesAttributes: Attributes,
    previewInvoicesMethods: Methods,
    relatedLeaseAttributes: Attributes,
    relatedLeaseMethods: Methods,
    rentForPeriodAttributes: Attributes,
    rentForPeriodMethods: Methods,
    setInvoicingStateAttributes: Attributes,
    setInvoicingStateMethods: Methods,
    setRentInfoCompletionStateAttributes: Attributes,
    setRentInfoCompletionStateMethods: Methods,
  }

  type State = {
    isFetchingLeasePageAttributes: boolean,
  }

  return class LeasePageAttributes extends PureComponent<Props, State> {
    state = {
      isFetchingLeasePageAttributes: false,
    }

    componentDidMount() {
      const {
        billingPeriodMethods,
        collectionCourtDecisionMethods,
        collectionLetterMethods,
        collectionNoteMethods,
        commentMethods,
        copyAreasToContractMethods,
        createCollectionLetterMethods,
        fetchBillingPeriodAttributes,
        fetchCollectionCourtDecisionAttributes,
        fetchCollectionLetterAttributes,
        fetchCollectionNoteAttributes,
        fetchCommentAttributes,
        fetchCopyAreasToContractAttributes,
        fetchCreateCollectionLetterAttributes,
        fetchInvoiceAttributes,
        fetchPreviewInvoicesAttributes,
        fetchRelatedLeaseAttributes,
        fetchRentForPeriodAttributes,
        fetchSetInvoicingStateAttributes,
        fetchSetRentInfoCompletionStateAttributes,
        invoiceMethods,
        isFetchingBillingPeriodAttributes,
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCommentAttributes,
        isFetchingCopyAreasToContractAttributes,
        isFetchingCreateCollectionLetterAttributes,
        isFetchingInvoiceAttributes,
        isFetchingPreviewInvoicesAttributes,
        isFetchingRelatedLeaseAttributes,
        isFetchingRentForPeriodAttributes,
        isFetchingSetInvoicingStateAttributes,
        isFetchingSetRentInfoCompletionStateAttributes,
        previewInvoicesMethods,
        relatedLeaseMethods,
        rentForPeriodMethods,
        setInvoicingStateMethods,
        setRentInfoCompletionStateMethods,
      } = this.props;

      if(isEmpty(billingPeriodMethods) && !isFetchingBillingPeriodAttributes) {
        fetchBillingPeriodAttributes();
      }

      if(isEmpty(collectionCourtDecisionMethods) && !isFetchingCollectionCourtDecisionAttributes) {
        fetchCollectionCourtDecisionAttributes();
      }

      if(isEmpty(collectionLetterMethods) && !isFetchingCollectionLetterAttributes) {
        fetchCollectionLetterAttributes();
      }

      if(isEmpty(collectionNoteMethods) && !isFetchingCollectionNoteAttributes) {
        fetchCollectionNoteAttributes();
      }

      if(isEmpty(commentMethods) && !isFetchingCommentAttributes) {
        fetchCommentAttributes();
      }

      if(isEmpty(copyAreasToContractMethods) && !isFetchingCopyAreasToContractAttributes) {
        fetchCopyAreasToContractAttributes();
      }

      if(isEmpty(createCollectionLetterMethods) && !isFetchingCreateCollectionLetterAttributes) {
        fetchCreateCollectionLetterAttributes();
      }

      if(isEmpty(invoiceMethods) && !isFetchingInvoiceAttributes) {
        fetchInvoiceAttributes();
      }

      if(isEmpty(previewInvoicesMethods) && !isFetchingPreviewInvoicesAttributes) {
        fetchPreviewInvoicesAttributes();
      }

      if(isEmpty(relatedLeaseMethods) && !isFetchingRelatedLeaseAttributes) {
        fetchRelatedLeaseAttributes();
      }

      if(isEmpty(rentForPeriodMethods) && !isFetchingRentForPeriodAttributes) {
        fetchRentForPeriodAttributes();
      }

      if(isEmpty(setInvoicingStateMethods) && !isFetchingSetInvoicingStateAttributes) {
        fetchSetInvoicingStateAttributes();
      }

      if(isEmpty(setRentInfoCompletionStateMethods) && !isFetchingSetRentInfoCompletionStateAttributes) {
        fetchSetRentInfoCompletionStateAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingBillingPeriodAttributes !== prevProps.isFetchingBillingPeriodAttributes ||
        this.props.isFetchingCollectionCourtDecisionAttributes !== prevProps.isFetchingCollectionCourtDecisionAttributes ||
        this.props.isFetchingCollectionLetterAttributes !== prevProps.isFetchingCollectionLetterAttributes ||
        this.props.isFetchingCollectionNoteAttributes !== prevProps.isFetchingCollectionNoteAttributes ||
        this.props.isFetchingCommentAttributes !== prevProps.isFetchingCommentAttributes ||
        this.props.isFetchingCopyAreasToContractAttributes !== prevProps.isFetchingCopyAreasToContractAttributes ||
        this.props.isFetchingCreateCollectionLetterAttributes !== prevProps.isFetchingCreateCollectionLetterAttributes ||
        this.props.isFetchingInvoiceAttributes !== prevProps.isFetchingInvoiceAttributes ||
        this.props.isFetchingPreviewInvoicesAttributes !== prevProps.isFetchingPreviewInvoicesAttributes ||
        this.props.isFetchingRelatedLeaseAttributes !== prevProps.isFetchingRelatedLeaseAttributes ||
        this.props.isFetchingRentForPeriodAttributes !== prevProps.isFetchingRentForPeriodAttributes ||
        this.props.isFetchingSetInvoicingStateAttributes !== prevProps.isFetchingSetInvoicingStateAttributes ||
        this.props.isFetchingSetRentInfoCompletionStateAttributes !== prevProps.isFetchingSetRentInfoCompletionStateAttributes) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {
        isFetchingBillingPeriodAttributes,
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCommentAttributes,
        isFetchingCopyAreasToContractAttributes,
        isFetchingCreateCollectionLetterAttributes,
        isFetchingInvoiceAttributes,
        isFetchingPreviewInvoicesAttributes,
        isFetchingRelatedLeaseAttributes,
        isFetchingRentForPeriodAttributes,
        isFetchingSetInvoicingStateAttributes,
        isFetchingSetRentInfoCompletionStateAttributes,
      } = this.props;
      const isFetching = isFetchingBillingPeriodAttributes ||
        isFetchingCollectionCourtDecisionAttributes ||
        isFetchingCollectionLetterAttributes ||
        isFetchingCollectionNoteAttributes ||
        isFetchingCommentAttributes ||
        isFetchingCopyAreasToContractAttributes ||
        isFetchingCreateCollectionLetterAttributes ||
        isFetchingInvoiceAttributes ||
        isFetchingPreviewInvoicesAttributes ||
        isFetchingRelatedLeaseAttributes ||
        isFetchingRentForPeriodAttributes ||
        isFetchingSetInvoicingStateAttributes ||
        isFetchingSetRentInfoCompletionStateAttributes;

      this.setState({isFetchingLeasePageAttributes: isFetching});
    }

    render() {
      return <WrappedComponent isFetchingLeasePageAttributes={this.state.isFetchingLeasePageAttributes} {...this.props} />;
    }
  };
}

const withLeasePageAttributes = flowRight(
  connect(
    (state) => {
      return{
        billingPeriodAttributes: getBillingPeriodAttributes(state),
        billingPeriodMethods: getBillingPeriodMethods(state),
        collectionCourtDecisionAttributes: getCollectionCourtDecisionAttributes(state),
        collectionCourtDecisionMethods: getCollectionCourtDecisionMethods(state),
        collectionLetterAttributes: getCollectionLetterAttributes(state),
        collectionLetterMethods: getCollectionLetterMethods(state),
        collectionNoteAttributes: getCollectionNoteAttributes(state),
        collectionNoteMethods: getCollectionNoteMethods(state),
        commentAttributes: getCommentAttributes(state),
        commentMethods: getCommentMethods(state),
        copyAreasToContractAttributes: getCopyAreasToContractAttributes(state),
        copyAreasToContractMethods: getCopyAreasToContractMethods(state),
        createCollectionLetterAttributes: getCreateCollectionLetterAttributes(state),
        createCollectionLetterMethods: getCreateCollectionLetterMethods(state),
        invoiceAttributes: getInvoiceAttributes(state),
        invoiceMethods: getInvoiceMethods(state),
        isFetchingBillingPeriodAttributes: getIsFetchingBillingPeriodAttributes(state),
        isFetchingCollectionCourtDecisionAttributes: getIsFetchingCollectionCourtDecisionAttributes(state),
        isFetchingCollectionLetterAttributes: getIsFetchignCollectionLetterAttributes(state),
        isFetchingCollectionNoteAttributes: getIsFetchignCollectionNoteAttributes(state),
        isFetchingCommentAttributes: getIsFetchingCommentAttributes(state),
        isFetchingCopyAreasToContractAttributes: getIsFetchingCopyAreasToContractAttributes(state),
        isFetchingCreateCollectionLetterAttributes: getIsFetchignCreateCollectionLetterAttributes(state),
        isFetchingInvoiceAttributes: getIsFetchingInvoiceAttributes(state),
        isFetchingPreviewInvoicesAttributes: getIsFetchingPreviewInvoicesAttributes(state),
        isFetchingRelatedLeaseAttributes: getIsFetchingRelatedLeaseAttributes(state),
        isFetchingRentForPeriodAttributes: getIsFetchingRentForPeriodAttributes(state),
        isFetchingSetInvoicingStateAttributes: getIsFetchingSetInvoicingStateAttributes(state),
        isFetchingSetRentInfoCompletionStateAttributes: getIsFetchingSetRentInfoCompletionStateAttributes(state),
        previewInvoicesAttributes: getPreviewInvoicesAttributes(state),
        previewInvoicesMethods: getPreviewInvoicesMethods(state),
        relatedLeaseAttributes: getRelatedLeaseAttributes(state),
        relatedLeaseMethods: getRelatedLeaseMethods(state),
        rentForPeriodAttributes: getRentForPeriodAttributes(state),
        rentForPeriodMethods: getRentForPeriodMethods(state),
        setInvoicingStateAttributes: getSetInvoicingStateAttributes(state),
        setInvoicingStateMethods: getSetInvoicingStateMethods(state),
        setRentInfoCompletionStateAttributes: getSetRentInfoCompletionStateAttributes(state),
        setRentInfoCompletionStateMethods: getSetRentInfoCompletionStateMethods(state),
      };
    },
    {
      fetchBillingPeriodAttributes,
      fetchCollectionCourtDecisionAttributes,
      fetchCollectionLetterAttributes,
      fetchCollectionNoteAttributes,
      fetchCommentAttributes,
      fetchCopyAreasToContractAttributes,
      fetchCreateCollectionLetterAttributes,
      fetchInvoiceAttributes,
      fetchPreviewInvoicesAttributes,
      fetchRelatedLeaseAttributes,
      fetchRentForPeriodAttributes,
      fetchSetInvoicingStateAttributes,
      fetchSetRentInfoCompletionStateAttributes,
    }
  ),
  LeasePageAttributes,
);

export {withLeasePageAttributes};
