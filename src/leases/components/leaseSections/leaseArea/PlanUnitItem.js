// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import BoxItem from '$components/content/BoxItem';
import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import {getAttributes} from '$src/leases/selectors';
import {formatDate, formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  planUnit: Object,
}

const PlanUnitItem = ({attributes, planUnit}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.type');
  const plotDivisionStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plot_division_state');
  const planUnitTypeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_type');
  const planUnitStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_state');
  const planUnitIntendedUseOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use');
  const addresses = get(planUnit, 'addresses', []);

  return (
    <BoxItem className='no-border-on-first-child'>
      <Row>
        <Column small={12} medium={6} large={6}>
          <FormFieldLabel>Tunnus</FormFieldLabel>
          <p><strong>{planUnit.identifier || '-'}</strong></p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Määritelmä</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, planUnit.type) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={6} large={6}>
          <FormFieldLabel>Osoite</FormFieldLabel>
        </Column>
        <Column small={3} large={3}>
          <FormFieldLabel>Postinumero</FormFieldLabel>
        </Column>
        <Column small={3} large={3}>
          <FormFieldLabel>Kaupunki</FormFieldLabel>
        </Column>
      </Row>
      {!addresses.length &&
        <Row>
          <Column small={6} large={6}>
            <p>-</p>
          </Column>
          <Column small={3} large={3}>
            <p>-</p>
          </Column>
          <Column small={3} large={3}>
            <p>-</p>
          </Column>
        </Row>
      }
      {!!addresses.length &&
        <div>
          <ListItems>
            {addresses.map((address) => {
              return (
                <Row key={address.id}>
                  <Column small={6} large={6}>
                    <p className='no-margin'>{address.address || '-'}</p>
                  </Column>
                  <Column small={3} large={3}>
                    <p className='no-margin'>{address.postal_code || '-'}</p>
                  </Column>
                  <Column small={3} large={3}>
                    <p className='no-margin'>{address.city || '-'}</p>
                  </Column>
                </Row>
              );
            })}
          </ListItems>
        </div>
      }
      <Row>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Kokonaisala</FormFieldLabel>
          <p>{formatNumber(planUnit.area) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Leikkausala</FormFieldLabel>
          <p>{formatNumber(planUnit.section_area) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Asemakaava</FormFieldLabel>
          <p>{planUnit.detailed_plan_identifier}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Asemakaavan viimeisin käsittelypvm</FormFieldLabel>
          <p>{formatDate(planUnit.detailed_plan_latest_processing_date) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Asemakaavan viimeisin käsittelypvm huomautus</FormFieldLabel>
          <p>{planUnit.detailed_plan_latest_processing_date_note || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>

        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Tonttijaon tunnus</FormFieldLabel>
          <p>{planUnit.plot_division_identifier || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Tonttijaon hyväksymispvm</FormFieldLabel>
          <p>{formatDate(planUnit.plot_division_date_of_approval) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Tonttijaon olotila</FormFieldLabel>
          <p>{getLabelOfOption(plotDivisionStateOptions, planUnit.plot_division_state) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>

        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Kaavayksikön laji</FormFieldLabel>
          <p>{getLabelOfOption(planUnitTypeOptions, planUnit.plan_unit_type) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Kaavayksikön olotila</FormFieldLabel>
          <p>{getLabelOfOption(planUnitStateOptions, planUnit.plan_unit_state) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Kaavayksikön käyttötarkoitus</FormFieldLabel>
          <p>{getLabelOfOption(planUnitIntendedUseOptions, planUnit.plan_unit_intended_use) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>

        </Column>
      </Row>
    </BoxItem>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(PlanUnitItem);
