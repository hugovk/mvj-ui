// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, FieldArray} from 'redux-form';

import FormSection from '$components/form/FormSection';
import RuleItemsEdit from './RuleItemsEdit';

type Props = {
  handleSubmit: Function,
  dispatch: Function,
}

class RuleEdit extends Component {
  props: Props

  render() {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray name="rules" component={RuleItemsEdit} />
        </FormSection>

      </form>
    );
  }
}

const formName = 'rule-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        rules: selector(state, 'rules'),
      };
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(RuleEdit);
