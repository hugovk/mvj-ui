// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import DecisionConditionsEdit from './DecisionConditionsEdit';
import FormField from '$components/form/FormField';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  conditionsCollapseState: boolean,
  decisionCollapseState: boolean,
  decisionId: number,
  decisionsData: Array<Object>,
  errors: ?Object,
  field: string,
  index: number,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
}

const DecisionItemEdit = ({
  attributes,
  conditionsCollapseState,
  decisionCollapseState,
  decisionId,
  decisionsData,
  errors,
  field,
  index,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
}: Props) => {
  const getDecisionById = (id: number) => {
    if(!id) {
      return {};
    }
    return decisionsData.find((decision) => decision.id === id);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  const handleDecisionCollapseToggle = (val: boolean) => {
    if(!decisionId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.DECISIONS]: {
          [decisionId]: {
            decision: val,
          },
        },
      },
    });
  };

  const handleConditionsCollapseToggle = (val: boolean) => {
    if(!decisionId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.DECISIONS]: {
          [decisionId]: {
            conditions: val,
          },
        },
      },
    });
  };

  const decisionMakerOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.decision_maker');
  const decisionErrors = get(errors, field),
    savedDecision = getDecisionById(decisionId);

  return (
    <Collapse
      defaultOpen={decisionCollapseState !== undefined ? decisionCollapseState : true}
      hasErrors={isSaveClicked && !isEmpty(decisionErrors)}
      headerTitle={<h3 className='collapse__header-title'>{savedDecision ? (getLabelOfOption(decisionMakerOptions, savedDecision.decision_maker) || '-') : '-'}</h3>}
      onRemove={handleRemove}
      onToggle={handleDecisionCollapseToggle}
    >
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'decisions.child.children.decision_maker')}
              name={`${field}.decision_maker`}
              overrideValues={{
                label: 'Päättäjä',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'decisions.child.children.decision_date')}
              name={`${field}.decision_date`}
              overrideValues={{
                label: 'Päätöspvm',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'decisions.child.children.section')}
              name={`${field}.section`}
              unit='§'
              overrideValues={{
                label: 'Pykälä',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'decisions.child.children.type')}
              name={`${field}.type`}
              overrideValues={{
                label: 'Päätöksen tyyppi',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'decisions.child.children.reference_number')}
              name={`${field}.reference_number`}
              validate={referenceNumber}
              overrideValues={{
                label: 'Diaarinumero',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'decisions.child.children.description')}
              name={`${field}.description`}
              overrideValues={{
                label: 'Huomautus',
              }}
            />
          </Column>
        </Row>
      </BoxContentWrapper>

      <FieldArray
        collapseState={conditionsCollapseState}
        component={DecisionConditionsEdit}
        errors={errors}
        isSaveClicked={isSaveClicked}
        name={`${field}.conditions`}
        onCollapseToggle={handleConditionsCollapseToggle}
      />
    </Collapse>
  );
};

const formName = FormNames.DECISIONS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);

    if(id) {
      return {
        attributes: getAttributes(state),
        conditionsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.conditions`),
        decisionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.decision`),
        decisionId: id,
        errors: getErrorsByFormName(state, formName),
        isSaveClicked: getIsSaveClicked(state),
      };
    }
    return {
      attributes: getAttributes(state),
      decisionId: id,
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(DecisionItemEdit);