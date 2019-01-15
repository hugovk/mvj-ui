// @flow
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddButtonThird from '$components/form/AddButtonThird';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactTemplate from '$src/contacts/components/templates/ContactTemplate';
import EditButton from '$components/form/EditButton';
import ExternalLink from '$components/links/ExternalLink';
import OtherTenantItemEdit from './OtherTenantItemEdit';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormWrapper from '$components/form/FormWrapper';
import FormWrapperLeft from '$components/form/FormWrapperLeft';
import FormWrapperRight from '$components/form/FormWrapperRight';
import SubTitle from '$components/content/SubTitle';
import {initializeContactForm, receiveContactModalSettings, receiveIsSaveClicked, showContactModal} from '$src/contacts/actions';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors, FieldTypes} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseTenantContactSetFieldPaths,
  LeaseTenantContactSetFieldTitles,
  LeaseTenantsFieldPaths,
  LeaseTenantsFieldTitles,
  TenantContactType,
} from '$src/leases/enums';
import {getFieldAttributes, isFieldAllowedToEdit, isFieldAllowedToRead, isFieldRequired} from '$util/helpers';
import {getContactFullName} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getMethods as getContactMethods} from '$src/contacts/selectors';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes, Methods} from '$src/types';

const ContactType = PropTypes.oneOf([TenantContactType.BILLING, TenantContactType.CONTACT]);

type OtherTenantsProps = {
  attributes: Attributes,
  contactType: ContactType,
  fields: any,
  tenant: Object,
}

const renderOtherTenants = ({
  attributes,
  contactType,
  fields,
  tenant,
}: OtherTenantsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.OTHER_TENANT,
                  confirmationModalTitle: DeleteModalTitles.OTHER_TENANT,
                });
              };

              return (
                <OtherTenantItemEdit
                  key={index}
                  contactType={contactType}
                  field={field}
                  onRemove={handleRemove}
                  tenant={tenant}
                />
              );
            })}

            <Authorization allow={isFieldAllowedToEdit(attributes, LeaseTenantContactSetFieldPaths.TENANTCONTACT_SET)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    className='no-top-margin'
                    label={(contactType === TenantContactType.BILLING) ? 'Lisää laskunsaaja' : 'Lisää yhteyshenkilö'}
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  contact: ?Object,
  contactMethods: Methods,
  errors: ?Object,
  field: string,
  initializeContactForm: Function,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  receiveContactModalSettings: Function,
  receiveIsSaveClicked: Function,
  showContactModal: Function,
  tenantId: number,
  tenants: Array<Object>,
}

const TenantItemEdit = ({
  attributes,
  collapseState,
  contact,
  contactMethods,
  errors,
  field,
  initializeContactForm,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  receiveContactModalSettings,
  receiveIsSaveClicked,
  showContactModal,
  tenantId,
  tenants,
}: Props) => {
  const getTenantById = (id: number) => {
    return id ? tenants.find((tenant) => tenant.id === id) : {};
  };

  const handleAddClick = () => {
    initializeContactForm({});
    receiveContactModalSettings({
      field: `${field}.tenant.contact`,
      contactId: null,
      isNew: true,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleEditClick = () => {
    initializeContactForm({...contact});
    receiveContactModalSettings({
      field: `${field}.tenant.contact`,
      contactId: null,
      isNew: false,
    });
    receiveIsSaveClicked(false);
    showContactModal();
  };

  const handleCollapseToggle = (val: boolean) => {
    if(!tenantId) return;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.TENANTS]: {
          tenants: {
            [tenantId]: val,
          },
        },
      },
    });
  };

  const contactReadOnlyRenderer = (value: ?Object) => {
    return <FormText>
      {value
        ? <ExternalLink
          className='no-margin'
          href={`${getRouteById(Routes.CONTACTS)}/${value.id}`}
          text={getContactFullName(value)}
        />
        : '-'
      }
    </FormText>;
  };

  const savedTenant = getTenantById(tenantId);
  const isActive = isTenantActive(get(savedTenant, 'tenant'));
  const tenantErrors = get(errors, field);

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={collapseState !== undefined ? collapseState : isActive}
      hasErrors={isSaveClicked && !isEmpty(tenantErrors)}
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
          {getContactFullName(get(savedTenant, 'tenant.contact')) || '-'}
        </Authorization>
      }
      onRemove={isFieldAllowedToEdit(attributes, LeaseTenantsFieldPaths.TENANTS) ? onRemove : null}
      onToggle={handleCollapseToggle}
    >
      <BoxContentWrapper>
        <FormWrapper>
          <FormWrapperLeft>
            <Row>
              <Column small={12}>
                <Row>
                  <Column small={9} medium={8}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(attributes, LeaseTenantContactSetFieldPaths.CONTACT)}
                        name={`${field}.tenant.contact`}
                        readOnlyValueRenderer={contactReadOnlyRenderer}
                        overrideValues={{
                          fieldType: FieldTypes.CONTACT,
                          label: LeaseTenantContactSetFieldTitles.CONTACT,
                        }}
                      />
                    </Authorization>
                  </Column>
                  <Column small={3} medium={4}>
                    <Authorization allow={contactMethods.POST}>
                      <div className='contact-buttons-wrapper'>
                        <AddButtonThird
                          label='Luo asiakas'
                          onClick={handleAddClick}
                        />
                      </div>
                    </Authorization>
                  </Column>
                </Row>
              </Column>
            </Row>
          </FormWrapperLeft>
          <FormWrapperRight>
            <Row>
              <Column small={12} medium={6} large={4}>
                <FormTextTitle required={isFieldRequired(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR) || isFieldRequired(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR)}>
                  {LeaseTenantsFieldTitles.SHARE_FRACTION}
                </FormTextTitle>
                <Row>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.SHARE_NUMERATOR)}
                        invisibleLabel
                        name={`${field}.share_numerator`}
                        overrideValues={{label: LeaseTenantsFieldTitles.SHARE_NUMERATOR}}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        className='with-slash'
                        fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.SHARE_DENIMONATOR)}
                        invisibleLabel
                        name={`${field}.share_denominator`}
                        overrideValues={{label: LeaseTenantsFieldTitles.SHARE_DENIMONATOR}}
                      />
                    </Authorization>
                  </Column>
                </Row>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(attributes, LeaseTenantContactSetFieldPaths.START_DATE)}
                    name={`${field}.tenant.start_date`}
                    overrideValues={{label: LeaseTenantContactSetFieldTitles.START_DATE}}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(attributes, LeaseTenantContactSetFieldPaths.END_DATE)}
                    name={`${field}.tenant.end_date`}
                    overrideValues={{label: LeaseTenantContactSetFieldTitles.END_DATE}}
                  />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperRight>

          <FormWrapperLeft>
            <Row>
              <Column>
                <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantsFieldPaths.REFERENCE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(attributes, LeaseTenantsFieldPaths.REFERENCE)}
                    name={`${field}.reference`}
                    overrideValues={{label: LeaseTenantsFieldTitles.REFERENCE}}
                  />
                </Authorization>
              </Column>
            </Row>
          </FormWrapperLeft>
        </FormWrapper>
      </BoxContentWrapper>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseTenantContactSetFieldPaths.TENANTCONTACT_SET)}>
        {!!contact &&
          <SubTitle>Asiakkaan tiedot
            <Authorization allow={contactMethods.PATCH}>
              <EditButton
                className='inline-button'
                onClick={handleEditClick}
                title='Muokkaa asiakasta'
              />
            </Authorization>
          </SubTitle>
        }
        <ContactTemplate contact={contact} />

        <FieldArray
          component={renderOtherTenants}
          attributes={attributes}
          contactType={TenantContactType.BILLING}
          name={`${field}.billing_persons`}
          tenant={savedTenant}
        />

        <FieldArray
          component={renderOtherTenants}
          attributes={attributes}
          contactType={TenantContactType.CONTACT}
          name={`${field}.contact_persons`}
          tenant={savedTenant}
        />
      </Authorization>
    </Collapse>
  );
};

const formName = FormNames.TENANTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);
    return {
      attributes: getAttributes(state),
      collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.tenants.${id}`),
      contact: selector(state, `${props.field}.tenant.contact`),
      contactMethods: getContactMethods(state),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
      tenantId: id,
    };
  },
  {
    initializeContactForm,
    receiveContactModalSettings,
    receiveCollapseStates,
    receiveIsSaveClicked,
    showContactModal,
  },
)(TenantItemEdit);
