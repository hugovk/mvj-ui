// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import InvoiceRowsEdit from './InvoiceRowsEdit';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getInvoiceTenantOptions} from '$src/leases/helpers';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Attributes as InvoiceAttributes} from '$src/invoices/types';
import type {Lease} from '$src/leases/types';

type PaymentsProps = {
  attributes: InvoiceAttributes,
  fields: any,
}

const renderPayments = ({attributes, fields}: PaymentsProps): Element<*> => {
  return (
    <div>
      <Row>
        <Column small={6}>
          <FormFieldLabel required={get(attributes, 'payments.child.children.paid_amount.required')}>Maksettu määrä</FormFieldLabel>
        </Column>
        <Column small={6}>
          <FormFieldLabel required={get(attributes, 'payments.child.children.paid_date.required')}>Maksettu pvm</FormFieldLabel>
        </Column>
      </Row>
      {fields && !!fields.length && fields.map((payment, index) => {
        return (
          <Row key={index}>
            <Column small={6}>
              <FormField
                fieldAttributes={get(attributes, 'payments.child.children.paid_amount')}
                name={`${payment}.paid_amount`}
                unit='€'
                overrideValues={{
                  label: '',
                }}
              />
            </Column>
            <Column small={4}>
              <FormField
                fieldAttributes={get(attributes, 'payments.child.children.paid_date')}
                name={`${payment}.paid_date`}
                overrideValues={{
                  label: '',
                }}
              />
            </Column>
            <Column small={2}>
              <RemoveButton
                onClick={() => fields.remove(index)}
                title="Poista maksu"
              />
            </Column>
          </Row>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää maksu'
            onClick={() => fields.push({})}
            title='Lisää maksu'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  handleSubmit: Function,
  invoice: Object,
  invoiceAttributes: InvoiceAttributes,
  lease: Lease,
  startDate: string,
}

const EditInvoiceForm = ({
  handleSubmit,
  invoice,
  invoiceAttributes,
  lease,
}: Props) => {
  const stateOptions = getAttributeFieldOptions(invoiceAttributes, 'state');
  const tenantOptions = getInvoiceTenantOptions(lease);
  const deliveryMethodOptions = getAttributeFieldOptions(invoiceAttributes, 'delivery_method');
  const typeOptions = getAttributeFieldOptions(invoiceAttributes, 'type');

  return (
    <form onSubmit={handleSubmit}>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>Laskunsaaja</FormFieldLabel>
          <p>{getContactFullName(invoice.recipientFull) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Lähetetty SAP:iin</FormFieldLabel>
          <p>{formatDate(invoice.sent_to_sap_at) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>SAP numero</FormFieldLabel>
          <p>{invoice.sap_id || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormField
            fieldAttributes={get(invoiceAttributes, 'due_date')}
            name='due_date'
            overrideValues={{
              label: 'Eräpäivä',
            }}
          />
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Laskutuspvm</FormFieldLabel>
          <p>{formatDate(invoice.invoicing_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>Laskun tila</FormFieldLabel>
          <p>{getLabelOfOption(stateOptions, invoice.state) || '-'}</p>
        </Column>
        <Column medium={4}>
          <Row>
            <Column>
              <FormFieldLabel required>Laskutuskausi</FormFieldLabel>
            </Column>
          </Row>
          <Row>
            <Column medium={6}>
              <FormField
                fieldAttributes={get(invoiceAttributes, 'billing_period_start_date')}
                name='billing_period_start_date'
                overrideValues={{
                  label: '',
                }}
              />
            </Column>
            <Column medium={6}>
              <FormField
                fieldAttributes={get(invoiceAttributes, 'billing_period_end_date')}
                name='billing_period_end_date'
                overrideValues={{
                  label: '',
                }}
              />
            </Column>
          </Row>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Lykkäyspvm</FormFieldLabel>
          <p>{formatDate(invoice.postpone_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormField
            fieldAttributes={get(invoiceAttributes, 'total_amount')}
            name='total_amount'
            unit='€'
            overrideValues={{
              label: 'Laskun pääoma',
            }}
          />
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Laskun osuus</FormFieldLabel>
          <p>{`${formatNumber(invoice.totalShare * 100)} %`}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Laskutettu määrä</FormFieldLabel>
          <p>
            {invoice.billed_amount
              ? `${formatNumber(invoice.billed_amount)} €`
              : '-'
            }
          </p>
        </Column>
      </Row>
      <SubTitle>Maksut</SubTitle>
      <Row>
        <Column small={12} medium={8}>
          <FieldArray
            attributes={invoiceAttributes}
            component={renderPayments}
            name='payments'
          />
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Maksamaton määrä</FormFieldLabel>
          <p>
            {invoice.outstanding_amount
              ? `${formatNumber(invoice.outstanding_amount)} €`
              : '-'
            }
          </p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>Maksukehotuspvm</FormFieldLabel>
          <p>{formatDate(invoice.payment_notification_date) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Perintäkulu</FormFieldLabel>
          <p>
            {invoice.collection_charge
              ? `${formatNumber(invoice.collection_charge)} €`
              : '-'
            }
          </p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Maksukehotus luettelo</FormFieldLabel>
          <p>{formatDate(invoice.payment_notification_catalog_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={4}>
          <FormFieldLabel>E vai paperilasku</FormFieldLabel>
          <p>{getLabelOfOption(deliveryMethodOptions, invoice.delivery_method) || '-'}</p>
        </Column>
        <Column medium={4}>
          <FormFieldLabel>Laskun tyyppi</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, invoice.type) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column medium={12}>
          <FormField
            fieldAttributes={get(invoiceAttributes, 'notes')}
            name='notes'
            overrideValues={{
              label: 'Tiedote',
              fieldType: 'textarea',
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
    </form>
  );
};

const formName = FormNames.INVOICE_EDIT;

export default flowRight(
  connect(
    (state) => {
      return {
        invoiceAttributes: getInvoiceAttributes(state),
        lease: getCurrentLease(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(EditInvoiceForm);
