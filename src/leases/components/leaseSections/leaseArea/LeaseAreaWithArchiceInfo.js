// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import LeaseArea from './LeaseArea';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {
  FormNames,
  LeaseAreaAddressesFieldPaths,
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
} from '$src/leases/enums';
import {getFullAddress} from '$src/leases/helpers';
import {
  formatDate,
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  area: Object,
  areaCollapseState: boolean,
  attributes: Attributes,
  decisionOptions: Array<Object>,
  isActive: boolean,
  planUnitsContractCollapseState: boolean,
  planUnitsCurrentCollapseState: boolean,
  plotsContractCollapseState: boolean,
  plotsCurrentCollapseState: boolean,
  receiveCollapseStates: Function,
}

const LeaseAreaWithArchiveInfo = ({
  area,
  areaCollapseState,
  attributes,
  decisionOptions,
  isActive,
  receiveCollapseStates,
}: Props) => {
  const handleAreaCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            area: val,
          },
        },
      },
    });
  };

  const locationOptions = getFieldOptions(getFieldAttributes(attributes, LeaseAreasFieldPaths.LOCATION));
  const typeOptions = getFieldOptions(getFieldAttributes(attributes, LeaseAreasFieldPaths.TYPE));

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={areaCollapseState !== undefined ? areaCollapseState : isActive}
      headerSubtitles={
        <Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}>
              <CollapseHeaderSubtitle>{getLabelOfOption(typeOptions, area.type) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
              <CollapseHeaderSubtitle>{getFullAddress(get(area, 'addresses[0]')) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
              <CollapseHeaderSubtitle>{formatNumber(area.area) || '-'} m<sup>2</sup></CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
              <CollapseHeaderSubtitle>{getLabelOfOption(locationOptions, area.location) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
          {area.identifier || '-'}
        </Authorization>
      }
      onToggle={handleAreaCollapseToggle}
    >
      <LeaseArea area={area} isActive={isActive}/>

      {!isActive && <Divider className='lease-area-divider'/>}
      {!isActive &&
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_AT)}>
              <FormTextTitle>{LeaseAreasFieldTitles.ARCHIVED_AT}</FormTextTitle>
              <FormText>{formatDate(area.archived_at) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_DECISION)}>
              <FormTextTitle>{LeaseAreasFieldTitles.ARCHIVED_DECISION}</FormTextTitle>
              <FormText>{getLabelOfOption(decisionOptions, area.archived_decision) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={8}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_NOTE)}>
              <FormTextTitle>{LeaseAreasFieldTitles.ARCHIVED_NOTE}</FormTextTitle>
              <FormText>{area.archived_note || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>
      }
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = get(props, 'area.id');

    return {
      areaCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.area`),
      attributes: getAttributes(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(LeaseAreaWithArchiveInfo);
