// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray} from 'redux-form';
import classNames from 'classnames';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import AddIcon from '$components/icons/AddIcon';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import ContactInfoTemplate from '$src/contacts/components/ContactInfoTemplate';
import EditIcon from '$components/icons/EditIcon';
import IconButton from '$components/button/IconButton';
import OtherTenantItemsEdit from './OtherTenantItemsEdit';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import {getContactById} from '$src/contacts/helpers';
import {isTenantActive} from '$src/leases/helpers';
import {getContactOptions} from '$util/helpers';
import {getTenantsFormValues} from '$src/leases/selectors';
import {genericValidator} from '$components/form/validations';
import {receiveContactModalSettings, showContactModal} from '$src/leases/actions';
import {initializeContactForm} from '$src/contacts/actions';

import type {Attributes as ContactAttributes, Contact} from '$src/contacts/types';
import type {Attributes} from '$src/leases/types';

type Props = {
  allContacts: Array<Contact>,
  attributes: Attributes,
  contactAttributes: ContactAttributes,
  fields: any,
  formValues: Object,
  initializeContactForm: Function,
  receiveContactModalSettings: Function,
  showContactModal: Function,
}

const TenantItemsEdit = ({
  allContacts,
  attributes,
  contactAttributes,
  fields,
  formValues,
  initializeContactForm,
  receiveContactModalSettings,
  showContactModal,
}: Props) => {
  const contactOptions = getContactOptions(allContacts);

  return (
    <div>
      {fields && !!fields.length && fields.map((tenant, index) => {
        const contact = getContactById(allContacts, get(formValues, `${tenant}.tenant.contact`));
        const isActive = isTenantActive(get(formValues, `${tenant}.tenant`));

        return (
          <Collapse
            key={tenant.id ? tenant.id : `index_${index}`}
            className={classNames({'not-active': !isActive})}
            defaultOpen={isActive}
            headerTitle={
              <h3 className='collapse__header-title'>Vuokralainen {index + 1}</h3>
            }
          >
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright'
                label='Poista vuokralainen'
                onClick={() => fields.remove(index)}
                title='Poista vuokralainen'
              />
              <Row>
                <Column small={12} medium={6} large={4}>
                  <Row>
                    <Column small={9} medium={8} large={8}>
                      <Field
                        component={FieldTypeSelect}
                        label='Asiakas'
                        name={`${tenant}.tenant.contact`}
                        options={contactOptions}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'tenants.child.children.tenantcontact_set.child.children.contact')),
                        ]}
                      />
                    </Column>
                    <Column small={3} medium={4} large={4}>
                      <div className='contact-buttons-wrapper'>
                        <IconButton
                          onClick={() => {
                            initializeContactForm({});
                            receiveContactModalSettings({
                              field: `${tenant}.tenant.contact`,
                              contactId: null,
                              isNew: true,
                            });
                            showContactModal();
                          }}
                        >
                          <AddIcon
                            className='icon-medium'
                          />
                        </IconButton>
                        <IconButton
                          disabled={!contact}
                          onClick={() => {
                            initializeContactForm({...contact});
                            receiveContactModalSettings({
                              field: `${tenant}.tenant.contact`,
                              contactId: null,
                              isNew: false,
                            });
                            showContactModal();
                          }}
                        >
                          <EditIcon
                            className='icon-medium'
                          />
                        </IconButton>
                      </div>
                    </Column>
                  </Row>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <label className='mvj-form-field-label'>Osuus murtolukuna</label>
                  <Row>
                    <Column small={6}>
                      <Field
                        component={FieldTypeText}
                        name={`${tenant}.share_numerator`}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'tenants.child.children.share_numerator')),
                        ]}
                      />
                    </Column>
                    <Column small={6}>
                      <Field
                        className='with-slash'
                        component={FieldTypeText}
                        name={`${tenant}.share_denominator`}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'tenants.child.children.share_denominator')),
                        ]}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column small={12} medium={6} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Alkupäivämäärä'
                    name={`${tenant}.tenant.start_date`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.tenantcontact_set.child.children.start_date')),
                    ]}
                  />
                </Column>
                <Column small={12} medium={6} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Loppupäivämäärä'
                    name={`${tenant}.tenant.end_date`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.tenantcontact_set.child.children.end_date')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={4} large={4}>
                  <Field
                    component={FieldTypeText}
                    label='Viite'
                    name={`${tenant}.tenant.reference`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.reference')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={8} large={8}>
                  <Field
                    component={FieldTypeText}
                    label='Kommentti'
                    name={`${tenant}.tenant.note`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'tenants.child.children.note')),
                    ]}
                  />
                </Column>
              </Row>

              <ContactInfoTemplate
                attributes={contactAttributes}
                contact={contact}
              />
            </BoxContentWrapper>

            <FieldArray
              allContacts={allContacts}
              attributes={attributes}
              component={OtherTenantItemsEdit}
              contactAttributes={contactAttributes}
              name={`${tenant}.tenantcontact_set`}
            />
          </Collapse>
        );
      })
      }
      <Row>
        <Column>
          <AddButton
            className='no-margin'
            label='Lisää uusi vuokralainen'
            onClick={() => fields.push({})}
            title='Lisää uusi vuokralainen'
          />
        </Column>
      </Row>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      formValues: getTenantsFormValues(state),
    };
  },
  {
    initializeContactForm,
    receiveContactModalSettings,
    showContactModal,
  },
)(TenantItemsEdit);
