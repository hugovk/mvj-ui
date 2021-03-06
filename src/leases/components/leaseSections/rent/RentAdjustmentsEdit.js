// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, initialize} from 'redux-form';
import {Row, Column} from 'react-foundation';
import addMonths from 'date-fns/addMonths';
import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import subDays from 'date-fns/subDays';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import BoxItemContainer from '$components/content/BoxItemContainer';
import DecisionLink from '$components/links/DecisionLink';
import FormText from '$components/form/FormText';
import RentAdjustmentEdit from './RentAdjustmentEdit';
import SteppedDiscountModal from './SteppedDiscountModal';
import {ConfirmationModalTexts, FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  LeaseRentAdjustmentsFieldPaths,
  RentAdjustmentAmountTypes,
  RentAdjustmentTypes,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getDecisionById, getDecisionOptions} from '$src/leases/helpers';
import {
  convertStrToDecimalNumber,
  formatNumber,
  getFieldOptions,
  hasPermissions,
} from '$util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  adjustments: Array<Object>,
  currentLease:Lease,
  fields: any,
  initialize: Function,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
}

type State = {
  amountTypeOptions: Array<Object>,
  currentLease: Lease,
  decisionOptions: Array<Object>,
  isSteppedDiscountModalOpen: boolean,
  leaseAttributes: Attributes,
}

class RentAdjustmentsEdit extends PureComponent<Props, State> {
  state = {
    amountTypeOptions: [],
    currentLease: {},
    decisionOptions: [],
    isSteppedDiscountModalOpen: false,
    leaseAttributes: null,
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.decisionOptions = getDecisionOptions(props.currentLease);
    }

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.amountTypeOptions = getFieldOptions(props.leaseAttributes, LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE);
    }

    return newState;
  }

  decisionReadOnlyRenderer = (value: ?number) => {
    const {currentLease, decisionOptions} = this.state;

    return <DecisionLink
      decision={getDecisionById(currentLease, value)}
      decisionOptions={decisionOptions}
    />;
  };

  handleAdd = () => {
    const {fields} = this.props;

    fields.push({});
  };

  handleCloseSteppedDiscountModal = () => {
    this.setState({isSteppedDiscountModalOpen: false});
  }

  handleOpenSteppedDiscountModal = () => {
    const {initialize} = this.props;
    
    this.setState({isSteppedDiscountModalOpen: true});
    initialize(FormNames.LEASE_STEPPED_DISCOUNT, {});
  }

  getSteppedDiscounts = (formValues: Object): Array<Object> => {
    const ranges = [];
    let months = 12;
    let current = formValues.start_date;
    
    const totalMonths = (convertStrToDecimalNumber(formValues.number_of_years) || 0) * months;
    const final = addMonths(new Date(current), totalMonths);

    while(!isAfter(new Date(current), final)) {
      const next = format(addMonths(new Date(current), months), 'yyyy-MM-dd');
      const endDate = format(subDays(new Date(next), 1), 'yyyy-MM-dd');
      
      ranges.push({
        start_date: current,
        end_date: endDate,
      });

      current = next;
    }
    
    const step = ((convertStrToDecimalNumber(formValues.percantage_beginning) || 0) - (convertStrToDecimalNumber(formValues.percantage_final) || 0)) / (convertStrToDecimalNumber(formValues.number_of_years) || 1);

    return ranges.map((range, index) => {
      return {
        ...range,
        type: RentAdjustmentTypes.DISCOUNT,
        intended_use: formValues.intended_use,
        full_amount: formatNumber((convertStrToDecimalNumber(formValues.percantage_beginning) || 0) - index * step),
        amount_type: RentAdjustmentAmountTypes.PERCENT_PER_YEAR,
        decision: formValues.decision,
        note: formValues.note,
      };
    });
  }

  handleSaveSteppedDiscount = (formValues: Object) => { 
    const {fields} = this.props;
    const discounts = this.getSteppedDiscounts(formValues);

    discounts.forEach((discount) => {
      fields.push(discount);
    });

    this.handleCloseSteppedDiscountModal();
  }

  render() {
    const {fields, isSaveClicked, usersPermissions} = this.props;
    const {
      amountTypeOptions, 
      decisionOptions,
      isSteppedDiscountModalOpen,
    } = this.state;

    if(!hasPermissions(usersPermissions, UsersPermissions.ADD_RENTADJUSTMENT) &&
      (!fields || !fields.length)) {
      return <FormText>Ei alennuksia tai korotuksia</FormText>;
    }

    return (
      <AppConsumer>
        {({dispatch}) => {
          return(
            <Fragment>
              <SteppedDiscountModal
                decisionOptions={decisionOptions}
                isOpen={isSteppedDiscountModalOpen}
                onClose={this.handleCloseSteppedDiscountModal}
                onSave={this.handleSaveSteppedDiscount}
              />
              {fields && !!fields.length &&
                <BoxItemContainer>
                  {fields.map((field, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          fields.remove(index);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText: ConfirmationModalTexts.DELETE_RENT_ADJUSTMENT.BUTTON,
                        confirmationModalLabel: ConfirmationModalTexts.DELETE_RENT_ADJUSTMENT.LABEL,
                        confirmationModalTitle: ConfirmationModalTexts.DELETE_RENT_ADJUSTMENT.TITLE,
                      });
                    };

                    return (
                      <RentAdjustmentEdit
                        key={index}
                        amountTypeOptions={amountTypeOptions}
                        decisionOptions={decisionOptions}
                        field={field}
                        isSaveClicked={isSaveClicked}
                        onRemove={handleRemove}
                      />
                    );
                  })}
                </BoxItemContainer>
              }

              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_RENTADJUSTMENT)}>
                <Row>
                  <Column>
                    <AddButtonSecondary
                      className={(!fields || !fields.length) ? 'no-top-margin' : ''}
                      label='Lisää alennus/korotus'
                      onClick={this.handleAdd}
                    />
                  </Column>
                </Row>
              </Authorization>
              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_RENTADJUSTMENT)}>
                <Row>
                  <Column>
                    <AddButtonSecondary
                      label='Lisää porrastettu alennus'
                      onClick={this.handleOpenSteppedDiscountModal}
                    />
                  </Column>
                </Row>
              </Authorization>
            </Fragment>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.LEASE_RENTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    return {
      adjustments: selector(state, props.fields.name),
      currentLease: getCurrentLease(state),
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    initialize,
  },
)(RentAdjustmentsEdit);
