// @flow
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import AddInvoiceComponent from './AddInvoiceComponent';
import Collapse from '$components/collapse/Collapse';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
import InvoicesTableEdit from './InvoicesTableEdit';
import RentCalculator from '$components/rent-calculator/RentCalculator';
import RightSubtitle from '$components/content/RightSubtitle';
import {
  startInvoicing,
  stopInvoicing,
} from '$src/leases/actions';
import {getIsCreateOpen} from '$src/invoices/selectors';
import {createInvoice, receiveIsCreateOpen} from '$src/invoices/actions';
import {getCurrentLease} from '$src/leases/selectors';
import {getNewInvoiceForDb} from '$src/invoices/helpers';

import type {Lease} from '$src/leases/types';

type Props = {
  createInvoice: Function,
  currentLease: Lease,
  isCreateOpen: boolean,
  isInvoicingEnabled: boolean,
  params: Object,
  receiveIsCreateOpen: Function,
  startInvoicing: Function,
  stopInvoicing: Function,
}

type State = {
  isStartInvoicingModalOpen: boolean,
  isStopInvoicingModalOpen: boolean,
  selectedDebtIndex: number,
  selectedDebtToDeleteIndex: number,
}

class InvoicesEdit extends Component<Props, State> {
  state = {
    isStartInvoicingModalOpen: false,
    isStopInvoicingModalOpen: false,
    selectedDebtIndex: -1,
    selectedDebtToDeleteIndex: -1,
  }

  abnormalDebtTable: any

  componentWillMount = () => {
    const {receiveIsCreateOpen} = this.props;
    receiveIsCreateOpen(false);
  }

  showModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: true,
    });
  }

  hideModal = (modalName: string) => {
    const modalVisibilityKey = `is${modalName}ModalOpen`;
    this.setState({
      [modalVisibilityKey]: false,
      selectedDebtIndex: -1,
    });
  }

  createInvoice = (invoice: Object) => {
    const {
      createInvoice,
      params: {leaseId},
    } = this.props;

    invoice.lease = leaseId;
    invoice.billed_amount = invoice.total_amount;
    // invoice.state = InvoiceState.OPEN;

    createInvoice(getNewInvoiceForDb(invoice));
  }

  startInvoicing = () => {
    const {
      params: {leaseId},
      startInvoicing,
    } = this.props;

    this.hideModal('StartInvoicing');
    startInvoicing(leaseId);
  }

  stopInvoicing = () => {
    const {
      params: {leaseId},
      stopInvoicing,
    } = this.props;

    this.hideModal('StopInvoicing');
    stopInvoicing(leaseId);
  }

  render() {
    const {
      currentLease,
      isCreateOpen,
      receiveIsCreateOpen,
    } = this.props;
    const {
      isStartInvoicingModalOpen,
      isStopInvoicingModalOpen,
    } = this.state;

    return (
      <div>
        <ConfirmationModal
          confirmButtonLabel='Käynnistä laskutus'
          isOpen={isStartInvoicingModalOpen}
          label='Haluatko varmasti käynnistää laskutuksen?'
          onCancel={() => this.hideModal('StartInvoicing')}
          onClose={() => this.hideModal('StartInvoicing')}
          onSave={this.startInvoicing}
          title='Käynnistä laskutus'
        />
        <ConfirmationModal
          confirmButtonLabel='Keskeytä laskutus'
          isOpen={isStopInvoicingModalOpen}
          label='Haluatko varmasti keskeyttää laskutuksen?'
          onCancel={() => this.hideModal('StopInvoicing')}
          onClose={() => this.hideModal('StopInvoicing')}
          onSave={this.stopInvoicing}
          title='Keskeytä laskutus'
        />

        <h2>Laskutus</h2>
        <RightSubtitle
          className='invoicing-status'
          text={currentLease.is_invoicing_enabled
            ? <p className="success">Laskutus käynnissä<i /></p>
            : <p className="alert">Laskutus ei käynnissä<i /></p>
          }
        />
        <Divider />

        <Collapse
          defaultOpen={true}
          headerTitle={
            <h3 className='collapse__header-title'>Laskut</h3>
          }>
          <InvoicesTableEdit/>

          <AddInvoiceComponent
            editMode={isCreateOpen}
            onAdd={() => receiveIsCreateOpen(true)}
            onClose={() => receiveIsCreateOpen(false)}
            onSave={(invoice) => this.createInvoice(invoice)}
            onStartInvoicing={() => this.showModal('StartInvoicing')}
            onStopInvoicing={() => this.showModal('StopInvoicing')}
            showStartInvoicingButton={!currentLease.is_invoicing_enabled}
          />
        </Collapse>
        <Collapse
          defaultOpen={true}
          headerTitle={
            <h3 className='collapse__header-title'>Vuokralaskuri</h3>
          }>
          <RentCalculator />
        </Collapse>
      </div>
    );
  }
}

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
        isCreateOpen: getIsCreateOpen(state),
      };
    },
    {
      createInvoice,
      receiveIsCreateOpen,
      startInvoicing,
      stopInvoicing,
    }
  ),
)(InvoicesEdit);
