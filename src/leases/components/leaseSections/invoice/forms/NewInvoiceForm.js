// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, getFormValues, isValid, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import FormField from '$components/form/FormField';
import FormSection from '$components/form/FormSection';
import InvoiceRowsEdit from './InvoiceRowsEdit';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';
import {FormNames} from '$src/leases/enums';
import {getInvoiceRecipientOptions, getInvoiceTenantOptions} from '$src/leases/helpers';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';
import type {Attributes as InvoiceAttributes} from '$src/invoices/types';

type Props = {
  formValues: Object,
  handleSubmit: Function,
  invoiceAttributes: InvoiceAttributes,
  isValid: boolean,
  lease: Lease,
  onClose: Function,
  onSave: Function,
}

const NewInvoiceForm = ({
  formValues,
  handleSubmit,
  invoiceAttributes,
  isValid,
  lease,
  onClose,
  onSave,
}: Props) => {

  const recipientOptions = getInvoiceRecipientOptions(lease);
  const tenantOptions = getInvoiceTenantOptions(lease);

  return (
    <form onSubmit={handleSubmit} className='invoice__add-invoice_form'>
      <FormSection>
        <WhiteBoxEdit>
          <BoxContentWrapper>
            <h3>Luo lasku</h3>
            <CloseButton
              className="position-topright"
              onClick={() => onClose()}
              title="Poista lasku"
            />
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(invoiceAttributes, 'recipient')}
                  name='recipient'
                  overrideValues={{
                    label: 'Vuokralainen',
                    options: recipientOptions,
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(invoiceAttributes, 'type')}
                  name='type'
                  overrideValues={{
                    label: 'Tyyppi',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(invoiceAttributes, 'total_amount')}
                  name='total_amount'
                  unit='€'
                  overrideValues={{
                    label: 'Laskun pääoma',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(invoiceAttributes, 'due_date')}
                  name='due_date'
                  overrideValues={{
                    label: 'Eräpäivä',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(invoiceAttributes, 'billing_period_start_date')}
                  name='billing_period_start_date'
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(invoiceAttributes, 'billing_period_end_date')}
                  name='billing_period_end_date'
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <FormField
                  fieldAttributes={get(invoiceAttributes, 'notes')}
                  name='notes'
                  overrideValues={{
                    label: 'Tiedote',
                  }}
                />
              </Column>
            </Row>
            <FieldArray
              attributes={invoiceAttributes}
              component={InvoiceRowsEdit}
              name='rows'
              tenantOptions={tenantOptions}
            />
            <Row style={{marginBottom: '10px'}}>
              <Column>
                <Button
                  className='button-green no-margin pull-right'
                  disabled={!isValid}
                  label='Tallenna'
                  onClick={() => onSave(formValues)}
                  title='Tallenna'
                />
                <Button
                  className='button-red pull-right'
                  label='Peruuta'
                  onClick={onClose}
                  title='Peruuta'
                />
              </Column>
            </Row>
          </BoxContentWrapper>
        </WhiteBoxEdit>
      </FormSection>
    </form>
  );
};

const formName = FormNames.INVOICE_NEW;

export default flowRight(
  connect(
    (state) => {
      return {
        formValues: getFormValues(formName)(state),
        invoiceAttributes: getInvoiceAttributes(state),
        isValid: isValid(formName)(state),
        lease: getCurrentLease(state),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(NewInvoiceForm);
