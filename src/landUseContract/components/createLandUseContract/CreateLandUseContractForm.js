// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {FormNames} from '$src/landUseContract/enums';
import {getDistrictOptions} from '$src/district/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes} from '$src/landUseContract/selectors';

import type {DistrictList} from '$src/district/types';

import type {Attributes} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  change: Function,
  district: string,
  districts: DistrictList,
  fetchDistrictsByMunicipality: Function,
  municipality: string,
  onClose: Function,
  onSubmit: Function,
  valid: boolean,
}

class CreateLandUseContractForm extends Component<Props> {
  firstField: any

  componentDidUpdate(prevProps) {
    if(this.props.municipality !== prevProps.municipality) {
      const {change, fetchDistrictsByMunicipality} = this.props;

      if(this.props.municipality) {
        fetchDistrictsByMunicipality(this.props.municipality);
        change('district', '');
      } else {
        change('district', '');
      }
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  }

  setFocus = () => {
    this.firstField.focus();
  }

  handleCreate = () => {
    const {
      municipality,
      district,
      onSubmit,
    } = this.props;

    onSubmit({
      municipality: municipality,
      district: district,
    });
  };

  render() {
    const {
      attributes,
      districts,
      onClose,
      valid,
    } = this.props;

    const districtOptions = getDistrictOptions(districts);

    return (
      <form>
        <Row>
          <Column small={4} medium={3}>
            <FormField
              setRefForField={this.setRefForFirstField}
              fieldAttributes={get(attributes, 'municipality')}
              name='municipality'
              overrideValues={{
                label: 'Kunta',
              }}
            />
          </Column>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'district')}
              name='district'
              overrideValues={{
                label: 'Kaupunginosa',
                options: districtOptions,
              }}
            />
          </Column>
        </Row>
        <Row style={{marginTop: 5}}>
          <Column>
            <Button
              className='button-green pull-right no-margin'
              disabled={!valid}
              label='Luo tunnus'
              onClick={this.handleCreate}
            />
            <Button
              className='button-red pull-right'
              label='Peruuta'
              onClick={onClose}
            />
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = FormNames.CREATE_LAND_USE_CONTRACT;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      const municipality = selector(state, 'municipality');
      return {
        attributes: getAttributes(state),
        district: selector(state, 'district'),
        districts: getDistrictsByMunicipality(state, municipality),
        municipality: municipality,
      };
    },
    {
      change,
      fetchDistrictsByMunicipality,
    },
    null,
    {withRef: true}
  ),
  reduxForm({
    form: formName,
  }),
)(CreateLandUseContractForm);
