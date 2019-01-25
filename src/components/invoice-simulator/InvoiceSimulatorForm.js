// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import FormField from '$components/form/FormField';
import {FormNames} from '$components/enums';
import {getCurrentYear} from '$util/date';
import {getCurrentLease} from '$src/leases/selectors';
import {getBillingPeriodsByLease} from '$src/billingPeriods/selectors';

type Props = {
  onSubmit: Function,
};

class InvoiceSimulatorForm extends Component<Props> {
  handleSubmit = (e: any) => {
    const {onSubmit} = this.props;

    onSubmit();
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Row>
          <Column small={12}>
            <FormField
              fieldAttributes={{
                type: 'integer',
                required: false,
                read_only: false,
              }}
              name='invoice_simulator_year'
              disableDirty
              overrideValues={{label: 'Vuosi'}}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.INVOICE_SIMULATOR;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        billingPeriods: getBillingPeriodsByLease(state, currentLease.id),
        billingPeriod: selector(state, 'billing_period'),
      };
    },
    {
      change,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    initialValues: {
      invoice_simulator_year: getCurrentYear(),
    },
  }),
)(InvoiceSimulatorForm);
