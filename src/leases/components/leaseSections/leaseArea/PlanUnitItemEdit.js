// @flow
import React from 'react';
import {FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';

import type {Attributes} from '$src/leases/types';

type AddressesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const AddressItems = ({attributes, fields, isSaveClicked}: AddressesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <SubTitle>Osoite</SubTitle>
            {fields && !!fields.length &&
              <Row>
                <Column small={6} large={6}>
                  <FormTextTitle required title='Osoite' />
                </Column>
                <Column small={3} large={3}>
                  <FormTextTitle title='Postinumero' />
                </Column>
                <Column small={3} large={3}>
                  <FormTextTitle title='Kaupunki' />
                </Column>
              </Row>
            }
            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_DELETE_MODAL,
                  deleteFunction: () => {
                    fields.remove(index);
                  },
                  deleteModalLabel: DeleteModalLabels.ADDRESS,
                  deleteModalTitle: DeleteModalTitles.ADDRESS,
                });
              };

              return (
                <Row key={index}>
                  <Column small={6} large={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.addresses.child.children.address')}
                      invisibleLabel
                      name={`${field}.address`}
                    />
                  </Column>
                  <Column small={3} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.addresses.child.children.postal_code')}
                      invisibleLabel
                      name={`${field}.postal_code`}
                    />
                  </Column>
                  <Column small={3} large={3}>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.addresses.child.children.city')}
                          invisibleLabel
                          name={`${field}.city`}
                        />
                      }
                      removeButton={
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title="Poista osoite"
                        />
                      }
                    />
                  </Column>
                </Row>
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää osoite'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
}

const PlanUnitItemEdit = ({
  attributes,
  field,
  isSaveClicked,
  onRemove,
}: Props) => {
  return (
    <BoxItem>
      <BoxContentWrapper>
        <RemoveButton
          className='position-topright'
          onClick={onRemove}
          title="Poista kaavayksikkö"
        />
        <Row>
          <Column small={12} medium={6} large={6}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.identifier')}
              name={`${field}.identifier`}
              overrideValues={{
                label: 'Tunnus',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.type')}
              name={`${field}.type`}
              overrideValues={{
                label: 'Määritelmä',
              }}
            />
          </Column>
        </Row>

        <FieldArray
          attributes={attributes}
          component={AddressItems}
          isSaveClicked={isSaveClicked}
          name={`${field}.addresses`}
        />

        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.area')}
              name={`${field}.area`}
              unit='m²'
              overrideValues={{
                label: 'Kokonaisala',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.section_area')}
              name={`${field}.section_area`}
              unit='m²'
              overrideValues={{
                label: 'Leikkausala',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_identifier')}
              name={`${field}.detailed_plan_identifier`}
              overrideValues={{
                label: 'Asemakaava',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date')}
              name={`${field}.detailed_plan_latest_processing_date`}
              overrideValues={{
                label: 'Asemakaavan viimeisin käsittelypvm',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date_note')}
              name={`${field}.detailed_plan_latest_processing_date_note`}
              overrideValues={{
                label: 'Asemakaavan viimeisin käsittelypvm huomautus',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_identifier')}
              name={`${field}.plot_division_identifier`}
              overrideValues={{
                label: 'Tonttijaon tunnus',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_state')}
              name={`${field}.plot_division_state`}
              overrideValues={{
                label: 'Tonttijaon olotila',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_date_of_approval')}
              name={`${field}.plot_division_date_of_approval`}
              overrideValues={{
                label: 'Tonttijaon hyväksymispvm',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_type')}
              name={`${field}.plan_unit_type`}
              overrideValues={{
                label: 'Kaavayksikön laji',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_state')}
              name={`${field}.plan_unit_state`}
              overrideValues={{
                label: 'Kaavayksikön olotila',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use')}
              name={`${field}.plan_unit_intended_use`}
              overrideValues={{
                label: 'Kaavayksikön käyttötarkoitus',
              }}
            />
          </Column>
        </Row>
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default PlanUnitItemEdit;
