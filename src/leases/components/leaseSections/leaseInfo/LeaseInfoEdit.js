// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import type Moment from 'moment';

import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import {dateGreaterOrEqual} from '../../../../components/form/validations';

type Props = {
  start_date: ?Moment,
  end_date: ?Moment,
  identifier: ?string,
}

class LeaseInfoEdit extends Component {
  props: Props

  render () {
    const {start_date, identifier} = this.props;

    return (
      <form className='lease-info-edit'>
        <div className='lease-info-edit__column'>
          <p className='lease-info-edit__label'>Vuokratunnus</p>
          <span className='lease-info-edit__number'>{identifier}</span>
        </div>
        <div className='lease-info-edit__column'>
          <Field
            label='Alkupäivämäärä'
            name={'start_date'}
            type="text"
            component={FieldTypeDatePicker}/>
        </div>
        <div className='lease-info-edit__column'>
          <Field
            label='Loppupäivämäärä'
            name={'end_date'}
            type="text"
            disableTouched
            validate={[
              (value) => dateGreaterOrEqual(value, start_date),
            ]}
            component={FieldTypeDatePicker}/>
        </div>
      </form>
    );
  }
}

const formName = 'lease-info-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        start_date: selector(state, 'start_date'),
        end_date: selector(state, 'end_date'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(LeaseInfoEdit);
