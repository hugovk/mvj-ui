// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {reduxForm, FieldArray} from 'redux-form';
import flowRight from 'lodash/flowRight';

import BasisOfRentsEdit from './BasisOfRentsEdit';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormSectionComponent from '$components/form/FormSection';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentItemEdit from './RentItemEdit';
import RightSubtitle from '$components/content/RightSubtitle';
import {receiveFormValidFlags} from '$src/leases/actions';
import {FormNames} from '$src/leases/enums';
import {getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

type Props = {
  errors: ?Object,
  handleSubmit: Function,
  isSaveClicked: boolean,
  params: Object,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class RentsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.RENTS]: this.props.valid,
      });
    }
  }

  render() {
    const {errors, handleSubmit, isSaveClicked} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSectionComponent>
          <h2>Vuokra</h2>
          <RightSubtitle
            text={
              <FormField
                fieldAttributes={{}}
                name='is_rent_info_complete'
                optionLabel='Vuokratiedot kunnossa'
                overrideValues={{
                  fieldType: 'switch',
                }}
              />
            }
          />
          <Divider />
          <FieldArray
            component={RentItemEdit}
            errors={errors}
            isSaveClicked={isSaveClicked}
            name='rents'
          />

          <h2>Vuokranperusteet</h2>
          <Divider />
          <GreenBoxEdit>
            <FieldArray
              component={BasisOfRentsEdit}
              isSaveClicked={isSaveClicked}
              name="basis_of_rents"
            />
          </GreenBoxEdit>

        </FormSectionComponent>
      </form>
    );
  }
}

const formName = FormNames.RENTS;

export default flowRight(
  connect(
    (state) => {
      return {
        errors: getErrorsByFormName(state, formName),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
  withRouter,
)(RentsEdit);
