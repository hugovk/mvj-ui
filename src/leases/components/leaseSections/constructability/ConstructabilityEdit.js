// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import {getIsConstructabilityFormValid} from '$src/leases/selectors';
import {receiveConstructabilityFormValid} from '$src/leases/actions';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {genericValidator} from '$components/form/validations';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeText from '$components/form/FieldTypeText';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FormSection from '$components/form/FormSection';
import RemoveButton from '$components/form/RemoveButton';

import type {Attributes} from '$src/leases/types';
import type {UserList} from '$src/users/types';

type CommentProps = {
  attributes: Attributes,
  fields: any,
}

const renderComments = ({attributes, fields}: CommentProps) => {
  return (
    <div>
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((comment, index) => {
          return (
            <BoxItem key={index}>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright-no-padding'
                  onClick={() => fields.remove(index)}
                  title="Poista kommentti"
                />
                <Row>
                  <Column small={6} medium={9} large={10}>
                    <Field
                      component={FieldTypeText}
                      label='Selitys'
                      name={`${comment}.text`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'lease_areas.child.children.constructability_descriptions.child.children.text')),
                      ]}
                    />
                  </Column>
                  <Column small={6} medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='AHJO diaarinumero'
                      name={`${comment}.ahjo_reference_number`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'lease_areas.child.children.constructability_descriptions.child.children.ahjo_reference_number')),
                      ]}
                    />
                  </Column>
                </Row>
              </BoxContentWrapper>
            </BoxItem>
          );
        })}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää selitys'
            onClick={() => fields.push({})}
            title='Lisää selitys'
          />
        </Column>
      </Row>
    </div>
  );
};


type AreaProps = {
  areas: Array<Object>,
  attributes: Attributes,
  fields: any,
  users: UserList,
}

const renderAreas = ({
  areas,
  attributes,
  fields,
  users,
}: AreaProps) => {
  const getFullAddress = (item: Object) => {
    return `${item.address}, ${item.postal_code} ${item.city}`;
  };
  const getUserOptions = (users: UserList) => {
    if(!users || !users.length) {
      return [];
    }
    return users.map((user) => {
      return {
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
      };
    });
  };
  const stateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.preconstruction_state');
  const pollutedLandConditionStateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.polluted_land_rent_condition_state');
  const constructabilityReportStateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.constructability_report_investigation_state');
  const userOptions = getUserOptions(users);
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  return (
    <div>
      {!fields || !fields.length &&
        <p className='no-margin'>Ei vuokra-alueita</p>
      }
      {areas && !!areas.length &&fields && !!fields.length && fields.map((area, index) => {
        return (
          <Collapse
            key={area.id ? area.id : `index_${index}`}
            className='no-content-top-padding'
            defaultOpen={true}
            header={
              <Row>
                <Column small={3}>
                  <h3  className='collapse__header-title'>
                    {areas[index].identifier}
                  </h3>
                </Column>
                <Column small={3}>
                  <span className='collapse__header-subtitle'>
                    {getLabelOfOption(typeOptions, areas[index].type) || '-'}
                  </span>
                </Column>
                <Column small={3}>
                  <span className='collapse__header-subtitle'>
                    {getFullAddress(areas[index])}
                  </span>
                </Column>
                <Column small={3}>
                  <span className='collapse__header-subtitle'>
                    {areas[index].area || '-'} m<sup>2</sup> / {getLabelOfOption(locationOptions, areas[index].location) || '-'}
                  </span>
                </Column>
              </Row>
            }
          >
            <Collapse
              className='collapse__secondary no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column small={12}>
                    <h4 className='collapse__header-title'>Esirakentaminen, johtosiirrot ja kunnallistekniikka</h4>
                  </Column>
                </Row>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Selvitysaste'
                    name={`${area}.preconstruction_state`}
                    options={stateOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.preconstruction_state')),
                    ]}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                name={`${area}.descriptionsPreconstruction`}
                component={renderComments}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column small={12}>
                    <h4 className='collapse__header-title'>Purku</h4>
                  </Column>
                </Row>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Selvitysaste'
                    name={`${area}.demolition_state`}
                    options={stateOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.demolition_state')),
                    ]}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                component={renderComments}
                name={`${area}.descriptionsDemolition`}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column small={12}>
                    <h4 className='collapse__header-title'>PIMA</h4>
                  </Column>
                </Row>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Selvitysaste'
                    name={`${area}.polluted_land_state`}
                    options={stateOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.polluted_land_state')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Vuokraehdot'
                    name={`${area}.polluted_land_rent_condition_state`}
                    options={pollutedLandConditionStateOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.polluted_land_rent_condition_state')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Päivämäärä'
                    name={`${area}.polluted_land_rent_condition_date`}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.polluted_land_rent_condition_date')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='PIMA valmistelija'
                    name={`${area}.polluted_land_planner`}
                    options={userOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.polluted_land_plannerr')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='ProjectWise kohdenumero'
                    name={`${area}.polluted_land_projectwise_number`}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.polluted_land_projectwise_number')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Matti raportti'
                    name={`${area}.polluted_land_matti_report_number`}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.polluted_land_matti_report_number')),
                    ]}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                component={renderComments}
                name={`${area}.descriptionsPollutedLand`}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column small={12}>
                    <h4 className='collapse__header-title'>Rakennettavuusselvitys</h4>
                  </Column>
                </Row>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Selvitysaste'
                    name={`${area}.constructability_report_state`}
                    options={stateOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.constructability_report_state')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Selvitys'
                    name={`${area}.constructability_report_investigation_state`}
                    options={constructabilityReportStateOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.constructability_report_investigation_state')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Allekirjoituspäivämäärä'
                    name={`${area}.constructability_report_signing_date`}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.constructability_report_signing_date')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Allekirjoittaja'
                    name={`${area}.constructability_report_signer`}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.constructability_report_signer')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Geotekninen palvelun tiedosto'
                    name={`${area}.constructability_report_geotechnical_number`}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.constructability_report_geotechnical_number')),
                    ]}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                component={renderComments}
                name={`${area}.descriptionsReport`}
              />
            </Collapse>

            <Collapse
              className='collapse__secondary no-content-top-padding'
              defaultOpen={true}
              header={
                <Row>
                  <Column small={12}>
                    <h4 className='collapse__header-title'>Muut</h4>
                  </Column>
                </Row>
              }
            >
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Selvitysaste'
                    name={`${area}.other_state`}
                    options={stateOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes, 'lease_areas.child.children.other_state')),
                    ]}
                  />
                </Column>
              </Row>
              <FieldArray
                attributes={attributes}
                component={renderComments}
                name={`${area}.descriptionsOther`}
              />
            </Collapse>
          </Collapse>
        );
      })}
    </div>
  );
};

type Props = {
  areas: Array<Object>,
  attributes: Attributes,
  handleSubmit: Function,
  isConstructabilityFormValid: boolean,
  receiveConstructabilityFormValid: Function,
  users: UserList,
  valid: boolean,
}

class ConstructabilityEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isConstructabilityFormValid, receiveConstructabilityFormValid, valid} = this.props;
    if(isConstructabilityFormValid !== valid) {
      receiveConstructabilityFormValid(valid);
    }
  }

  render () {
    const {areas, attributes, handleSubmit, users} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            areas={areas}
            attributes={attributes}
            component={renderAreas}
            name="lease_areas"
            users={users}
          />
        </FormSection>
      </form>
    );
  }
}

const formName = 'constructability-form';

export default flowRight(
  connect(
    (state) => {
      return {
        isConstructabilityFormValid: getIsConstructabilityFormValid(state),
      };
    },
    {
      receiveConstructabilityFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ConstructabilityEdit);
