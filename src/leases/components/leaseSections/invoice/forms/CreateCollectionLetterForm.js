// @flow
/* global API_URL */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import AddButtonThird from '$components/form/AddButtonThird';
import CollectionLetterTotalRow from './CollectionLetterTotalRow';
import Divider from '$components/content/Divider';
import DownloadDebtCollectionFileButton from '$components/file/DownloadDebtCollectionFileButton';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import CollectionLetterInvoiceRow from './CollectionLetterInvoiceRow';
import SubTitle from '$components/content/SubTitle';
import {InvoiceType} from '$src/invoices/enums';
import {FormNames} from '$src/leases/enums';
import {getCollectionLetterTemplateOptions} from '$src/collectionLetterTemplate/helpers';
import {formatDate, formatDateRange, formatDecimalNumberForDb, sortStringByKeyDesc} from '$util/helpers';
import {getInvoiceTenantOptions} from '$src/leases/helpers';
import {getCollectionLetterTemplates} from '$src/collectionLetterTemplate/selectors';
import {getInvoicesByLease} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {CollectionLetterTemplates} from '$src/collectionLetterTemplate/types';
import type {Lease} from '$src/leases/types';

type InvoicesProps = {
  disableDirty?: boolean,
  fields: any,
  invoiceOptions: Array<Object>,
}

const renderInvoices = ({
  disableDirty = false,
  fields,
  invoiceOptions,
}: InvoicesProps) => {
  const handleAdd = () => fields.push({});

  return(
    <div>
      {!!fields && !!fields.length &&
        <Row>
          <Column small={4}>
            <FormFieldLabel required>Perittävä lasku</FormFieldLabel>
          </Column>
          <Column small={2}>
            <FormFieldLabel>Perittävä maksuerä</FormFieldLabel>
          </Column>
          <Column small={2}>
            <FormFieldLabel>Korko</FormFieldLabel>
          </Column>
          <Column small={2}>
            <FormFieldLabel>Perimispalkkio</FormFieldLabel>
          </Column>
          <Column small={2}>
            <FormFieldLabel>Yhteensä</FormFieldLabel>
          </Column>
        </Row>
      }
      {!!fields && !!fields.length && fields.map((invoice, index) => {
        const handleRemove = () => fields.remove(index);
        return (
          <CollectionLetterInvoiceRow
            disableDirty={disableDirty}
            key={index}
            field={invoice}
            fields={fields}
            invoiceOptions={invoiceOptions}
            onRemove={handleRemove}
            showDeleteButton={fields.length > 1}
          />
        );
      })}
      <Row>
        <Column>
          <AddButtonThird
            label='Lisää lasku'
            onClick={handleAdd}
            title='Lisää lasku'
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Divider className='invoice-divider' />
        </Column>
      </Row>
      <CollectionLetterTotalRow fields={fields} />
    </div>
  );
};

type Props = {
  collectionCharge: number,
  collectionLetterTemplates: CollectionLetterTemplates,
  invoices: Array<Object>,
  invoiceIds: Array<number>,
  lease: Lease,
  template: string,
  tenants: Array<number>,
  valid: boolean,
}

type State = {
  collectionLetterTemplates: CollectionLetterTemplates,
  collectionLetterTemplateOptions: Array<Object>,
  invoices: Array<Object>,
  invoiceOptions: Array<Object>,
  lease: Lease,
  tenantOptions: Array<Object>,
}

const getInvoiceOptions = (invoices: Array<Object>) => !isEmpty(invoices)
  ? invoices
    .filter((invoice) => invoice.type !== InvoiceType.CREDIT_NOTE && invoice.outstanding_amount > 0)
    .sort((a, b) => sortStringByKeyDesc(a, b, 'due_date'))
    .map((invoice) => {
      return {
        value: invoice.id,
        label: `${formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date)}\t${formatDate(invoice.due_date)}`.trim(),
      };
    })
  : [];

class CreateCollectionLetterForm extends Component<Props, State> {
  state = {
    collectionLetterTemplates: [],
    collectionLetterTemplateOptions: [],
    invoices: [],
    invoiceOptions: [],
    lease: {},
    tenantOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State)  {
    const newState = {};

    if(props.invoices && props.invoices !== state.invoices) {
      newState.invoices = props.invoices;
      newState.invoiceOptions = getInvoiceOptions(props.invoices);
    }
    if(props.lease && props.lease !== state.lease) {
      newState.lease = props.lease;
      newState.tenantOptions = getInvoiceTenantOptions(props.lease);
    }
    if(props.collectionLetterTemplates && props.collectionLetterTemplates !== state.collectionLetterTemplates) {
      newState.collectionLetterTemplate = props.collectionLetterTemplates;
      newState.collectionLetterTemplateOptions = getCollectionLetterTemplateOptions(props.collectionLetterTemplates);
    }
    return newState;
  }

  render() {
    const {
      collectionCharge,
      invoiceIds,
      lease,
      template,
      tenants,
      valid,
    } = this.props;
    const {
      collectionLetterTemplateOptions,
      invoiceOptions,
      tenantOptions,
    } = this.state;
    return(
      <form>
        <Row>
          <Column small={12} medium={6}>
            <Row>
              <Column small={12} medium={4} large={4}>
                <FormField
                  disableDirty
                  fieldAttributes={{
                    type: 'multiselect',
                    required: true,
                    label: 'Vuokralaiset',
                  }}
                  name='tenants'
                  overrideValues={{
                    options: tenantOptions,
                  }}
                />
              </Column>
              <Column small={12} medium={4} large={4}>
                <FormField
                  disableDirty
                  fieldAttributes={{
                    type: 'choice',
                    required: true,
                    label: 'Maksuvaatimustyyppi',
                  }}
                  name='template'
                  overrideValues={{
                    options: collectionLetterTemplateOptions,
                  }}
                />
              </Column>
              <Column small={12} medium={4} large={4}>
                <FormField
                  disableDirty
                  fieldAttributes={{
                    type: 'decimal',
                    required: true,
                    label: 'Perimispalkkio',
                  }}
                  name='collection_charge'
                  unit='€'
                />
              </Column>
            </Row>
          </Column>
        </Row>
        <Row>
          <Column small={12}>
            <SubTitle>Perintälaskelma</SubTitle>
            <FieldArray
              disableDirty
              component={renderInvoices}
              invoiceOptions={invoiceOptions}
              name='invoice_ids'
            />
          </Column>
          <Column small={12}>
            <div style={{paddingTop: 5, paddingBottom: 10, float: 'right'}}>
              <DownloadDebtCollectionFileButton
                disabled={!valid}
                label='Luo perintäkirje'
                payload={{
                  template: template,
                  collection_charge: formatDecimalNumberForDb(collectionCharge),
                  tenants: tenants,
                  invoices: invoiceIds,
                }}
                // $FlowFixMe
                url={`${API_URL}/lease/${lease.id}/create_collection_letter/`}
              />
            </div>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.CREATE_COLLECTION_LETTER;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        collectionCharge: selector(state, 'collection_charge'),
        collectionLetterTemplates: getCollectionLetterTemplates(state),
        invoices: getInvoicesByLease(state, currentLease.id),
        invoiceIds: selector(state, 'invoice_ids'),
        lease: getCurrentLease(state),
        template: selector(state, 'template'),
        tenants: selector(state, 'tenants'),
      };
    }
  ),
  reduxForm({
    form: formName,
    initialValues: {
      invoice_ids: [{}],
    },
  }),
)(CreateCollectionLetterForm);
