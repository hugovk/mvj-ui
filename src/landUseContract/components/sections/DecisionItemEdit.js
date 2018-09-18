// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {FieldArray, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {getDecisionById} from '$src/decision/helpers';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/landUseContract/types';

type DecisionConditionsProps = {
  attributes: Attributes,
  collapseState: boolean,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
  onCollapseToggle: Function,
}

const renderDecisionConditions = ({
  attributes,
  collapseState,
  errors,
  fields,
  fields: {name},
  isSaveClicked,
  onCollapseToggle,
}: DecisionConditionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  const decisionConditionsErrors = get(errors, name);

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Collapse
            className='collapse__secondary'
            defaultOpen={collapseState !== undefined ? collapseState : true}
            hasErrors={isSaveClicked && !isEmpty(decisionConditionsErrors)}
            headerTitle={<h4 className='collapse__header-title'>Ehdot</h4>}
            onToggle={onCollapseToggle}
          >
            <BoxItemContainer>
              {fields && !!fields.length && fields.map((condition, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_DELETE_MODAL,
                    deleteFunction: () => {
                      fields.remove(index);
                    },
                    deleteModalLabel: DeleteModalLabels.CONDITION,
                    deleteModalTitle: DeleteModalTitles.CONDITION,
                  });
                };

                return (
                  <BoxItem key={index}>
                    <BoxContentWrapper>
                      <RemoveButton
                        className='position-topright'
                        onClick={handleRemove}
                        title="Poista ehto"
                      />
                      <Row>
                        <Column small={6} medium={4} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.type')}
                            name={`${condition}.type`}
                            overrideValues={{
                              label: 'Ehtotyyppi',
                            }}
                          />
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.supervision_date')}
                            name={`${condition}.supervision_date`}
                            overrideValues={{
                              label: 'Valvontapvm',
                            }}
                          />
                        </Column>
                        <Column small={12} medium={4} large={2}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.supervised_date')}
                            name={`${condition}.supervised_date`}
                            overrideValues={{
                              label: 'Valvottu pvm',
                            }}
                          />
                        </Column>
                        <Column small={12} medium={12} large={6}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.description')}
                            name={`${condition}.description`}
                            overrideValues={{
                              label: 'Huomautus',
                            }}
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
                  label='Lisää ehto'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </Collapse>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  conditionsCollapseState: boolean,
  decisionCollapseState: boolean,
  decisionsData: Array<Object>,
  decisionId: number,
  errors: ?Object,
  field: string,
  index: number,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
};

const DecisionItemEdit = ({
  attributes,
  conditionsCollapseState,
  decisionCollapseState,
  decisionsData,
  decisionId,
  errors,
  field,
  index,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
}: Props) => {
  const handleRemove = () => {
    onRemove(index);
  };

  const handleDecisionCollapseToggle = (val: boolean) => {
    if(!decisionId){return;}

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
    if(!decisionId){return;}

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

  const decisionMakerOptions = getAttributeFieldOptions(attributes, 'decisions.child.children.decision_maker'),
    decisionErrors = get(errors, field),
    savedDecision = getDecisionById(decisionsData, decisionId);

  return (
    <Collapse
      defaultOpen={decisionCollapseState !== undefined ? decisionCollapseState : true}
      hasErrors={isSaveClicked && !isEmpty(decisionErrors)}
      headerTitle={<h3 className='collapse__header-title'>{savedDecision ? (getLabelOfOption(decisionMakerOptions, get(savedDecision, 'decision_maker')) || '-') : '-'}</h3>}
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
      </BoxContentWrapper>

      <FieldArray
        attributes={attributes}
        collapseState={conditionsCollapseState}
        component={renderDecisionConditions}
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

    return {
      conditionsCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.conditions`),
      decisionCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}.decision`),
      decisionId: id,
    };
  },
  {
    receiveCollapseStates,
  }
)(DecisionItemEdit);
