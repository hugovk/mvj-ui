// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import InspectionItemsEdit from './InspectionItemsEdit';

type Props = {
  handleSubmit: Function,
}

class InspectionsEdit extends Component {
  props: Props

  render() {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <Row>
          <Column>
            <FieldArray name="inspections" component={InspectionItemsEdit}/>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'inspection-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        inspections: selector(state, 'inspections'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(InspectionsEdit);